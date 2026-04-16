import { useMemo, useState } from 'react'
import ToggleSwitch from '../../shared/components/ToggleSwitch.jsx'

const initialProjects = [
  { id: 'p1', title: 'Trump Towers', city: 'Noida', category: 'Residential', active: true, featured: true },
  { id: 'p2', title: 'Kadamshree Anandam', city: 'Mathura', category: 'Plots', active: true, featured: false },
  { id: 'p3', title: 'M3M Jacob And Co Residences', city: 'Noida', category: 'Residential', active: true, featured: true },
  { id: 'p4', title: 'Aditya The Kutumb', city: 'Ghaziabad', category: 'Residential', active: false, featured: false },
]

export default function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [projects, setProjects] = useState(initialProjects)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((p) => `${p.title} ${p.city} ${p.category}`.toLowerCase().includes(q))
  }, [projects, query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Projects</h2>
          <p className="mt-1 text-sm text-slate-600">Control visibility, featured flag, and status.</p>
        </div>
        <div className="flex w-full max-w-md gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search project…"
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
          <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{p.title}</td>
                <td className="px-4 py-3 text-slate-600">{p.city}</td>
                <td className="px-4 py-3 text-slate-600">{p.category}</td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    enabled={p.active}
                    label={`Toggle ${p.title} active`}
                    onChange={(next) =>
                      setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: next } : x)))
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    enabled={p.featured}
                    label={`Toggle ${p.title} featured`}
                    onChange={(next) =>
                      setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: next } : x)))
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

