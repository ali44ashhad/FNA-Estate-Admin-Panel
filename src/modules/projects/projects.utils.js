export const PROPERTY_TYPE_OPTIONS = /** @type {const} */ ([
  { value: '', label: 'All property types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'plot', label: 'Plot' },
  { value: 'villa', label: 'Villa' },
])

export const PAGE_SIZE_OPTIONS = /** @type {const} */ ([10, 20, 50])

export function formatCityLabel(city) {
  if (!city) return '—'
  return city.state ? `${city.name}, ${city.state}` : city.name
}

export function formatNumber(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-IN').format(n)
}

export function summarizePricing(project) {
  if (!project) return '—'
  if (project.pricingType === 'direct') {
    const min = project.price?.min
    const max = project.price?.max
    if (typeof min === 'number' && typeof max === 'number') return `Direct: ${formatNumber(min)} - ${formatNumber(max)}`
    return 'Direct: —'
  }
  if (project.pricingType === 'unit_based') {
    const units = Array.isArray(project.units) ? project.units : []
    if (units.length === 0) return 'Unit-based: —'
    const prices = units.flatMap((u) => [u?.minPrice, u?.maxPrice]).filter((x) => typeof x === 'number')
    const min = prices.length ? Math.min(...prices) : NaN
    const max = prices.length ? Math.max(...prices) : NaN
    return `Unit-based: ${Number.isFinite(min) ? formatNumber(min) : '—'} - ${Number.isFinite(max) ? formatNumber(max) : '—'}`
  }
  return '—'
}

export function parseImagesInput(text) {
  const raw = String(text ?? '')
  const parts = raw
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean)
  return [...new Set(parts)]
}

export function parseAmenitiesInput(text) {
  const raw = String(text ?? '')
  const parts = raw
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean)
  return [...new Set(parts)]
}

export function buildProjectsQuery(filters, page, limit) {
  const params = new URLSearchParams()
  if (filters?.cityId) params.set('cityId', filters.cityId)
  if (filters?.propertyType) params.set('propertyType', filters.propertyType)
  if (filters?.minPrice) params.set('minPrice', filters.minPrice)
  if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice)
  params.set('page', String(page))
  params.set('limit', String(limit))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

