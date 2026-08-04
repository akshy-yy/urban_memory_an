export default function Policies() {
  return (
    <div className="absolute inset-0 pt-20 bg-[var(--color-bg)] overflow-y-auto pointer-events-auto z-10 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[var(--color-navy)]">Major Policies & Updates</h1>
        <div className="bg-white p-6 rounded shadow border-l-4 border-[var(--color-saffron)]">
          <h2 className="text-xl font-bold mb-2">The "Dig Once" Policy</h2>
          <p className="text-gray-600">Roads that have been recently laid cannot be dug up for a minimum of 6 months by any other department, except in the case of critical emergencies.</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-[var(--color-navy)]">
          <h2 className="text-xl font-bold mb-2">Public Transparency Act</h2>
          <p className="text-gray-600">Citizens have the right to view the digital "Road Passport" of any street to track repair history.</p>
        </div>
      </div>
    </div>
  );
}
