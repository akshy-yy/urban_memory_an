import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PAN_INDIA_WORKS, type RoadWork } from '../../data/mockWorks';
import axios from 'axios';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import HotspotLayer, { type ClusterPoint } from './HotspotLayer';

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

// Custom pulse markers for different statuses
function createStatusIcon(status: string) {
  const color = status === 'Critical' ? '#ef4444' : 
                status === 'In Progress' ? '#3b82f6' : 
                status === 'Planned' ? '#eab308' : '#22c55e';
  
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: ${color};
          opacity: 0.35;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></span>
        <div style="
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: ${color};
          border: 3px solid #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

interface RoadMapProps {
  searchCoords?: { lat: number; lng: number } | null;
  selectedRoad?: RoadWork | null;
  onSelectRoad?: (road: RoadWork | null) => void;
  filteredWorks?: RoadWork[];
  hotspotClusters?: ClusterPoint[];
}

export default function RoadMap({ searchCoords, selectedRoad, onSelectRoad, filteredWorks = PAN_INDIA_WORKS, hotspotClusters = [] }: RoadMapProps) {
  const [internalSelected, setInternalSelected] = useState<RoadWork | null>(null);

  const activeSelected = selectedRoad !== undefined ? selectedRoad : internalSelected;

  const handleMarkerClick = (work: RoadWork) => {
    if (onSelectRoad) {
      onSelectRoad(work);
    } else {
      setInternalSelected(work);
    }
  };

  const handleCloseDrawer = () => {
    if (onSelectRoad) {
      onSelectRoad(null);
    } else {
      setInternalSelected(null);
    }
  };

  const showHotspots = hotspotClusters.length > 0;

  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-[#0f172a]">
      <MapContainer 
        center={[20.5937, 78.9629]} // Centered on India
        zoom={5} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        {/* Esri World Imagery (Satellite) for high-contrast satellite view */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri, Maxar, Earthstar Geographics'
        />
        {/* Hybrid overlay for road and city boundaries */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />
        
        <MapController searchCoords={searchCoords} selectedRoad={activeSelected} />

        {/* Render EITHER hotspot clusters OR individual road-work markers */}
        {showHotspots ? (
          <HotspotLayer clusters={hotspotClusters} />
        ) : (
          filteredWorks.map(proj => (
            <Marker 
              key={proj.id} 
              position={[proj.lat, proj.lng]} 
              icon={createStatusIcon(proj.status)}
              eventHandlers={{ click: () => handleMarkerClick(proj) }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 font-sans">
                  <div className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">{proj.city}, {proj.state}</div>
                  <div className="font-bold text-sm text-gray-900 leading-snug">{proj.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{proj.roadName}</div>
                  <div className="mt-2 text-[11px] font-semibold text-gray-700 bg-gray-100 p-1.5 rounded">
                    Status: <span className="font-bold">{proj.status}</span> ({proj.dept})
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>

      {/* ROAD PASSPORT DRAWER */}
      {activeSelected && (
        <div className="w-96 max-w-[90vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl h-full absolute right-0 top-0 z-[1000] flex flex-col pointer-events-auto pt-16 animate-in slide-in-from-right duration-300 border-l border-gray-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 flex justify-between items-center shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300">Live Infrastructure Passport</span>
              </div>
              <h2 className="font-extrabold text-lg text-white mt-0.5">{activeSelected.city} Corridor</h2>
            </div>
            <button 
              onClick={handleCloseDrawer} 
              className="text-gray-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              &times;
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-grow hide-scrollbar">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">
                <span>{activeSelected.roadName}</span>
              </div>
              <h3 className="font-black text-xl text-gray-900 dark:text-white leading-tight mb-2">
                {activeSelected.title}
              </h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm
                ${activeSelected.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300' : 
                  activeSelected.status === 'Critical' ? 'bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300' : 
                  activeSelected.status === 'Planned' ? 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-300' : 
                  'bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-300'}`}>
                ● {activeSelected.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                  Work Type
                </p>
                <p className="font-bold text-xs text-gray-800 dark:text-gray-200">{activeSelected.type}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                  Department
                </p>
                <p className="font-bold text-xs text-blue-600 dark:text-blue-400">{activeSelected.dept}</p>
              </div>
            </div>

            <div className="bg-orange-50/80 dark:bg-orange-950/40 p-4 rounded-2xl border border-orange-200/60 dark:border-orange-900/50">
              <p className="text-[11px] text-orange-700 dark:text-orange-400 uppercase font-bold tracking-wider mb-1">
                Field Specification & Impact
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed mb-2 font-medium">{activeSelected.details}</p>
              <div className="text-[11px] font-bold text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/60 px-2.5 py-1 rounded-lg inline-block">
                Traffic Note: {activeSelected.impactLevel}
              </div>
            </div>

            <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span className="text-[11px] text-gray-400 font-semibold">Started</span>
                <span className="font-bold">{activeSelected.startDate}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span className="text-[11px] text-gray-400 font-semibold">Target Finish</span>
                <span className="font-bold text-green-600 dark:text-green-400">{activeSelected.completionDate}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-center">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
                  Synchronized with City Digging Logs
                </div>
                <p className="text-[10px] text-gray-400">Zero duplicate excavation guaranteed by UIMS spatial lock.</p>
              </div>
            </div>

            <TrafficSparkline roadId={activeSelected.roadName} />
          </div>
        </div>
      )}
    </div>
  );
}

function MapController({ searchCoords, selectedRoad }: { searchCoords?: { lat: number; lng: number } | null; selectedRoad?: RoadWork | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedRoad) {
      map.flyTo([selectedRoad.lat, selectedRoad.lng], 15, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    } else if (searchCoords) {
      map.flyTo([searchCoords.lat, searchCoords.lng], 14, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [searchCoords, selectedRoad, map]);

  return null;
}

function TrafficSparkline({ roadId }: { roadId: string }) {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    // roadId here in mock dataset is string, map it to 1,2,3
    let mappedId = "1";
    if (roadId.includes("Brigade")) mappedId = "2";
    if (roadId.includes("Ring")) mappedId = "3";
    
    axios.get(`http://localhost:8080/api/roadworks/traffic-forecast?segmentId=${mappedId}`)
      .then(res => {
        if (res.data.forecast) {
          setData(res.data.forecast.slice(0, 24)); // next 24 hours
        }
      }).catch(() => {});
  }, [roadId]);

  if (data.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700/60 mt-4">
      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">
        24h Traffic Forecast
      </p>
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={[0, 100]} hide />
            <Line type="basis" dataKey="predicted_congestion_pct" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
