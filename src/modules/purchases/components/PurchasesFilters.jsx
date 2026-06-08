import { PURCHASE_SORT_BY_OPTIONS, PURCHASE_STATUS_OPTIONS, SORT_ORDER_OPTIONS } from '../purchases.utils.js'

export default function PurchasesFilters({ filters, sortBy, sortOrder, onChangeFilters, onChangeSortBy, onChangeSortOrder, onResetPage }) {
  const safe = filters ?? {}

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <label className="lg:col-span-3">
          <span className="text-xs font-semibold text-slate-700">Status</span>
          <select
            value={safe.status ?? 'all'}
            onChange={(e) => {
              onChangeFilters?.({ ...safe, status: e.target.value })
              onResetPage?.()
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            {PURCHASE_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="lg:col-span-3">
          <span className="text-xs font-semibold text-slate-700">From</span>
          <input
            type="datetime-local"
            value={safe.from ?? ''}
            onChange={(e) => {
              onChangeFilters?.({ ...safe, from: e.target.value })
              onResetPage?.()
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
        </label>

        <label className="lg:col-span-3">
          <span className="text-xs font-semibold text-slate-700">To</span>
          <input
            type="datetime-local"
            value={safe.to ?? ''}
            onChange={(e) => {
              onChangeFilters?.({ ...safe, to: e.target.value })
              onResetPage?.()
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
        </label>

        <label className="lg:col-span-2">
          <span className="text-xs font-semibold text-slate-700">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => {
              onChangeSortBy?.(e.target.value)
              onResetPage?.()
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            {PURCHASE_SORT_BY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="lg:col-span-1">
          <span className="text-xs font-semibold text-slate-700">Order</span>
          <select
            value={sortOrder}
            onChange={(e) => {
              onChangeSortOrder?.(e.target.value)
              onResetPage?.()
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            {SORT_ORDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

