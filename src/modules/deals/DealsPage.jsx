import { useMemo, useState } from 'react'
import ToggleSwitch from '../../shared/components/ToggleSwitch.jsx'

const dealTypeOptions = /** @type {const} */ ([
  { value: 'all', label: 'All types' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'plots', label: 'Plots' },
])

const initialDeals = [
  {
    id: 'd1',
    title: 'Trump Towers — Limited inventory',
    city: 'Noida',
    type: 'residential',
    active: true,
    featured: true,
    hot: true,
    verified: true,
  },
  {
    id: 'd2',
    title: 'Pre-launch: M3M Residences',
    city: 'Gurugram',
    type: 'residential',
    active: true,
    featured: false,
    hot: true,
    verified: false,
  },
  {
    id: 'd3',
    title: 'Plot offer — 2% additional discount',
    city: 'Jaipur',
    type: 'plots',
    active: false,
    featured: false,
    hot: false,
    verified: true,
  },
]

function Pill({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-800',
    emerald: 'bg-emerald-50 text-emerald-800',
    amber: 'bg-amber-50 text-amber-800',
    indigo: 'bg-indigo-50 text-indigo-800',
  }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone] ?? tones.slate}`}>{children}</span>
}

export default function DealsPage() {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [deals, setDeals] = useState(initialDeals)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return deals.filter((d) => {
      const matchesType = typeFilter === 'all' ? true : d.type === typeFilter
      const matchesQuery = q ? `${d.title} ${d.city} ${d.type}`.toLowerCase().includes(q) : true
      return matchesType && matchesQuery
    })
  }, [deals, query, typeFilter])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Deals</h2>
          <p className="mt-1 text-sm text-slate-600">More toggles: Active, Featured, Hot deal, Verified.</p>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            {dealTypeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deal…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
          <button type="button" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            Add deal
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Deal</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Hot</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{d.title}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {d.featured ? <Pill tone="emerald">Featured</Pill> : <Pill>Standard</Pill>}
                      {d.hot ? <Pill tone="amber">Hot</Pill> : null}
                      {d.verified ? <Pill tone="indigo">Verified</Pill> : <Pill>Unverified</Pill>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{d.city}</td>
                  <td className="px-4 py-3">
                    <Pill tone="slate">{d.type}</Pill>
                  </td>
                  <td className="px-4 py-3">
                    <ToggleSwitch
                      enabled={d.active}
                      label={`Toggle ${d.title} active`}
                      onChange={(next) => setDeals((prev) => prev.map((x) => (x.id === d.id ? { ...x, active: next } : x)))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ToggleSwitch
                      enabled={d.featured}
                      label={`Toggle ${d.title} featured`}
                      onChange={(next) => setDeals((prev) => prev.map((x) => (x.id === d.id ? { ...x, featured: next } : x)))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ToggleSwitch
                      enabled={d.hot}
                      label={`Toggle ${d.title} hot`}
                      onChange={(next) => setDeals((prev) => prev.map((x) => (x.id === d.id ? { ...x, hot: next } : x)))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ToggleSwitch
                      enabled={d.verified}
                      label={`Toggle ${d.title} verified`}
                      onChange={(next) => setDeals((prev) => prev.map((x) => (x.id === d.id ? { ...x, verified: next } : x)))}
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
                  <td className="px-4 py-10 text-center text-slate-500" colSpan={8}>
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

