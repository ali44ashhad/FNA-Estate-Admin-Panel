import { request } from '../../../shared/api/http.js'

export async function listCities() {
  const res = await request('/api/cities')
  return Array.isArray(res?.data) ? res.data : []
}

