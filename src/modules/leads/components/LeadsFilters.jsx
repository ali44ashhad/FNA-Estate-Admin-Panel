import { LEAD_SORT_BY_OPTIONS, LEAD_STATUS_OPTIONS, SORT_ORDER_OPTIONS } from '../leads.utils.js'

export default function LeadsFilters({
  filters,
  sortBy,
  sortOrder,
  canEditAssignments = false,
  onChangeFilters,
  onChangeSortBy,
  onChangeSortOrder,
  onResetPage,
}) {
  const safe = filters ?? {}

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <label className="lg:col-span-2">
          <span className="text-xs font-semibold text-slate-700">Status</span>
          <select
            value={safe.status ?? 'all'}
            onChange={(e) => {
              onChangeFilters?.({ ...safe, status: e.target.value })
              onResetPage?.()
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            {LEAD_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="lg:col-span-3">
          <span className="text-xs font-semibold text-slate-700">Project ID</span>
          <input
            value={safe.projectId ?? ''}
            onChange={(e) => {
              onChangeFilters?.({ ...safe, projectId: e.target.value })
              onResetPage?.()
            }}
            placeholder="ObjectId…"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
        </label>

        <label className="lg:col-span-3">
          <span className="text-xs font-semibold text-slate-700">User ID</span>
          <input
            value={safe.userId ?? ''}
            onChange={(e) => {
              onChangeFilters?.({ ...safe, userId: e.target.value })
              onResetPage?.()
            }}
            placeholder="ObjectId…"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
        </label>

        {canEditAssignments ? (
          <label className="lg:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Assigned Ops ID</span>
            <input
              value={safe.assignedOpsId ?? ''}
              onChange={(e) => {
                onChangeFilters?.({ ...safe, assignedOpsId: e.target.value })
                onResetPage?.()
              }}
              placeholder="Employee ObjectId…"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            />
          </label>
        ) : null}

        {canEditAssignments ? (
          <label className="lg:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Assigned Sales ID</span>
            <input
              value={safe.assignedSalesId ?? ''}
              onChange={(e) => {
                onChangeFilters?.({ ...safe, assignedSalesId: e.target.value })
                onResetPage?.()
              }}
              placeholder="Employee ObjectId…"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            />
          </label>
        ) : null}

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
            {LEAD_SORT_BY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="lg:col-span-2">
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

