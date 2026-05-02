import { useEffect, useMemo, useState } from 'react'
import { LEAD_STATUS_OPTIONS, formatMaybeDate, humanizeInterest } from '../leads.utils.js'
import { addNote, getNotesByLead } from '../api/notes.api.js'

function Field({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <p className={`mt-1 text-sm text-slate-900 ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</p>
    </div>
  )
}

export default function LeadPanel({
  open,
  lead,
  canEditAssignments = false,
  opsOptions = [],
  salesOptions = [],
  saving = false,
  error = '',
  onClose,
  onSave,
}) {
  const [status, setStatus] = useState('new')
  const [assignedOpsId, setAssignedOpsId] = useState('')
  const [assignedSalesId, setAssignedSalesId] = useState('')

  const baseLead = useMemo(() => lead ?? null, [lead])
  const safeOpsOptions = useMemo(() => (Array.isArray(opsOptions) ? opsOptions : []), [opsOptions])
  const safeSalesOptions = useMemo(() => (Array.isArray(salesOptions) ? salesOptions : []), [salesOptions])

  const [notesLoading, setNotesLoading] = useState(false)
  const [notesError, setNotesError] = useState('')
  const [notes, setNotes] = useState({ opsNotes: [], salesNotes: [] })
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  const leadId = baseLead?.id

  useEffect(() => {
    if (!baseLead) return
    setStatus(baseLead.status || 'new')
    setAssignedOpsId(baseLead.assignedOpsId || '')
    setAssignedSalesId(baseLead.assignedSalesId || '')
  }, [baseLead])

  async function refreshNotes(id) {
    if (!id) return
    setNotesError('')
    setNotesLoading(true)
    try {
      const data = await getNotesByLead(id)
      const opsNotes = Array.isArray(data?.opsNotes) ? data.opsNotes : []
      const salesNotes = Array.isArray(data?.salesNotes) ? data.salesNotes : []
      setNotes({ opsNotes, salesNotes })
    } catch (err) {
      setNotesError(err instanceof Error ? err.message : 'Failed to load notes')
      setNotes({ opsNotes: [], salesNotes: [] })
    } finally {
      setNotesLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !leadId) return
    refreshNotes(leadId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, leadId])

  if (!open) return null

  const canClose = !saving

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Lead {typeof baseLead?.leadNo === 'number' ? `#${baseLead.leadNo}` : ''}
            </h3>
            <p className="mt-1 font-mono text-xs text-slate-500">{leadId || '—'}</p>
          </div>
          <button
            type="button"
            onClick={() => (canClose ? onClose?.() : null)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!canClose}
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2">
          <Field label="Project" value={baseLead?.project?.name || baseLead?.projectId} mono={false} />
          <Field label="Project ID" value={baseLead?.projectId} mono />
          <Field label="User" value={baseLead?.user?.name || baseLead?.userId} mono={false} />
          <Field label="User ID" value={baseLead?.userId} mono />
          <Field label="Interest" value={humanizeInterest(baseLead?.interest)} />
          <Field label="Inventory key" value={baseLead?.interest?.inventoryKey} mono />
          <Field label="Created" value={formatMaybeDate(baseLead?.createdAt)} />
          <Field label="Updated" value={formatMaybeDate(baseLead?.updatedAt)} />
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="sm:col-span-1">
              <span className="text-xs font-semibold text-slate-700">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              >
                {LEAD_STATUS_OPTIONS.filter((o) => o.value !== 'all').map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            {canEditAssignments ? (
              <label className="sm:col-span-1">
                <span className="text-xs font-semibold text-slate-700">Assigned Ops</span>
                <select
                  value={assignedOpsId}
                  onChange={(e) => setAssignedOpsId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                >
                  <option value="">Unassigned</option>
                  {safeOpsOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {canEditAssignments ? (
              <label className="sm:col-span-1">
                <span className="text-xs font-semibold text-slate-700">Assigned Sales</span>
                <select
                  value={assignedSalesId}
                  onChange={(e) => setAssignedSalesId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                >
                  <option value="">Unassigned</option>
                  {safeSalesOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">Notes</p>
                <p className="mt-0.5 text-xs text-slate-600">Internal notes for this lead.</p>
              </div>
              <button
                type="button"
                disabled={!leadId || notesLoading || addingNote}
                onClick={() => refreshNotes(leadId)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {notesLoading ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>

            {notesError ? (
              <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{notesError}</p>
            ) : null}

            <div className="mt-3 space-y-3">
              <label>
                <span className="text-xs font-semibold text-slate-700">Add a note</span>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type a note for this lead…"
                  rows={3}
                  className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                />
              </label>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={addingNote || !leadId || !newNote.trim()}
                  onClick={async () => {
                    if (!leadId) return
                    setNotesError('')
                    setAddingNote(true)
                    try {
                      await addNote({ leadId, content: newNote })
                      setNewNote('')
                      await refreshNotes(leadId)
                    } catch (err) {
                      setNotesError(err instanceof Error ? err.message : 'Failed to add note')
                    } finally {
                      setAddingNote(false)
                    }
                  }}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {addingNote ? 'Adding…' : 'Add note'}
                </button>
              </div>

              <div className="max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white">
                {notesLoading ? (
                  <div className="px-3 py-3 text-sm text-slate-600">Loading notes…</div>
                ) : null}

                {!notesLoading && (notes.opsNotes.length > 0 || notes.salesNotes.length > 0) ? (
                  <div className="divide-y divide-slate-200">
                    {notes.opsNotes.map((n) => (
                      <div key={n?._id || n?.id || JSON.stringify(n)} className="px-3 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs font-semibold text-slate-700">Ops</p>
                          <p className="text-xs text-slate-500">{formatMaybeDate(n?.createdAt)}</p>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{n?.content || '—'}</p>
                      </div>
                    ))}
                    {notes.salesNotes.map((n) => (
                      <div key={n?._id || n?.id || JSON.stringify(n)} className="px-3 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs font-semibold text-slate-700">Sales</p>
                          <p className="text-xs text-slate-500">{formatMaybeDate(n?.createdAt)}</p>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{n?.content || '—'}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {!notesLoading && notes.opsNotes.length === 0 && notes.salesNotes.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm text-slate-500">No notes yet.</div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => (canClose ? onClose?.() : null)}
              disabled={!canClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving || !leadId}
              onClick={() => {
                if (!leadId) return
                const payload = { status }
                if (canEditAssignments) {
                  if (assignedOpsId.trim()) payload.assignedOpsId = assignedOpsId.trim()
                  if (assignedSalesId.trim()) payload.assignedSalesId = assignedSalesId.trim()
                }
                onSave?.({ id: leadId, payload })
              }}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

