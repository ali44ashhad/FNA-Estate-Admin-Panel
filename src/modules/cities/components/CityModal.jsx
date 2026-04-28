import { useMemo, useState } from 'react'

export default function CityModal({ open, mode, initialValue, saving, error, onClose, onSubmit }) {
  const seeded = useMemo(() => {
    return {
      name: initialValue?.name ?? '',
      state: initialValue?.state ?? '',
      pincode: initialValue?.pincode ?? '',
    }
  }, [initialValue])

  const [name, setName] = useState(seeded.name)
  const [state, setState] = useState(seeded.state)
  const [pincode, setPincode] = useState(seeded.pincode)

  if (!open) return null

  const title = mode === 'edit' ? 'Edit city' : 'Add city'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">Enter city details and save.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit({ name, state, pincode })
          }}
          className="space-y-4 px-5 py-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="city-name" className="text-xs font-semibold text-slate-700">
                City
              </label>
              <input
                id="city-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                placeholder="Noida"
                autoFocus
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="city-state" className="text-xs font-semibold text-slate-700">
                State
              </label>
              <input
                id="city-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                placeholder="Uttar Pradesh"
              />
            </div>
          </div>

          <div>
            <label htmlFor="city-pincode" className="text-xs font-semibold text-slate-700">
              Pincode
            </label>
            <input
              id="city-pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              placeholder="201301"
              inputMode="numeric"
            />
          </div>

          {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

