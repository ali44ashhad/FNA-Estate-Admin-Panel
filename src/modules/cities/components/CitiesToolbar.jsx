export default function CitiesToolbar({ q, onChangeQ, onCreate }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Cities</h2>
        <p className="mt-1 text-sm text-slate-600">Create, edit, and remove cities.</p>
      </div>
      <div className="flex w-full max-w-md gap-2">
        <input
          value={q}
          onChange={(e) => onChangeQ(e.target.value)}
          placeholder="Search city…"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
        />
        <button
          type="button"
          onClick={onCreate}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Add
        </button>
      </div>
    </div>
  )
}

