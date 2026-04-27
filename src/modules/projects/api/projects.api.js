import { request } from '../../../shared/api/http.js'
import { buildProjectsQuery } from '../projects.utils.js'

export async function getProjects({ filters, page, limit }) {
  const queryString = buildProjectsQuery(filters, page, limit)
  const res = await request(`/api/projects${queryString}`, { auth: true })
  const items = Array.isArray(res?.data) ? res.data : []
  const meta = res?.meta ?? null
  return { items, meta }
}

export async function createProject(payload) {
  const res = await request('/api/projects', { method: 'POST', auth: true, body: payload })
  return res?.data ?? null
}

export async function updateProject(id, payload) {
  const res = await request(`/api/projects/${id}`, { method: 'PUT', auth: true, body: payload })
  return res?.data ?? null
}

export async function deleteProject(id) {
  await request(`/api/projects/${id}`, { method: 'DELETE', auth: true })
}

