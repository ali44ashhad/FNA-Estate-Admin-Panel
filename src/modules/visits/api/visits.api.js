import { request } from '../../../shared/api/http.js'
import { buildVisitsQuery } from '../visits.utils.js'

export async function getVisits({ filters, page, limit, sortBy, sortOrder }) {
  const queryString = buildVisitsQuery({ filters, page, limit, sortBy, sortOrder })
  const res = await request(`/api/visits${queryString}`, { auth: true })
  const items = Array.isArray(res?.data?.items) ? res.data.items : Array.isArray(res?.data) ? res.data : []
  const meta = res?.data && typeof res.data === 'object' ? res.data : res?.meta ?? null
  return { items, meta }
}

export async function getVisitById(id) {
  const res = await request(`/api/visits/${id}`, { auth: true })
  return res?.data ?? null
}

export async function updateVisit(id, payload) {
  const res = await request(`/api/visits/${id}`, { method: 'PUT', auth: true, body: payload })
  return res?.data ?? null
}
