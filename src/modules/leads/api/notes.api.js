import { request } from '../../../shared/api/http.js'

export async function getNotesByLead(leadId) {
  if (!leadId) throw new Error('leadId is required')
  const res = await request(`/api/notes/${leadId}`, { auth: true })
  return res?.data ?? { opsNotes: [], salesNotes: [] }
}

export async function addNote({ leadId, content }) {
  if (!leadId) throw new Error('leadId is required')
  const safe = typeof content === 'string' ? content.trim() : ''
  if (!safe) throw new Error('Note cannot be empty')
  const res = await request('/api/notes', { method: 'POST', auth: true, body: { leadId, content: safe } })
  return res?.data ?? null
}

