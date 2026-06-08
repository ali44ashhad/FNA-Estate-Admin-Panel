export const VISIT_STATUS_OPTIONS = /** @type {const} */ ([
  { value: 'all', label: 'All statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
])

export const VISIT_SORT_BY_OPTIONS = /** @type {const} */ ([
  { value: 'visitTime', label: 'Visit time' },
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

/**
 * Convert ISO datetime string from backend into the value expected by
 * <input type="datetime-local"> ("YYYY-MM-DDTHH:mm" in local time).
 */
export function toLocalDatetimeInput(value) {
  if (!value) return ''
  const dt = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(dt.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = dt.getFullYear()
  const mm = pad(dt.getMonth() + 1)
  const dd = pad(dt.getDate())
  const hh = pad(dt.getHours())
  const mi = pad(dt.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

export function buildVisitsQuery({ filters, page, limit, sortBy, sortOrder }) {
  const params = new URLSearchParams()

  const status = filters?.status
  if (status && status !== 'all') params.set('status', status)
  if (filters?.salesId) params.set('salesId', filters.salesId)
  if (filters?.leadId) params.set('leadId', filters.leadId)
  if (filters?.from) params.set('from', new Date(filters.from).toISOString())
  if (filters?.to) params.set('to', new Date(filters.to).toISOString())

  params.set('page', String(page))
  params.set('limit', String(limit))
  if (sortBy) params.set('sortBy', String(sortBy))
  if (sortOrder) params.set('sortOrder', String(sortOrder))

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}
