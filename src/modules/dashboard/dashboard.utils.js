export function extractTotal(meta, items) {
  if (typeof meta?.total === 'number') return meta.total
  if (Array.isArray(items)) return items.length
  return null
}

export function formatStatValue(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') return value.toLocaleString()
  return String(value)
}
