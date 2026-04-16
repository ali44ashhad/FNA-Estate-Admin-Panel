function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-600">{hint}</p> : null}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Overview of inventory and recent activity (static for now).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Cities" value="8" hint="Active coverage" />
        <StatCard label="Projects" value="32" hint="Across categories" />
        <StatCard label="New leads" value="14" hint="Last 7 days" />
        <StatCard label="Employees" value="3" hint="Team accounts" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Recent leads</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {['Noida · 90L–1.2Cr · Residential', 'Pune · Plots · 60L', 'Gurugram · Commercial · 1.8Cr'].map((t) => (
              <li key={t} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                <span className="text-slate-700">{t}</span>
                <span className="text-xs font-semibold text-emerald-700">New</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Quick actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {['Add city', 'Add project', 'Export leads', 'Create user'].map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

