import { useEffect, useMemo, useState } from 'react'
import { LEAD_STATUS_OPTIONS, formatMaybeDate, humanizeInterest } from '../leads.utils.js'

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
  saving = false,
  error = '',
  onClose,
  onSave,
}) {
  const [status, setStatus] = useState('new')
  const [assignedOpsId, setAssignedOpsId] = useState('')
  const [assignedSalesId, setAssignedSalesId] = useState('')

  const baseLead = useMemo(() => lead ?? null, [lead])

  useEffect(() => {
    if (!baseLead) return
    setStatus(baseLead.status || 'new')
    setAssignedOpsId(baseLead.assignedOpsId || '')
    setAssignedSalesId(baseLead.assignedSalesId || '')
  }, [baseLead])

  if (!open) return null

  const canClose = !saving
  const leadId = baseLead?.id

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
                <span className="text-xs font-semibold text-slate-700">Assigned Ops ID</span>
                <input
                  value={assignedOpsId}
                  onChange={(e) => setAssignedOpsId(e.target.value)}
                  placeholder="Employee ObjectId…"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                />
              </label>
            ) : null}

            {canEditAssignments ? (
              <label className="sm:col-span-1">
                <span className="text-xs font-semibold text-slate-700">Assigned Sales ID</span>
                <input
                  value={assignedSalesId}
                  onChange={(e) => setAssignedSalesId(e.target.value)}
                  placeholder="Employee ObjectId…"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                />
              </label>
            ) : null}
          </div>

          {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}

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

