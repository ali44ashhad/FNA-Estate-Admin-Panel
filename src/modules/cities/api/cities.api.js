import { request } from '../../../shared/api/http.js'
import { buildCitiesQuery } from '../cities.utils.js'

export async function getCities({ q, page, limit }) {
  const queryString = buildCitiesQuery({ q, page, limit })
  const res = await request(`/api/cities${queryString}`)
  const items = Array.isArray(res?.data) ? res.data : []
  const meta = res?.meta ?? null
  return { items, meta }
}

export async function createCity(payload) {
  const res = await request('/api/cities', { method: 'POST', auth: true, body: payload })
  return res?.data ?? null
}

export async function updateCity(id, payload) {
  const res = await request(`/api/cities/${id}`, { method: 'PUT', auth: true, body: payload })
  return res?.data ?? null
}

export async function deleteCity(id) {
  await request(`/api/cities/${id}`, { method: 'DELETE', auth: true })
}

