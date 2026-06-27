export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">System configuration and preferences</p>
      </div>

      {/* Account section */}
      <div className="bg-white">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Account</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Display Name</label>
              <input defaultValue="Maya Admin" className="w-full h-9 px-3 border border-gray-300 text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal" readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Username</label>
              <input defaultValue="maya" className="w-full h-9 px-3 border border-gray-300 text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal bg-gray-50" readOnly />
            </div>
          </div>
          <p className="text-xs text-gray-400">Account settings are managed by your system administrator.</p>
        </div>
      </div>

      {/* Application section */}
      <div className="bg-white">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Application</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { label: 'System Name', value: 'MAS Marine Admin' },
            { label: 'Version', value: '1.0.0' },
            { label: 'Database', value: 'MySQL (s23.hosterpk.com)' },
            { label: 'Environment', value: process.env.NODE_ENV ?? 'production' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exam proctoring section */}
      <div className="bg-white">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Exam Proctoring</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { label: 'Snapshot interval', value: '30 seconds' },
            { label: 'Tab-switch detection', value: 'Enabled' },
            { label: 'Session timeout', value: '8 hours' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
