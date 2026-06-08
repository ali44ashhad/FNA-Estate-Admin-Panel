import { formatMaybeDate } from '../visits.utils.js'

function StatusPill({ status }) {
  const map = {
    scheduled: 'bg-indigo-50 text-indigo-800',
    completed: 'bg-emerald-50 text-emerald-800',
    cancelled: 'bg-rose-50 text-rose-800',
  }
  const cls = map[status] ?? 'bg-slate-100 text-slate-800'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{status || '—'}</span>
}

export default function VisitsTable({ visits, loading, salesNameById, onOpen }) {
  const items = Array.isArray(visits) ? visits : []
  const lookup = salesNameById instanceof Map ? salesNameById : null

  function resolveSalesName(v) {
    if (v?.sales?.name) return v.sales.name
    if (!v?.salesId) return '—'
    return lookup?.get(v.salesId) || v.salesId
  }

  function resolveLeadLabel(v) {
    if (v?.lead?.leadNo) return `#${v.lead.leadNo}`
    if (typeof v?.lead?.id === 'string') return v.lead.id
    return v?.leadId || '—'
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Sales rep</th>
              <th className="px-4 py-3">Visit time</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={8}>
                  Loading…
                </td>
              </tr>
            ) : null}

            {!loading &&
              items.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{resolveLeadLabel(v)}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-500">{v.leadId || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{v?.lead?.project?.name || '—'}</p>
                    {v?.lead?.project?.projectCode ? (
                      <p className="mt-0.5 font-mono text-xs text-slate-500">{v.lead.project.projectCode}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{resolveSalesName(v)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatMaybeDate(v.visitTime)}</td>
                  <td className="px-4 py-3 text-slate-700">{v.location || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={v.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatMaybeDate(v.updatedAt || v.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpen?.(v)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View / Update
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={8}>
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
