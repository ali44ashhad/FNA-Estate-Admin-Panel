import { useMemo, useState } from 'react'
import ToggleSwitch from '../../shared/components/ToggleSwitch.jsx'

const initialCities = [
  { id: 'c1', name: 'Noida', state: 'Uttar Pradesh', active: true },
  { id: 'c2', name: 'Gurugram', state: 'Haryana', active: true },
  { id: 'c3', name: 'Pune', state: 'Maharashtra', active: true },
  { id: 'c4', name: 'Jaipur', state: 'Rajasthan', active: false },
]

export default function CitiesPage() {
  const [query, setQuery] = useState('')
  const [cities, setCities] = useState(initialCities)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cities
    return cities.filter((c) => `${c.name} ${c.state}`.toLowerCase().includes(q))
  }, [cities, query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cities</h2>
          <p className="mt-1 text-sm text-slate-600">Manage city coverage and visibility.</p>
        </div>
        <div className="flex w-full max-w-md gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
          <button
            type="button"
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Add
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                <td className="px-4 py-3 text-slate-600">{c.state}</td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    enabled={c.active}
                    label={`Toggle ${c.name} active`}
                    onChange={(next) =>
                      setCities((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: next } : x)))
                    }
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={4}>
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

