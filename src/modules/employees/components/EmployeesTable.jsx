import { formatCityLabel } from '../employees.utils.js'

function RoleBadge({ role }) {
  const map = {
    admin: 'bg-slate-100 text-slate-800',
    operations: 'bg-indigo-50 text-indigo-800',
    sales: 'bg-emerald-50 text-emerald-800',
  }
  const cls = map[role] ?? 'bg-slate-100 text-slate-800'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{role}</span>
}

export default function EmployeesTable({ employees, loading, citiesLoading, cityById }) {
  const isLoading = loading || citiesLoading

  return (
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
            {isLoading ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
                  Loading…
                </td>
              </tr>
            ) : null}

            {!isLoading &&
              employees.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-slate-900">{e.name}</td>
                  <td className="px-4 py-3 text-slate-600">{e.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={e.role} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-600">{e.cityId ? formatCityLabel(cityById?.get?.(e.cityId)) : '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-600">{e.createdAt ? new Date(e.createdAt).toLocaleString() : '—'}</span>
                  </td>
                </tr>
              ))}

            {!isLoading && employees.length === 0 ? (
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
  )
}

