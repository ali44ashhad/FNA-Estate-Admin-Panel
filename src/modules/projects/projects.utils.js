export const CATEGORY_OPTIONS = /** @type {const} */ ([
  { value: 'commercial', label: 'Commercial' },
  { value: 'residential', label: 'Residential' },
])

export const SUBTYPE_OPTIONS_BY_CATEGORY = /** @type {const} */ ({
  commercial: [
    { value: 'sco', label: 'SCO' },
    { value: 'office', label: 'Office' },
    { value: 'showroom', label: 'Showroom' },
    { value: 'commercial_plot', label: 'Commercial plot' },
  ],
  residential: [
    { value: 'residential_plot', label: 'Residential plot' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa/House' },
  ],
})

export const PAGE_SIZE_OPTIONS = /** @type {const} */ ([10, 20, 50])

export function slugifyUnitKey(label) {
  return String(label ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

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
  const inv = Array.isArray(project.inventory) ? project.inventory : []
  if (inv.length === 0) return '—'

  /** @type {number[]} */
  const prices = []

  for (const row of inv) {
    const item = row || {}
    if (item.price && typeof item.price.min === 'number') prices.push(item.price.min)
    if (item.price && typeof item.price.max === 'number') prices.push(item.price.max)

    if (Array.isArray(item.units)) {
      for (const u of item.units) {
        if (u && typeof u.minPrice === 'number') prices.push(u.minPrice)
        if (u && typeof u.maxPrice === 'number') prices.push(u.maxPrice)
      }
    }

    if (Array.isArray(item.apartmentConfigs)) {
      for (const cfg of item.apartmentConfigs) {
        if (cfg?.price && typeof cfg.price.min === 'number') prices.push(cfg.price.min)
        if (cfg?.price && typeof cfg.price.max === 'number') prices.push(cfg.price.max)
        if (Array.isArray(cfg?.units)) {
          for (const u of cfg.units) {
            if (u && typeof u.minPrice === 'number') prices.push(u.minPrice)
            if (u && typeof u.maxPrice === 'number') prices.push(u.maxPrice)
          }
        }
      }
    }
  }

  const finite = prices.filter((n) => typeof n === 'number' && Number.isFinite(n))
  if (finite.length === 0) return '—'
  const min = Math.min(...finite)
  const max = Math.max(...finite)
  return `${formatNumber(min)} - ${formatNumber(max)}`
}

export function summarizeInventory(project) {
  const inv = Array.isArray(project?.inventory) ? project.inventory : []
  if (inv.length === 0) return '—'

  /** @type {string[]} */
  const parts = []
  for (const row of inv) {
    const category = row?.category
    const subType = row?.subType
    if (!category || !subType) continue

    if (category === 'residential' && subType === 'apartment' && Array.isArray(row?.apartmentConfigs)) {
      const configs = row.apartmentConfigs.map((c) => c?.config).filter(Boolean)
      if (configs.length) {
        parts.push(`residential/apartment(${configs.join(',')})`)
      } else {
        parts.push('residential/apartment')
      }
    } else {
      parts.push(`${category}/${subType}`)
    }
  }

  return parts.length ? parts.join(' • ') : '—'
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
  if (filters?.category) params.set('category', filters.category)
  if (filters?.subType) params.set('subType', filters.subType)
  if (filters?.apartmentConfig) params.set('apartmentConfig', filters.apartmentConfig)
  if (filters?.minPrice) params.set('minPrice', filters.minPrice)
  if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice)
  params.set('page', String(page))
  params.set('limit', String(limit))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

