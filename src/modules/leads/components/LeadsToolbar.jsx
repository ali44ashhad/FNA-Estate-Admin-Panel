export default function LeadsToolbar({ title = 'Leads', subtitle = '', total = 0, query, onChangeQuery, rightSlot }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {subtitle || (
            <>
              Manage enquiries and pipeline status.{' '}
              <span className="font-semibold text-slate-800">{typeof total === 'number' ? total : 0}</span> total.
            </>
          )}
        </p>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <input
          value={query}
          onChange={(e) => onChangeQuery?.(e.target.value)}
          placeholder="Search by lead no / userId / projectId…"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
        />
        {rightSlot ? <div className="flex items-center justify-end gap-2">{rightSlot}</div> : null}
      </div>
    </div>
  )
}

