export default function Policies() {
  return (
    <div className="absolute inset-0 pt-20 bg-slate-50 dark:bg-slate-950 overflow-y-auto pointer-events-auto z-10 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Major Infrastructure Policies</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Key government guidelines and public transparency regulations governing road excavations.</p>
        </div>

        <div className="gov-card p-6 border-l-4 border-l-amber-600 rounded-xl bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">The "Dig Once" Policy</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Roads that have been recently laid or resurfaced cannot be dug up for a minimum period of 6 months by any utility department (Water, Electricity, Telecom), except under validated critical emergency protocols approved by the municipal commissioner.
          </p>
        </div>

        <div className="gov-card p-6 border-l-4 border-l-blue-900 rounded-xl bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Public Transparency Act</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Citizens have the legal right to inspect the digital "Road Passport" of any street to track repair history, contractor liability warranties, defect liability timelines, and active project timelines.
          </p>
        </div>
      </div>
    </div>
  );
}
