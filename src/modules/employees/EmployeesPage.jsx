import { useMemo, useState } from 'react'
import ToggleSwitch from '../../shared/components/ToggleSwitch.jsx'

const roleOptions = /** @type {const} */ ([
  { value: 'all', label: 'All roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'operations', label: 'Operations' },
  { value: 'sales', label: 'Sales' },
])

const cityOptions = /** @type {const} */ ([
  { value: '', label: 'Select city' },
  { value: 'noida', label: 'Noida' },
  { value: 'gurugram', label: 'Gurugram' },
  { value: 'pune', label: 'Pune' },
  { value: 'jaipur', label: 'Jaipur' },
])

const initialEmployees = [
  { id: 'e1', name: 'Amit Sharma', email: 'amit@fnaestate.example', role: 'admin', city: '', active: true, onboarded: true },
  { id: 'e2', name: 'Neha Verma', email: 'neha@fnaestate.example', role: 'operations', city: 'noida', active: true, onboarded: true },
  { id: 'e3', name: 'Rahul Singh', email: 'rahul@fnaestate.example', role: 'sales', city: 'gurugram', active: false, onboarded: false },
]

function RoleBadge({ role }) {
  const map = {
    admin: 'bg-slate-100 text-slate-800',
    operations: 'bg-indigo-50 text-indigo-800',
    sales: 'bg-emerald-50 text-emerald-800',
  }
  const cls = map[role] ?? 'bg-slate-100 text-slate-800'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{role}</span>
}

function OnboardingForm({ onCreate, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('sales')
  const [city, setCity] = useState('')
  const [sendInvite, setSendInvite] = useState(true)
  const [active, setActive] = useState(true)

  const roleNeedsCity = role === 'sales' || role === 'operations'

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    if (roleNeedsCity && !city) return

    onCreate({
      id: `e_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      city: roleNeedsCity ? city : '',
      active,
      onboarded: sendInvite,
    })

    onClose()
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Employee onboarding</h3>
          <p className="mt-1 text-sm text-slate-600">Create employee account and optionally send invite.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="emp-name">
            Full name
          </label>
          <input
            id="emp-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            placeholder="e.g. Aman Gupta"
          />
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="emp-email">
            Email
          </label>
          <input
            id="emp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            placeholder="name@company.com"
          />
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="emp-role">
            Role
          </label>
          <select
            id="emp-role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
              setCity('')
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            <option value="admin">Admin</option>
            <option value="operations">Operations</option>
            <option value="sales">Sales</option>
          </select>
          <p className="mt-1 text-xs text-slate-500">Role-based access can be enforced later with backend auth.</p>
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="emp-city">
            Assigned city {roleNeedsCity ? <span className="text-rose-600">*</span> : <span className="text-slate-400">(optional)</span>}
          </label>
          <select
            id="emp-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!roleNeedsCity}
            className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              roleNeedsCity
                ? 'border-slate-200 bg-white text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/40'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
          >
            {cityOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {roleNeedsCity ? (
            <p className="mt-1 text-xs text-slate-500">Sales/Operations should be mapped to a city for lead routing.</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">Admins can manage all cities.</p>
          )}
        </div>

        <div className="sm:col-span-2 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-900">Send invite</span>
            <ToggleSwitch enabled={sendInvite} onChange={setSendInvite} label="Send invite" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-900">Active</span>
            <ToggleSwitch enabled={active} onChange={setActive} label="Employee active" />
          </div>
        </div>

        <div className="sm:col-span-2 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            Create employee
          </button>
        </div>
      </form>
    </div>
  )
}

export default function EmployeesPage() {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [employees, setEmployees] = useState(initialEmployees)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return employees.filter((e) => {
      const matchesRole = roleFilter === 'all' ? true : e.role === roleFilter
      const matchesQuery = q ? `${e.name} ${e.email} ${e.role}`.toLowerCase().includes(q) : true
      return matchesRole && matchesQuery
    })
  }, [employees, query, roleFilter])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Employees</h2>
          <p className="mt-1 text-sm text-slate-600">Role-based filter, status toggle, and onboarding.</p>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employee…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
          <button
            type="button"
            onClick={() => setShowOnboarding(true)}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Onboard
          </button>
        </div>
      </div>

      {showOnboarding ? (
        <OnboardingForm
          onCreate={(emp) => setEmployees((prev) => [emp, ...prev])}
          onClose={() => setShowOnboarding(false)}
        />
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Onboarded</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{e.name}</td>
                <td className="px-4 py-3 text-slate-600">{e.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={e.role} />
                </td>
                <td className="px-4 py-3 text-slate-600">{e.city ? cityOptions.find((c) => c.value === e.city)?.label : '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      e.onboarded ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {e.onboarded ? 'Yes' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    enabled={e.active}
                    label={`Toggle ${e.name} active`}
                    onChange={(next) =>
                      setEmployees((prev) => prev.map((x) => (x.id === e.id ? { ...x, active: next } : x)))
                    }
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
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
    </div>
  )
}

