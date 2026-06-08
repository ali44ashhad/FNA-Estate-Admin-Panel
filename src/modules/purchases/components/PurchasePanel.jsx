import { useEffect, useMemo, useState } from 'react'
import { PURCHASE_STATUS_OPTIONS, formatMaybeDate, formatMoneyINR } from '../purchases.utils.js'

function Field({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <p className={`mt-1 text-sm text-slate-900 ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</p>
    </div>
  )
}

function formatLeadNo(leadNo) {
  if (typeof leadNo !== 'number' || !Number.isFinite(leadNo) || leadNo <= 0) return ''
  return `LEAD-${leadNo}`
}

export default function PurchasePanel({ open, purchase, saving = false, error = '', onClose, onSave }) {
  const base = useMemo(() => purchase ?? null, [purchase])
  const purchaseId = base?.id

  const [status, setStatus] = useState('booked')

  useEffect(() => {
    if (!base) return
    setStatus(base.status || 'booked')
  }, [base])

  if (!open) return null

  const canClose = !saving
  const statusOptions = PURCHASE_STATUS_OPTIONS.filter((o) => o.value !== 'all')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center">
      <div className="flex max-h-[min(90dvh,calc(100vh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Purchase</h3>
            <p className="mt-1 font-mono text-xs text-slate-500">{purchaseId || '—'}</p>
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2">
            <Field label="Status" value={base?.status} />
            <Field label="Agreed price" value={formatMoneyINR(base?.agreedPrice)} />
            <Field label="Project" value={base?.project?.name || base?.projectId} />
            <Field label="User" value={base?.user?.name || base?.userId} />
            <Field label="Lead" value={formatLeadNo(base?.lead?.leadNo) || base?.leadId} mono />
            <Field label="Visit ID" value={base?.visitId} mono />
            <Field label="Category" value={base?.category} />
            <Field label="Sub type" value={base?.subType} />
            <Field label="Inventory key" value={base?.inventoryKey} mono />
            <Field label="Created" value={formatMaybeDate(base?.createdAt)} />
            <Field label="Updated" value={formatMaybeDate(base?.updatedAt)} />
          </div>

          <div className="border-t border-slate-200 px-5 py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label>
                <span className="text-xs font-semibold text-slate-700">Update status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                >
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
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
            disabled={saving || !purchaseId}
            onClick={() => {
              if (!purchaseId) return
              onSave?.({ id: purchaseId, payload: { status } })
            }}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

