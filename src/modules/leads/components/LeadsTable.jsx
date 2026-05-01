import { formatMaybeDate, humanizeInterest } from '../leads.utils.js'

function StatusPill({ status }) {
  const map = {
    new: 'bg-slate-100 text-slate-800',
    contacted: 'bg-amber-50 text-amber-800',
    scheduled: 'bg-indigo-50 text-indigo-800',
    visited: 'bg-sky-50 text-sky-800',
    closed: 'bg-emerald-50 text-emerald-800',
  }
  const cls = map[status] ?? 'bg-slate-100 text-slate-800'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{status || '—'}</span>
}

export default function LeadsTable({ leads, loading, onOpen }) {
  const items = Array.isArray(leads) ? leads : []

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Project ID</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Assigned Ops</th>
              <th className="px-4 py-3">Assigned Sales</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={9}>
                  Loading…
                </td>
              </tr>
            ) : null}

            {!loading &&
              items.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{typeof l.leadNo === 'number' ? `#${l.leadNo}` : l.id}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-500">{l.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={l.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{humanizeInterest(l.interest)}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{l.project?.name || '—'}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-500">{l.projectId || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{l.user?.name || '—'}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-500">{l.userId || '—'}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{l.assignedOpsId || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{l.assignedSalesId || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{formatMaybeDate(l.updatedAt || l.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpen?.(l)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View / Update
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={9}>
                  No results
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

