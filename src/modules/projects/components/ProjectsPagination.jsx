import { PAGE_SIZE_OPTIONS } from '../projects.utils.js'

export default function ProjectsPagination({
  meta,
  page,
  limit,
  loading,
  onPrev,
  onNext,
  onSetLimit,
  onClearFilters,
}) {
  const canPrev = page > 1 && !loading
  const canNext = Boolean(meta?.hasNext) && !loading

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        Showing page <span className="font-semibold text-slate-700">{meta.page}</span> • Total{' '}
        <span className="font-semibold text-slate-700">{meta.total}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-semibold text-slate-700">
          Page size
          <select
            value={limit}
            onChange={(e) => onSetLimit(Number(e.target.value))}
            className="ml-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Next
        </button>
        <button
          type="button"
          onClick={onClearFilters}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Clear filters
        </button>
      </div>
    </div>
  )
}

