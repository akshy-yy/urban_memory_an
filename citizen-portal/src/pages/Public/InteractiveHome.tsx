import { useState } from 'react';
import RoadMap from '../../components/Map/RoadMap';
import { Search, Info } from 'lucide-react';

export default function InteractiveHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);

  const activeWorks = [
    { id: 1, lat: 28.6129, lng: 77.2090, title: "Rajpath Resurfacing", type: "Resurfacing", dept: "PWD", status: "In Progress", details: "Laying fresh bitumen on the central vista. 1 lane closed." },
    { id: 2, lat: 28.6150, lng: 77.2100, title: "Connaught Place Pipeline", type: "Pipeline Laying", dept: "Metro Water", status: "Planned", details: "Upgrading 50-year old water mains. Heavy machinery on site." },
    { id: 3, lat: 28.6200, lng: 77.2150, title: "India Gate Beautification", type: "Maintenance", dept: "NDMC", status: "In Progress", details: "Planting native trees and fixing pedestrian tiles." },
    { id: 4, lat: 28.5921, lng: 77.2273, title: "Lodhi Road Flyover Repair", type: "Structural Repair", dept: "NHAI", status: "Critical", details: "Fixing expansion joints on the flyover. Speed limit reduced to 30kmph." },
    { id: 5, lat: 28.5244, lng: 77.1855, title: "Qutub Minar Tourist Path", type: "Paving", dept: "Tourism Dept", status: "Completed", details: "New cobblestone path laid for better wheelchair access." }
  ];

  const filteredWorks = activeWorks.filter(w => w.title.toLowerCase().includes(searchQuery.toLowerCase()) || w.details.toLowerCase().includes(searchQuery.toLowerCase()) || w.dept.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredWorks.length > 0) setMapCenter({ lat: filteredWorks[0].lat, lng: filteredWorks[0].lng });
  };

  return (
    <div className="relative w-full h-full pt-16 pointer-events-none">
      <RoadMap searchCoords={mapCenter} />
      <div className="absolute top-20 left-4 w-96 max-w-[calc(100vw-2rem)] flex flex-col gap-4 z-10 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur shadow-lg rounded-lg p-4 border border-gray-200">
          <h2 className="font-bold text-lg text-[var(--color-navy)] mb-2 flex items-center gap-2"><Search size={20} /> Find Infrastructure Work</h2>
          <form onSubmit={handleSearchSubmit}>
            <input type="text" placeholder="Search by road..." className="w-full border border-gray-300 rounded-md p-2 mb-2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit" className="w-full gov-button-primary py-1.5 text-sm">Search Map</button>
          </form>
        </div>
        <div className="bg-white/95 backdrop-blur shadow-lg rounded-lg border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg"><h3 className="font-bold text-[var(--color-navy)] flex items-center gap-2"><Info size={18} /> Live Road Works</h3></div>
          <div className="overflow-y-auto p-4 space-y-3 max-h-[50vh] hide-scrollbar">
            {filteredWorks.map((work) => (
              <div key={work.id} onClick={() => setMapCenter({lat: work.lat, lng: work.lng})} className="p-3 border rounded-xl hover:border-[var(--color-saffron)] hover:bg-orange-50 cursor-pointer transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-[var(--color-navy)] group-hover:text-orange-700 transition-colors">{work.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${work.status === 'Critical' ? 'bg-red-100 text-red-700' : work.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{work.status}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{work.details}</p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">{work.dept}</span>
                  <span className="text-[10px] font-semibold text-gray-500">{work.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
