import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function RoadMap({ searchCoords }: { searchCoords?: {lat: number, lng: number} | null }) {
  const [selectedRoad, setSelectedRoad] = useState<any>(null);

  // Expanded mock data with more interesting projects across India (Delhi focus)
  const mockProjects = [
    { id: 1, lat: 28.6129, lng: 77.2090, title: "Rajpath Resurfacing", type: "Resurfacing", dept: "PWD", status: "In Progress", details: "Laying fresh bitumen on the central vista. 1 lane closed." },
    { id: 2, lat: 28.6150, lng: 77.2100, title: "Connaught Place Pipeline", type: "Pipeline Laying", dept: "Metro Water", status: "Planned", details: "Upgrading 50-year old water mains. Heavy machinery on site." },
    { id: 3, lat: 28.6200, lng: 77.2150, title: "India Gate Beautification", type: "Maintenance", dept: "NDMC", status: "In Progress", details: "Planting native trees and fixing pedestrian tiles." },
    { id: 4, lat: 28.5921, lng: 77.2273, title: "Lodhi Road Flyover Repair", type: "Structural Repair", dept: "NHAI", status: "Critical", details: "Fixing expansion joints on the flyover. Speed limit reduced to 30kmph." },
    { id: 5, lat: 28.5244, lng: 77.1855, title: "Qutub Minar Tourist Path", type: "Paving", dept: "Tourism Dept", status: "Completed", details: "New cobblestone path laid for better wheelchair access." }
  ];

  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-[#0f172a]">
      <MapContainer 
        center={[28.6139, 77.2090]} 
        zoom={13} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        {/* Esri World Imagery (Satellite) for the 'Google Earth' feel */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        />
        {/* Hybrid overlay for street names */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />
        
        <MapController searchCoords={searchCoords} />
        
        {mockProjects.map(proj => (
          <Marker 
            key={proj.id} 
            position={[proj.lat, proj.lng]} 
            eventHandlers={{ click: () => setSelectedRoad(proj) }}
          />
        ))}
      </MapContainer>

      {selectedRoad && (
        <div className="w-96 bg-white/95 backdrop-blur-md shadow-2xl h-full absolute right-0 top-0 z-[1000] flex flex-col pointer-events-auto pt-16 animate-in slide-in-from-right border-l border-gray-200">
          <div className="bg-[var(--color-navy)] text-white p-5 flex justify-between items-center shadow-md">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
              Live Road Passport
            </h2>
            <button onClick={() => setSelectedRoad(null)} className="text-white hover:text-[var(--color-saffron)] transition-colors p-1 bg-white/10 rounded-full w-8 h-8 flex items-center justify-center font-bold">&times;</button>
          </div>
          <div className="p-6 space-y-6 overflow-y-auto">
            <div>
              <h3 className="font-bold text-2xl text-gray-900 leading-tight mb-2">{selectedRoad.title}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${selectedRoad.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                  selectedRoad.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                  selectedRoad.status === 'Planned' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'}`}>
                {selectedRoad.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Work Type</p>
                <p className="font-semibold text-gray-800">{selectedRoad.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Department</p>
                <p className="font-semibold text-[var(--color-navy)]">{selectedRoad.dept}</p>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <p className="text-xs text-orange-600 uppercase font-bold tracking-wider mb-2">Live Field Update</p>
              <p className="text-gray-700 text-sm leading-relaxed">{selectedRoad.details}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <button className="w-full gov-button-primary flex justify-center py-3">View Full Timeline</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MapController({ searchCoords }: { searchCoords?: {lat: number, lng: number} | null }) {
  const map = useMap();
  useEffect(() => {
    if (searchCoords) {
      map.flyTo([searchCoords.lat, searchCoords.lng], 17, { duration: 1.5 });
    }
  }, [searchCoords, map]);
  return null;
}
