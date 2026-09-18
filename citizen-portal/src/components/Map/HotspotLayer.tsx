import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

export interface ClusterPoint {
  lat: number;
  lng: number;
  count: number;
  avgUrgency: number;
  /** optional label shown in popup */
  label?: string;
}

/** Returns a color based on average urgency (1-10 scale) */
function urgencyColor(urgency: number): string {
  if (urgency >= 7.5) return '#ef4444'; // red
  if (urgency >= 4)   return '#f59e0b'; // amber
  return '#22c55e';                     // green
}

/** Creates a large, pulsing divIcon for a complaint cluster */
function createClusterIcon(count: number, avgUrgency: number): L.DivIcon {
  const color = urgencyColor(avgUrgency);
  const size = Math.min(72, 40 + count * 4); // scale with complaint count, cap at 72px
  return L.divIcon({
    className: 'uims-cluster-marker',
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- pulsing ring -->
        <span style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background-color: ${color};
          opacity: 0.25;
          animation: ping 2s cubic-bezier(0,0,0.2,1) infinite;
        "></span>
        <!-- outer ring -->
        <span style="
          position: absolute;
          inset: 4px;
          border-radius: 50%;
          background-color: ${color};
          opacity: 0.18;
        "></span>
        <!-- inner circle -->
        <div style="
          width: ${size - 14}px;
          height: ${size - 14}px;
          border-radius: 50%;
          background-color: ${color};
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: system-ui, sans-serif;
          line-height: 1.1;
        ">
          <span style="font-size: ${count > 9 ? '13px' : '15px'}; font-weight: 900;">${count}</span>
          <span style="font-size: 9px; font-weight: 700; opacity: 0.9;">URG ${avgUrgency.toFixed(1)}</span>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Flyout controller — zooms map to fit all clusters when hotspots first appear */
function ClusterFitBounds({ clusters }: { clusters: ClusterPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (clusters.length === 0) return;
    const bounds = L.latLngBounds(clusters.map(c => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, duration: 1.4 });
  }, [clusters, map]);
  return null;
}

interface HotspotLayerProps {
  clusters: ClusterPoint[];
}

export default function HotspotLayer({ clusters }: HotspotLayerProps) {
  if (clusters.length === 0) return null;

  return (
    <>
      <ClusterFitBounds clusters={clusters} />
      {clusters.map((cluster, idx) => (
        <Marker
          key={idx}
          position={[cluster.lat, cluster.lng]}
          icon={createClusterIcon(cluster.count, cluster.avgUrgency)}
        >
          <Popup className="custom-leaflet-popup">
            <div className="p-1 font-sans min-w-[160px]">
              <div
                className="font-black text-sm mb-1"
                style={{ color: urgencyColor(cluster.avgUrgency) }}
              >
                🔥 Complaint Hotspot
              </div>
              <div className="text-xs text-gray-700 space-y-0.5">
                <p>
                  <span className="font-bold">Complaints:</span> {cluster.count}
                </p>
                <p>
                  <span className="font-bold">Avg Urgency:</span>{' '}
                  <span
                    className="font-black"
                    style={{ color: urgencyColor(cluster.avgUrgency) }}
                  >
                    {cluster.avgUrgency.toFixed(1)} / 10
                  </span>
                </p>
                {cluster.label && (
                  <p className="text-gray-500 italic text-[10px] mt-1">{cluster.label}</p>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
