import { useState, useMemo } from 'react';
import RoadMap from '../../components/Map/RoadMap';
import { PAN_INDIA_WORKS, type RoadWork } from '../../data/mockWorks';
import axios from 'axios';
import { type ClusterPoint } from '../../components/Map/HotspotLayer';

const CITIES = ['All Cities', 'Bengaluru', 'New Delhi', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Kochi'];

export default function InteractiveHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedRoad, setSelectedRoad] = useState<RoadWork | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  // ── Hotspot state ──
  const [showHotspots, setShowHotspots] = useState(false);
  const [hotspotClusters, setHotspotClusters] = useState<ClusterPoint[]>([]);
  const [hotspotLoading, setHotspotLoading] = useState(false);

  /** Mock DBSCAN clusters for demo purposes — replaces backend data when unavailable */
  const MOCK_CLUSTERS: ClusterPoint[] = [
    { lat: 12.9716, lng: 77.5946, count: 14, avgUrgency: 8.2, label: 'Bengaluru Central — High density pothole & flooding cluster' },
    { lat: 28.6139, lng: 77.2090, count: 9,  avgUrgency: 6.5, label: 'New Delhi CP Area — Road damage cluster' },
    { lat: 19.0760, lng: 72.8777, count: 7,  avgUrgency: 5.8, label: 'Mumbai Andheri — Water leakage cluster' },
    { lat: 17.3850, lng: 78.4867, count: 5,  avgUrgency: 7.1, label: 'Hyderabad HITEC City — Drainage failure cluster' },
    { lat: 13.0827, lng: 80.2707, count: 11, avgUrgency: 9.0, label: 'Chennai Anna Nagar — Critical road damage' },
    { lat: 22.5726, lng: 88.3639, count: 6,  avgUrgency: 4.3, label: 'Kolkata Park Street — Minor defects cluster' },
    { lat: 18.5204, lng: 73.8567, count: 8,  avgUrgency: 6.9, label: 'Pune Kothrud — Broken footpath cluster' },
  ];

  const toggleHotspots = async () => {
    if (showHotspots) {
      // Turn off
      setShowHotspots(false);
      setHotspotClusters([]);
      return;
    }
    // Turn on — fetch from backend, fallback to mock
    setHotspotLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/complaints/hotspots');
      const data: ClusterPoint[] = Array.isArray(res.data) && res.data.length > 0
        ? res.data
        : MOCK_CLUSTERS;
      setHotspotClusters(data);
    } catch {
      setHotspotClusters(MOCK_CLUSTERS);
    } finally {
      setHotspotLoading(false);
      setShowHotspots(true);
    }
  };

  // Filter works by search query and city selection
  const filteredWorks = useMemo(() => {
    return PAN_INDIA_WORKS.filter(work => {
      const matchesCity = selectedCity === 'All Cities' || work.city.toLowerCase() === selectedCity.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        work.title.toLowerCase().includes(q) ||
        work.roadName.toLowerCase().includes(q) ||
        work.city.toLowerCase().includes(q) ||
        work.state.toLowerCase().includes(q) ||
        work.dept.toLowerCase().includes(q) ||
        work.details.toLowerCase().includes(q);
      return matchesCity && matchesSearch;
    });
  }, [searchQuery, selectedCity]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length > 1) {
      // Find first match and fly map to that area
      const match = PAN_INDIA_WORKS.find(w => 
        w.city.toLowerCase().includes(val.toLowerCase()) ||
        w.roadName.toLowerCase().includes(val.toLowerCase()) ||
        w.title.toLowerCase().includes(val.toLowerCase())
      );
      if (match) {
        setMapCenter({ lat: match.lat, lng: match.lng });
      }
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    if (city === 'All Cities') {
      setMapCenter({ lat: 20.5937, lng: 78.9629 }); // Pan-India view
    } else {
      const cityWork = PAN_INDIA_WORKS.find(w => w.city.toLowerCase() === city.toLowerCase());
      if (cityWork) {
        setMapCenter({ lat: cityWork.lat, lng: cityWork.lng });
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredWorks.length > 0) {
      const top = filteredWorks[0];
      setMapCenter({ lat: top.lat, lng: top.lng });
      setSelectedRoad(top);
    }
  };

  const handleCardClick = (work: RoadWork) => {
    setSelectedRoad(work);
    setMapCenter({ lat: work.lat, lng: work.lng });
  };

  return (
    <div className="relative w-full h-full pt-16 pointer-events-none overflow-hidden">
      {/* Interactive Satellite & Hybrid Map */}
      <RoadMap 
        searchCoords={mapCenter} 
        selectedRoad={selectedRoad} 
        onSelectRoad={setSelectedRoad}
        filteredWorks={filteredWorks}
        hotspotClusters={hotspotClusters}
      />

      {/* Floating Search & Projects Panel */}
      <div className="absolute top-20 left-4 w-96 max-w-[calc(100vw-2rem)] flex flex-col gap-3 z-10 pointer-events-auto max-h-[calc(100vh-6.5rem)]">
        
        {/* Search Header Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg rounded-xl p-4 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Find Infrastructure Work
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              {filteredWorks.length} active
            </span>
          </div>

          {/* Hotspot Toggle Button */}
          <button
            type="button"
            onClick={toggleHotspots}
            disabled={hotspotLoading}
            className={`w-full mb-3 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold text-xs transition-colors border ${
              showHotspots
                ? 'bg-red-600 text-white border-red-700 hover:bg-red-700 shadow-xs'
                : 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700 shadow-xs'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {hotspotLoading ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Fetching Hotspots…
              </>
            ) : showHotspots ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Hide Hotspots ({hotspotClusters.length} clusters active)
              </>
            ) : (
              <>
                View Complaint Hotspots
              </>
            )}
          </button>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Search by city, road, or department..." 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-3 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
              value={searchQuery} 
              onChange={(e) => handleSearchChange(e.target.value)} 
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); }}
                className="absolute right-2.5 top-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </form>

          {/* Quick City Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 hide-scrollbar">
            {CITIES.map(city => (
              <button
                key={city}
                type="button"
                onClick={() => handleCitySelect(city)}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  selectedCity === city
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Live Works List Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden flex-grow transition-colors">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              Pan-India Active Corridors
            </h3>
            <span className="text-[10px] text-slate-400">Click card to fly map</span>
          </div>

          <div className="overflow-y-auto p-3 space-y-2 max-h-[48vh] hide-scrollbar">
            {filteredWorks.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No active road works matched "{searchQuery}".
              </div>
            ) : (
              filteredWorks.map((work) => (
                <div 
                  key={work.id} 
                  onClick={() => handleCardClick(work)} 
                  className={`p-3 rounded-lg border transition-all cursor-pointer group ${
                    selectedRoad?.id === work.id 
                      ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/60 shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-800 dark:text-blue-400">
                      <span>{work.city} • {work.roadName}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase whitespace-nowrap ${
                      work.status === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300' : 
                      work.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' : 
                      work.status === 'Planned' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                    }`}>
                      {work.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {work.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {work.details}
                  </p>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {work.dept}
                    </span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {work.impactLevel}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
