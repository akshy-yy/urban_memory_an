import { Link } from 'react-router-dom';

export default function LiveDataInfo() {
  return (
    <div className="w-full h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-y-auto">
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-10 pb-20">
        
        {/* Header Section */}
        <div className="mb-8">
          <span className="inline-block bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider mb-2 border border-blue-200 dark:border-blue-800">
            Data Integration
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Live Road Work Data
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Yes, it is possible to get live road work data in India through integrated mapping apps, government portals, and GIS data networks. 
            Here is how our platform aggregates real-time infrastructure data.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Navigation Apps Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Navigation & Commuter Apps
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1.5">
                  Mappls App
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Features official real-time data from NHAI via API Setu, showing work-in-progress zones, lane closures, and landslide-prone stretches on national highways.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1.5">
                  Google Maps & HERE WeGo
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Provide real-time crowd-sourced and sensor-driven traffic flow information, congestion layers, and active incident/roadwork alerts.
                </p>
              </div>
            </div>
          </div>

          {/* Gov Platforms Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Infrastructure & Govt Platforms
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1.5">
                  ROADS INDIA
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  A geo-visual platform offering milestone-based data, project monitoring, and toll collection insights on public-private partnership road projects.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1.5">
                  State PWD Apps
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Platforms like the Road Status Information System used by regional public works departments allow official field updates on road openings and maintenance.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-blue-600 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Plan Your Journey</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              If you want to track live updates for a specific route, search the interactive map or let us know the specific highway you plan to travel.
            </p>
          </div>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-5 rounded-lg shadow-xs transition-colors whitespace-nowrap">
            Go to Map
          </Link>
        </div>

      </div>
    </div>
  );
}
