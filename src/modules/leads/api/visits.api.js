import { request } from '../../../shared/api/http.js'

export async function createVisit({ leadId, salesId, visitTime, location, locationLink }) {
  const res = await request('/api/visits', {
    method: 'POST',
    auth: true,
    body: { leadId, salesId, visitTime, location, locationLink },
  })
  return res?.data ?? null
}
