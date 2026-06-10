import { Link } from 'react-router-dom'
import { ROUTES } from '../../shared/constants/routes.js'
import { humanizeInterest } from '../leads/leads.utils.js'
import StatCard from './components/StatCard.jsx'
import { useAdminDashboard } from './hooks/useAdminDashboard.js'

const QUICK_ACTIONS = [
  { label: 'Manage cities', to: ROUTES.cities },
  { label: 'Add project', to: ROUTES.projects },
  { label: 'View leads', to: ROUTES.leads },
  { label: 'Team accounts', to: ROUTES.employees },
]

function statusClass(status) {
  const map = {
    new: 'text-emerald-700',
    contacted: 'text-amber-700',
    scheduled: 'text-indigo-700',
    visited: 'text-sky-700',
    closed: 'text-slate-600',
  }
  return map[status] ?? 'text-slate-600'
}

export default function DashboardPage() {
  const { stats, recentLeads, loading } = useAdminDashboard()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Live overview of inventory, pipeline, and team.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cities" value={stats.cities} hint="Active coverage" to={ROUTES.cities} loading={loading} />
        <StatCard label="Projects" value={stats.projects} hint="Across categories" to={ROUTES.projects} loading={loading} />
        <StatCard label="Leads" value={stats.leads} hint="Total in pipeline" to={ROUTES.leads} loading={loading} />
        <StatCard label="Employees" value={stats.employees} hint="Team accounts" to={ROUTES.employees} loading={loading} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Visits" value={stats.visits} hint="Scheduled & completed" to={ROUTES.visits} loading={loading} />
        <StatCard label="Purchases" value={stats.purchases} hint="Bookings tracked" to={ROUTES.purchases} loading={loading} />
        <StatCard label="Users" value={stats.users} hint="Registered users" to={ROUTES.users} loading={loading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900">Recent leads</h3>
            <Link to={ROUTES.leads} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              View all
            </Link>
          </div>
          {loading ? (
            <ul className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </ul>
          ) : recentLeads.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No leads yet.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {recentLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {typeof lead.leadNo === 'number' ? `Lead #${lead.leadNo}` : lead.id}
                      {lead.project?.name ? ` · ${lead.project.name}` : ''}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{humanizeInterest(lead.interest)}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold capitalize ${statusClass(lead.status)}`}>
                    {lead.status || 'new'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Quick actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
