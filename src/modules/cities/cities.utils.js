export const PAGE_SIZE_OPTIONS = /** @type {const} */ ([10, 20, 50])

export function buildCitiesQuery({ q, page, limit }) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  params.set('page', String(page))
  params.set('limit', String(limit))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

