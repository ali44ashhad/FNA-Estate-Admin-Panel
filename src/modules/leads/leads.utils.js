export const LEAD_STATUS_OPTIONS = /** @type {const} */ ([
  { value: 'all', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'visited', label: 'Visited' },
  { value: 'closed', label: 'Closed' },
])

export const LEAD_SORT_BY_OPTIONS = /** @type {const} */ ([
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

export function humanizeInterest(interest) {
  if (!interest) return '—'
  const category = interest.category ? String(interest.category) : ''
  const subType = interest.subType ? String(interest.subType) : ''
  const cfg = interest.apartmentConfig ? String(interest.apartmentConfig) : ''
  const unit = interest.unitTypeLabel ? String(interest.unitTypeLabel) : ''

  const base = [category, subType].filter(Boolean).join('/')
  const parts = [base || '—']
  if (cfg) parts.push(cfg)
  if (unit) parts.push(unit)
  return parts.join(' • ')
}

export function buildLeadsQuery({ filters, page, limit, sortBy, sortOrder }) {
  const params = new URLSearchParams()

  const status = filters?.status
  if (status && status !== 'all') params.set('status', status)
  if (filters?.projectId) params.set('projectId', filters.projectId)
  if (filters?.userId) params.set('userId', filters.userId)
  if (filters?.assignedOpsId) params.set('assignedOpsId', filters.assignedOpsId)
  if (filters?.assignedSalesId) params.set('assignedSalesId', filters.assignedSalesId)

  params.set('page', String(page))
  params.set('limit', String(limit))
  if (sortBy) params.set('sortBy', String(sortBy))
  if (sortOrder) params.set('sortOrder', String(sortOrder))

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

