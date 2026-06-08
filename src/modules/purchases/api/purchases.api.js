import { request } from '../../../shared/api/http.js'
import { buildPurchasesQuery } from '../purchases.utils.js'

export async function createPurchase(payload) {
  const res = await request('/api/purchases', { method: 'POST', auth: true, body: payload })
  return res?.data ?? null
}

export async function listPurchases({ filters, page, limit, sortBy, sortOrder }) {
  const queryString = buildPurchasesQuery({ filters, page, limit, sortBy, sortOrder })
  const res = await request(`/api/purchases${queryString}`, { auth: true })
  const items = Array.isArray(res?.data?.items) ? res.data.items : Array.isArray(res?.data) ? res.data : []
  const meta = res?.data && typeof res.data === 'object' ? res.data : res?.meta ?? null
  return { items, meta }
}

export async function updatePurchaseStatus(id, payload) {
  const res = await request(`/api/purchases/${id}`, { method: 'PUT', auth: true, body: payload })
  return res?.data ?? null
}

