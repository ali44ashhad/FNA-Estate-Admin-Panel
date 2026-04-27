export default function ProjectsToolbar({ onCreate }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Projects</h2>
        <p className="mt-1 text-sm text-slate-600">Create, update, and remove projects.</p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCreate}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Add project
        </button>
      </div>
    </div>
  )
}

