import { ROLE_OPTIONS } from '../employees.utils.js'

export default function EmployeesToolbar({ role, onChangeRole, q, onChangeQ, onOpenOnboarding }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Employees</h2>
        <p className="mt-1 text-sm text-slate-600">List and onboard employees (admin only).</p>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <select
          value={role}
          onChange={(e) => onChangeRole(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => onChangeQ(e.target.value)}
          placeholder="Search employee…"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
        />
        <button
          type="button"
          onClick={onOpenOnboarding}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Onboard
        </button>
      </div>
    </div>
  )
}

