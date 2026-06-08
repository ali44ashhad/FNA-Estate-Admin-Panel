import { formatMaybeDate, formatMoneyINR } from '../purchases.utils.js'

function StatusPill({ status }) {
  const map = {
    booked: 'bg-emerald-50 text-emerald-800',
    cancelled: 'bg-rose-50 text-rose-800',
    refunded: 'bg-amber-50 text-amber-800',
  }
  const cls = map[status] ?? 'bg-slate-100 text-slate-800'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{status || '—'}</span>
}

export default function PurchasesTable({ purchases, loading, onOpen }) {
  const items = Array.isArray(purchases) ? purchases : []

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Purchase</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Agreed price</th>
              <th className="px-4 py-3 hidden md:table-cell">Inventory</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                  Loading…
                </td>
              </tr>
            ) : null}

            {!loading &&
              items.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{p.id || '—'}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{p.project?.name ?? p.projectId ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatMoneyINR(p.agreedPrice)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="font-mono text-xs text-slate-600">{p.inventoryKey || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatMaybeDate(p.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpen?.(p)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View / Update
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
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

