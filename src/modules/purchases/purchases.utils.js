export const PURCHASE_STATUS_OPTIONS = /** @type {const} */ ([
  { value: 'all', label: 'All statuses' },
  { value: 'booked', label: 'Booked' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
])

export const PURCHASE_SORT_BY_OPTIONS = /** @type {const} */ ([
  { value: 'createdAt', label: 'Created' },
  { value: 'updatedAt', label: 'Updated' },
])

export const SORT_ORDER_OPTIONS = /** @type {const} */ ([
  { value: 'desc', label: 'Newest first' },
  { value: 'asc', label: 'Oldest first' },
])

export const PAGE_SIZE_OPTIONS = /** @type {const} */ ([10, 20, 50])

export function formatMaybeDate(value) {
  if (!value) return '—'
  const dt = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(dt.getTime())) return '—'
  return dt.toLocaleString()
}

export function formatMoneyINR(value) {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return '—'
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
  } catch {
    return String(n)
  }
}

export function buildPurchasesQuery({ filters, page, limit, sortBy, sortOrder }) {
  const params = new URLSearchParams()

  const status = filters?.status
  if (status && status !== 'all') params.set('status', status)
  if (filters?.from) params.set('from', new Date(filters.from).toISOString())
  if (filters?.to) params.set('to', new Date(filters.to).toISOString())

  params.set('page', String(page))
  params.set('limit', String(limit))
  if (sortBy) params.set('sortBy', String(sortBy))
  if (sortOrder) params.set('sortOrder', String(sortOrder))

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

