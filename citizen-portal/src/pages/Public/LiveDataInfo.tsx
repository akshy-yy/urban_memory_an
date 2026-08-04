import { Activity, Map as MapIcon, Navigation, Radio } from 'lucide-react';

export default function LiveDataInfo() {
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12 overflow-y-auto h-full hide-scrollbar">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-100 mt-8 mb-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block shadow-sm">
              Data Integration
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-navy)] tracking-tight mb-4">
              Live Road Work Data
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Yes, it is possible to get live road work data in India through integrated mapping apps, government portals, and GIS data networks. 
              Here is how our platform aggregates real-time infrastructure data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Navigation Apps Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Navigation size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Navigation & Commuter Apps</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[var(--color-navy)] flex items-center gap-2 mb-2">
                    <MapIcon size={18} /> Mappls App
                  </h4>
                  <p className="text-sm text-gray-600">
                    Features official real-time data from NHAI via API Setu, showing work-in-progress zones, lane closures, and landslide-prone stretches on national highways.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[var(--color-navy)] flex items-center gap-2 mb-2">
                    <Activity size={18} /> Google Maps & HERE WeGo
                  </h4>
                  <p className="text-sm text-gray-600">
                    Provide real-time crowd-sourced and sensor-driven traffic flow information, congestion layers, and active incident/roadwork alerts.
                  </p>
                </div>
              </div>
            </div>

            {/* Gov Platforms Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Radio size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Infrastructure & Govt Platforms</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[var(--color-navy)] flex items-center gap-2 mb-2">
                    <MapIcon size={18} /> ROADS INDIA
                  </h4>
                  <p className="text-sm text-gray-600">
                    A geo-visual platform offering milestone-based data, project monitoring, and toll collection insights on public-private partnership road projects.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[var(--color-navy)] flex items-center gap-2 mb-2">
                    <Activity size={18} /> State PWD Apps
                  </h4>
                  <p className="text-sm text-gray-600">
                    Platforms like the Road Status Information System used by regional public works departments allow official field updates on road openings and maintenance.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 text-center bg-[var(--color-navy)] text-white p-8 rounded-2xl max-w-3xl mx-auto shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <h3 className="text-xl font-bold mb-2">Plan Your Journey</h3>
            <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto">
              If you want to track live updates for a specific route, search the interactive map or let us know the specific highway you plan to travel.
            </p>
            <button className="bg-[var(--color-saffron)] text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
              Go to Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
