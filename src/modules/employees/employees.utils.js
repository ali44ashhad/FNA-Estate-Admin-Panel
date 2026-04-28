export const ROLE_OPTIONS = /** @type {const} */ ([
  { value: 'all', label: 'All roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'operations', label: 'Operations' },
  { value: 'sales', label: 'Sales' },
])

export const PAGE_SIZE_OPTIONS = /** @type {const} */ ([10, 20, 50])

export function formatCityLabel(city) {
  if (!city) return '—'
  return city.state ? `${city.name}, ${city.state}` : city.name
}

