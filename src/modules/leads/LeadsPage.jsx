import { useMemo, useState } from 'react'
import ToggleSwitch from '../../shared/components/ToggleSwitch.jsx'

const initialLeads = [
  { id: 'l1', name: 'Aman', phone: '+91 98xxxxxx12', city: 'Noida', status: 'New', contacted: false },
  { id: 'l2', name: 'Riya', phone: '+91 97xxxxxx42', city: 'Pune', status: 'In progress', contacted: true },
  { id: 'l3', name: 'Sameer', phone: '+91 88xxxxxx19', city: 'Gurugram', status: 'New', contacted: false },
]

export default function LeadsPage() {
  const [query, setQuery] = useState('')
  const [leads, setLeads] = useState(initialLeads)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return leads
    return leads.filter((l) => `${l.name} ${l.phone} ${l.city} ${l.status}`.toLowerCase().includes(q))
  }, [leads, query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Leads</h2>
          <p className="mt-1 text-sm text-slate-600">Track enquiries and update contact status.</p>
        </div>
        <div className="flex w-full max-w-md gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Export
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[880px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Contacted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{l.name}</td>
                <td className="px-4 py-3 text-slate-600">{l.phone}</td>
                <td className="px-4 py-3 text-slate-600">{l.city}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    enabled={l.contacted}
                    label={`Toggle contacted for ${l.name}`}
                    onChange={(next) => setLeads((prev) => prev.map((x) => (x.id === l.id ? { ...x, contacted: next } : x)))}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
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

