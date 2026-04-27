import { useEffect, useMemo, useState } from 'react'
import { request } from '../../shared/api/http.js'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    async function loadUsers() {
      setUsersLoading(true)
      setError('')
      try {
        const res = await request('/api/users', { auth: true })
        const data = Array.isArray(res?.data) ? res.data : []
        if (!alive) return
        setUsers(data)
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Failed to load users')
      } finally {
        if (!alive) return
        setUsersLoading(false)
      }
    }

    void loadUsers()

    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      const matchesQuery = q ? `${u.name} ${u.email}`.toLowerCase().includes(q) : true
      return matchesQuery
    })
  }, [users, query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Users</h2>
          <p className="mt-1 text-sm text-slate-600">Browse users (admin only).</p>
        </div>
        <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[820px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {usersLoading ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={3}>
                  Loading…
                </td>
              </tr>
            ) : null}
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="text-slate-600">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}</span>
                </td>
              </tr>
            ))}
            {!usersLoading && filtered.length === 0 ? (
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

