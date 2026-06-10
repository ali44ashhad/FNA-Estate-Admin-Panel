import { Link } from 'react-router-dom'
import { formatStatValue } from '../dashboard.utils.js'

export function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-3 w-20 rounded bg-slate-200" />
      <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-28 rounded bg-slate-100" />
    </div>
  )
}

export default function StatCard({ label, value, hint, to, loading }) {
  if (loading) return <StatCardSkeleton />

  const inner = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{formatStatValue(value)}</p>
      {hint ? <p className="mt-2 text-sm text-slate-600">{hint}</p> : null}
    </>
  )

  const className =
    'block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md'

  if (to) {
    return (
      <Link to={to} className={className}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}
