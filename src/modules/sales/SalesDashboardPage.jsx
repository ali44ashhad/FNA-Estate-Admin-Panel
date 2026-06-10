import { Link } from 'react-router-dom'
import { ROUTES } from '../../shared/constants/routes.js'
import StatCard from '../dashboard/components/StatCard.jsx'
import { humanizeInterest } from '../leads/leads.utils.js'
import { useSalesDashboard } from './hooks/useSalesDashboard.js'

function statusClass(status) {
  const map = {
    new: 'text-violet-700',
    contacted: 'text-amber-700',
    scheduled: 'text-indigo-700',
    visited: 'text-sky-700',
    closed: 'text-slate-600',
  }
  return map[status] ?? 'text-slate-600'
}

export default function SalesDashboardPage() {
  const { stats, recentLeads, loading } = useSalesDashboard()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Sales dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Your leads, visits, and follow-up queue at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Leads" value={stats.leads} hint="In your pipeline" to={ROUTES.salesLeads} loading={loading} />
        <StatCard label="Visits" value={stats.visits} hint="Scheduled & completed" to={ROUTES.salesVisits} loading={loading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900">Recent leads</h3>
            <Link to={ROUTES.salesLeads} className="text-xs font-semibold text-violet-700 hover:text-violet-800">
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
          <h3 className="text-base font-semibold text-slate-900">Quick links</h3>
          <div className="mt-4 grid gap-3">
            <Link
              to={ROUTES.salesLeads}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-violet-300 hover:bg-violet-50"
            >
              Manage leads
            </Link>
            <Link
              to={ROUTES.salesVisits}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-violet-300 hover:bg-violet-50"
            >
              View visits
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
