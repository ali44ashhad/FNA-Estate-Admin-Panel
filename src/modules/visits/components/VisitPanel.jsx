import { useMemo, useState } from 'react'
import { formatMaybeDate, toLocalDatetimeInput, VISIT_STATUS_OPTIONS } from '../visits.utils.js'
import { createPurchase } from '../../purchases/api/purchases.api.js'

function buildMapsSearchLink(location) {
  const raw = typeof location === 'string' ? location.trim() : ''
  if (!raw) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`
}

function Field({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <p className={`mt-1 text-sm text-slate-900 ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</p>
    </div>
  )
}

export default function VisitPanel({
  open,
  visit,
  canEditDetails = false,
  salesOptions = [],
  saving = false,
  error = '',
  onClose,
  onSave,
}) {
  const baseVisit = useMemo(() => visit ?? null, [visit])
  const safeSalesOptions = useMemo(() => (Array.isArray(salesOptions) ? salesOptions : []), [salesOptions])
  const visitId = baseVisit?.id
  // Normalize missing id so we don't compare undefined !== null (that is always true and causes infinite re-renders).
  const visitKey = visitId ?? null

  // Derive form state from props: reset whenever the selected visit changes.
  // See https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [trackedId, setTrackedId] = useState(null)
  const [status, setStatus] = useState('scheduled')
  const [salesId, setSalesId] = useState('')
  const [visitTimeLocal, setVisitTimeLocal] = useState('')
  const [location, setLocation] = useState('')
  const [locationLink, setLocationLink] = useState('')

  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [purchaseAgreedPrice, setPurchaseAgreedPrice] = useState('')
  const [purchaseSaving, setPurchaseSaving] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')

  if (visitKey !== trackedId) {
    setTrackedId(visitKey)
    setStatus(baseVisit?.status || 'scheduled')
    setSalesId(baseVisit?.salesId || '')
    setVisitTimeLocal(toLocalDatetimeInput(baseVisit?.visitTime))
    setLocation(baseVisit?.location || '')
    setLocationLink(baseVisit?.locationLink || '')

    setPurchaseOpen(false)
    setPurchaseAgreedPrice('')
    setPurchaseSaving(false)
    setPurchaseError('')
  }

  if (!open) return null

  const canClose = !saving
  const statusOptions = VISIT_STATUS_OPTIONS.filter((o) => o.value !== 'all')
  const mapsHref = (canEditDetails ? locationLink : baseVisit?.locationLink) || buildMapsSearchLink(canEditDetails ? location : baseVisit?.location)

  const canRecordPurchase = Boolean(canEditDetails && baseVisit?.status === 'completed' && baseVisit?.leadId && visitId)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center">
      <div className="flex max-h-[min(90dvh,calc(100vh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Visit {baseVisit?.lead?.leadNo ? `for #${baseVisit.lead.leadNo}` : ''}
            </h3>
            <p className="mt-1 font-mono text-xs text-slate-500">{visitId || '—'}</p>
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
            <Field label="Lead" value={baseVisit?.lead?.leadNo ? `#${baseVisit.lead.leadNo}` : baseVisit?.leadId} />
            <Field label="Lead ID" value={baseVisit?.leadId} mono />
            <Field label="Project" value={baseVisit?.lead?.project?.name} />
            <Field label="Customer" value={baseVisit?.lead?.user?.name} />
            <Field label="Phone" value={baseVisit?.lead?.phone} mono />
            <Field label="Sales rep" value={baseVisit?.sales?.name || baseVisit?.salesId} />
            <Field label="Created" value={formatMaybeDate(baseVisit?.createdAt)} />
            <Field label="Updated" value={formatMaybeDate(baseVisit?.updatedAt)} />
          </div>

          <div className="border-t border-slate-200 px-5 py-4">
            {canRecordPurchase ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Visit completed</p>
                  <p className="mt-0.5 text-xs font-medium text-emerald-800">You can record a purchase for this visit.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseError('')
                    setPurchaseAgreedPrice('')
                    setPurchaseOpen(true)
                  }}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={purchaseSaving}
                >
                  Record purchase
                </button>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label>
                <span className="text-xs font-semibold text-slate-700">Status</span>
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

              {canEditDetails ? (
                <label>
                  <span className="text-xs font-semibold text-slate-700">Sales rep</span>
                  <select
                    value={salesId}
                    onChange={(e) => setSalesId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  >
                    <option value="">Select sales rep</option>
                    {safeSalesOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {canEditDetails ? (
                <label>
                  <span className="text-xs font-semibold text-slate-700">Visit time</span>
                  <input
                    type="datetime-local"
                    value={visitTimeLocal}
                    onChange={(e) => setVisitTimeLocal(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  />
                </label>
              ) : null}

              {canEditDetails ? (
                <label className="sm:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-700">Location</span>
                    {mapsHref ? (
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline"
                        title="Open in Google Maps"
                      >
                        Open map
                      </a>
                    ) : null}
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Site office, Tower A"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  />
                </label>
              ) : null}

              {canEditDetails ? (
                <label className="sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-700">Google Maps link</span>
                  <input
                    type="text"
                    value={locationLink}
                    onChange={(e) => setLocationLink(e.target.value)}
                    placeholder="Paste Google Maps link (optional)"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  />
                </label>
              ) : null}
            </div>

            {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}
          </div>
        </div>

        {purchaseOpen ? (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/30 p-4 sm:items-center">
            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record purchase</h3>
                  <p className="mt-1 text-xs font-medium text-slate-600">This will create a backend purchase linked to the visit.</p>
                </div>
                <button
                  type="button"
                  onClick={() => (purchaseSaving ? null : setPurchaseOpen(false))}
                  disabled={purchaseSaving}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Close
                </button>
              </div>

              <div className="px-5 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Lead" value={baseVisit?.lead?.leadNo ? `#${baseVisit.lead.leadNo}` : baseVisit?.leadId} />
                  <Field label="Visit" value={visitId} mono />
                  <Field label="Project" value={baseVisit?.lead?.project?.name} />
                  <Field label="Customer" value={baseVisit?.lead?.user?.name} />
                  <Field label="Sales rep" value={baseVisit?.sales?.name || baseVisit?.salesId} />
                  <Field label="Phone" value={baseVisit?.lead?.phone} mono />
                </div>

                <div className="mt-4">
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-700">Agreed price</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={purchaseAgreedPrice}
                      onChange={(e) => setPurchaseAgreedPrice(e.target.value)}
                      placeholder="Enter agreed price"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                    />
                  </label>
                </div>

                {purchaseError ? (
                  <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{purchaseError}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
                <button
                  type="button"
                  onClick={() => (purchaseSaving ? null : setPurchaseOpen(false))}
                  disabled={purchaseSaving}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={purchaseSaving}
                  onClick={async () => {
                    setPurchaseError('')
                    if (!visitId || !baseVisit?.leadId) {
                      setPurchaseError('Missing visit/lead')
                      return
                    }
                    const n = Number(purchaseAgreedPrice)
                    if (!Number.isFinite(n) || n <= 0) {
                      setPurchaseError('Please enter a valid agreed price')
                      return
                    }

                    setPurchaseSaving(true)
                    try {
                      const created = await createPurchase({
                        leadId: baseVisit.leadId,
                        visitId,
                        createdByAdmin: true,
                        agreedPrice: n,
                      })
                      if (!created?.id) throw new Error('Purchase creation failed')
                      setPurchaseOpen(false)
                    } catch (err) {
                      setPurchaseError(err instanceof Error ? err.message : 'Purchase creation failed')
                    } finally {
                      setPurchaseSaving(false)
                    }
                  }}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {purchaseSaving ? 'Creating…' : 'Create purchase'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

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
            disabled={saving || !visitId}
            onClick={() => {
              if (!visitId) return
              const payload = { status }
              if (canEditDetails) {
                if (salesId.trim()) payload.salesId = salesId.trim()
                if (visitTimeLocal.trim()) {
                  const dt = new Date(visitTimeLocal)
                  if (!Number.isNaN(dt.getTime())) payload.visitTime = dt.toISOString()
                }
                if (location.trim()) payload.location = location.trim()
                if (locationLink.trim()) payload.locationLink = locationLink.trim()
              }
              onSave?.({ id: visitId, payload })
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
