import { request } from '../../../shared/api/http.js'

function buildEmployeesQuery({ q, role, page, limit }) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (role && role !== 'all') params.set('role', role)
  params.set('page', String(page))
  params.set('limit', String(limit))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export async function getEmployees({ q, role, page, limit }) {
  const queryString = buildEmployeesQuery({ q, role, page, limit })
  const res = await request(`/api/employees${queryString}`, { auth: true })
  const items = Array.isArray(res?.data) ? res.data : []
  const meta = res?.meta ?? null
  return { items, meta }
}

export async function createEmployee(payload) {
  const res = await request('/api/employees', { method: 'POST', body: payload, auth: true })
  return res?.data ?? null
}

