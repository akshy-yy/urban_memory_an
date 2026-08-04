import { useState, useMemo } from 'react';
import RoadMap from '../../components/Map/RoadMap';
import { PAN_INDIA_WORKS, type RoadWork } from '../../data/mockWorks';
import { Search, MapPin, Building, Activity, X } from 'lucide-react';

const CITIES = ['All Cities', 'Bengaluru', 'New Delhi', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Kochi'];

export default function InteractiveHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedRoad, setSelectedRoad] = useState<RoadWork | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

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
      />

      {/* Floating Search & Projects Panel */}
      <div className="absolute top-20 left-4 w-96 max-w-[calc(100vw-2rem)] flex flex-col gap-3 z-10 pointer-events-auto max-h-[calc(100vh-6.5rem)]">
        
        {/* Search Header Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-xl rounded-3xl p-4 border border-gray-200/80 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-extrabold text-base text-[var(--color-navy)] dark:text-blue-400 flex items-center gap-2">
              <Search size={18} className="text-blue-500" /> 
              Find Infrastructure Work
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              {filteredWorks.length} active
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Search by city, road, or department..." 
              className="w-full bg-gray-50 dark:bg-slate-800/90 border border-gray-300 dark:border-slate-700 rounded-2xl py-2.5 pl-3 pr-8 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" 
              value={searchQuery} 
              onChange={(e) => handleSearchChange(e.target.value)} 
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); }}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={15} />
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
                className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Live Works List Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-xl rounded-3xl border border-gray-200/80 dark:border-slate-800 flex flex-col overflow-hidden flex-grow transition-colors">
          <div className="p-3.5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Activity size={15} className="text-orange-500" />
              Pan-India Active Corridors
            </h3>
            <span className="text-[10px] text-gray-400">Click card to fly map</span>
          </div>

          <div className="overflow-y-auto p-3 space-y-2.5 max-h-[48vh] hide-scrollbar">
            {filteredWorks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                No active road works matched "{searchQuery}".
              </div>
            ) : (
              filteredWorks.map((work) => (
                <div 
                  key={work.id} 
                  onClick={() => handleCardClick(work)} 
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                    selectedRoad?.id === work.id 
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 shadow-md' 
                      : 'border-gray-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-800/40 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                      <MapPin size={11} className="text-red-500 flex-shrink-0" />
                      <span>{work.city} • {work.roadName}</span>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase whitespace-nowrap ${
                      work.status === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 
                      work.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 
                      work.status === 'Planned' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    }`}>
                      {work.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {work.title}
                  </h4>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                    {work.details}
                  </p>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-slate-700/60 text-[10px]">
                    <span className="font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <Building size={10} /> {work.dept}
                    </span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
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
