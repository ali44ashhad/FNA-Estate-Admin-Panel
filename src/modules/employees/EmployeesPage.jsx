import { useEffect, useMemo, useState } from 'react'
import ToggleSwitch from '../../shared/components/ToggleSwitch.jsx'
import { request } from '../../shared/api/http.js'

const roleOptions = /** @type {const} */ ([
  { value: 'all', label: 'All roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'operations', label: 'Operations' },
  { value: 'sales', label: 'Sales' },
])

function formatCityLabel(city) {
  if (!city) return '—'
  return city.state ? `${city.name}, ${city.state}` : city.name
}

function RoleBadge({ role }) {
  const map = {
    admin: 'bg-slate-100 text-slate-800',
    operations: 'bg-indigo-50 text-indigo-800',
    sales: 'bg-emerald-50 text-emerald-800',
  }
  const cls = map[role] ?? 'bg-slate-100 text-slate-800'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{role}</span>
}

function OnboardingForm({ cities, onCreate, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('sales')
  const [cityId, setCityId] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const roleNeedsCity = role === 'sales' || role === 'operations'

  async function submit(e) {
    e.preventDefault()
    setError('')

    const nextName = name.trim()
    const nextEmail = email.trim().toLowerCase()

    if (!nextName || !nextEmail || !password) {
      setError('Name, email, and password are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (roleNeedsCity && !cityId) {
      setError('City is required for Sales/Operations.')
      return
    }

    setCreating(true)
    try {
      const body = {
        name: nextName,
        email: nextEmail,
        password,
        role,
        ...(cityId ? { cityId } : {}),
      }
      const res = await request('/api/employees', { method: 'POST', body, auth: true })
      const employee = res?.data
      if (!employee?.id) throw new Error(res?.message || 'Failed to create employee')
      onCreate(employee)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Employee onboarding</h3>
          <p className="mt-1 text-sm text-slate-600">Create an employee account (admin-only).</p>
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

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700" htmlFor="emp-password">
            Password
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id="emp-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">This sets the employee’s initial login password.</p>
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
              setCityId('')
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            <option value="admin">Admin</option>
            <option value="operations">Operations</option>
            <option value="sales">Sales</option>
          </select>
          <p className="mt-1 text-xs text-slate-500">Backend enforces admin-only access for this page.</p>
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="emp-city">
            Assigned city {roleNeedsCity ? <span className="text-rose-600">*</span> : <span className="text-slate-400">(optional)</span>}
          </label>
          <select
            id="emp-city"
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            disabled={!roleNeedsCity}
            className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              roleNeedsCity
                ? 'border-slate-200 bg-white text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/40'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
          >
            <option value="">{cities?.length ? 'Select city' : 'No cities found'}</option>
            {(cities || []).map((c) => (
              <option key={c.id} value={c.id}>
                {formatCityLabel(c)}
              </option>
            ))}
          </select>
          {roleNeedsCity ? (
            <p className="mt-1 text-xs text-slate-500">Sales/Operations should be mapped to a city for lead routing.</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">Admins can manage all cities.</p>
          )}
        </div>

        {error ? (
          <div className="sm:col-span-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div>
        ) : null}

        <div className="sm:col-span-2 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {creating ? 'Creating…' : 'Create employee'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function EmployeesPage() {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [employees, setEmployees] = useState([])
  const [employeesLoading, setEmployeesLoading] = useState(true)
  const [cities, setCities] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  const [error, setError] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    let alive = true

    async function loadCities() {
      setCitiesLoading(true)
      let data = []
      try {
        const res = await request('/api/cities')
        data = Array.isArray(res?.data) ? res.data : []
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : 'Failed to load cities')
      } finally {
        if (alive) setCitiesLoading(false)
      }

      if (!alive) return
      setCities(data)
    }

    async function loadEmployees() {
      setEmployeesLoading(true)
      let data = []
      try {
        const res = await request('/api/employees', { auth: true })
        data = Array.isArray(res?.data) ? res.data : []
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : 'Failed to load employees')
      } finally {
        if (alive) setEmployeesLoading(false)
      }

      if (!alive) return
      setEmployees(data)
    }

    void loadCities()
    void loadEmployees()

    return () => {
      alive = false
    }
  }, [])

  const cityById = useMemo(() => {
    const map = new Map()
    for (const c of cities) map.set(c.id, c)
    return map
  }, [cities])

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
          <p className="mt-1 text-sm text-slate-600">List and onboard employees (admin only).</p>
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

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}

      {showOnboarding ? (
        <OnboardingForm
          cities={cities}
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
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {employeesLoading || citiesLoading ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
                  Loading…
                </td>
              </tr>
            ) : null}
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{e.name}</td>
                <td className="px-4 py-3 text-slate-600">{e.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={e.role} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-600">
                    {e.cityId ? formatCityLabel(cityById.get(e.cityId)) : '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-600">{e.createdAt ? new Date(e.createdAt).toLocaleString() : '—'}</span>
                </td>
              </tr>
            ))}
            {!employeesLoading && !citiesLoading && filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
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

