import { useState } from 'react'
import { createEmployee } from '../api/employees.api.js'
import { formatCityLabel } from '../employees.utils.js'

export default function EmployeeOnboardingForm({ cities, onCreate, onClose }) {
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
      const employee = await createEmployee(body)
      if (!employee?.id) throw new Error('Failed to create employee')
      onCreate?.(employee)
      onClose?.()
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

        {error ? <div className="sm:col-span-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div> : null}

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

