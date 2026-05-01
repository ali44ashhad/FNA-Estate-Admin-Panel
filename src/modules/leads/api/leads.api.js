import { request } from '../../../shared/api/http.js'
import { buildLeadsQuery } from '../leads.utils.js'

export async function getLeads({ filters, page, limit, sortBy, sortOrder }) {
  const queryString = buildLeadsQuery({ filters, page, limit, sortBy, sortOrder })
  const res = await request(`/api/leads${queryString}`, { auth: true })
  const items = Array.isArray(res?.data?.items) ? res.data.items : Array.isArray(res?.data) ? res.data : []
  const meta = res?.data && typeof res.data === 'object' ? res.data : res?.meta ?? null
  return { items, meta }
}

export async function getLeadById(id) {
  const res = await request(`/api/leads/${id}`, { auth: true })
  return res?.data ?? null
}

export async function updateLead(id, payload) {
  const res = await request(`/api/leads/${id}`, { method: 'PUT', auth: true, body: payload })
  return res?.data ?? null
}

