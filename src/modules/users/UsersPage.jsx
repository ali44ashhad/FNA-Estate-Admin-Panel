import { useMemo, useState } from 'react'
import ToggleSwitch from '../../shared/components/ToggleSwitch.jsx'

const initialUsers = [
  { id: 'u1', name: 'Aman Gupta', email: 'aman.gupta@fnaestate.example', active: true },
  { id: 'u2', name: 'Riya Sharma', email: 'riya.sharma@fnaestate.example', active: true },
  { id: 'u3', name: 'Sameer Khan', email: 'sameer.khan@fnaestate.example', active: false },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all') // all | active | inactive

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      const matchesQuery = q ? `${u.name} ${u.email}`.toLowerCase().includes(q) : true
      const matchesStatus =
        status === 'all' ? true : status === 'active' ? u.active === true : u.active === false
      return matchesQuery && matchesStatus
    })
  }, [users, query, status])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Users</h2>
          <p className="mt-1 text-sm text-slate-600">Manage admin accounts and access.</p>
        </div>
        <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
          <button
            type="button"
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Invite user
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    enabled={u.active}
                    label={`Toggle ${u.name} active`}
                    onChange={(next) => setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, active: next } : x)))}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={3}>
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

