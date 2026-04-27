import { useEffect, useMemo, useState } from 'react'
import { request } from '../../shared/api/http.js'
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx'

function CityModal({ open, mode, initialValue, saving, error, onClose, onSubmit }) {
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

export default function CitiesPage() {
  const [query, setQuery] = useState('')
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [error, setError] = useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editing, setEditing] = useState(null)
  const [modalError, setModalError] = useState('')

  useEffect(() => {
    let alive = true

    async function loadCities() {
      setLoading(true)
      setError('')
      let data = []
      try {
        const res = await request('/api/cities')
        data = Array.isArray(res?.data) ? res.data : []
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : 'Failed to load cities')
      } finally {
        if (alive) setLoading(false)
      }

      if (!alive) return
      setCities(data)
    }

    void loadCities()
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cities
    return cities.filter((c) => `${c.name} ${c.state} ${c.pincode ?? ''}`.toLowerCase().includes(q))
  }, [cities, query])

  function openCreate() {
    setModalError('')
    setModalMode('create')
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(city) {
    setModalError('')
    setModalMode('edit')
    setEditing(city)
    setModalOpen(true)
  }

  function closeModal() {
    if (saving) return
    setModalOpen(false)
  }

  async function submitModal(values) {
    setModalError('')
    const payload = {
      name: values?.name ?? '',
      state: values?.state ?? '',
      pincode: values?.pincode ?? '',
    }

    setSaving(true)
    try {
      if (modalMode === 'edit' && editing?.id) {
        const res = await request(`/api/cities/${editing.id}`, {
          method: 'PUT',
          auth: true,
          body: payload,
        })
        const updated = res?.data
        if (!updated?.id) throw new Error('Update failed')
        setCities((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      } else {
        const res = await request('/api/cities', {
          method: 'POST',
          auth: true,
          body: payload,
        })
        const created = res?.data
        if (!created?.id) throw new Error('Create failed')
        setCities((prev) => [created, ...prev])
      }
      setModalOpen(false)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  function askDelete(city) {
    if (!city?.id) return
    setPendingDelete(city)
    setConfirmDeleteOpen(true)
  }

  function closeDeleteConfirm() {
    if (deletingId) return
    setConfirmDeleteOpen(false)
    setPendingDelete(null)
  }

  async function confirmDelete() {
    const city = pendingDelete
    if (!city?.id) return
    setError('')
    setDeletingId(city.id)
    try {
      await request(`/api/cities/${city.id}`, { method: 'DELETE', auth: true })
      setCities((prev) => prev.filter((c) => c.id !== city.id))
      setConfirmDeleteOpen(false)
      setPendingDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cities</h2>
          <p className="mt-1 text-sm text-slate-600">Create, edit, and remove cities.</p>
        </div>
        <div className="flex w-full max-w-md gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Add
          </button>
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Pincode</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={4}>
                  Loading…
                </td>
              </tr>
            ) : null}

            {!loading &&
              filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                <td className="px-4 py-3 text-slate-600">{c.state}</td>
                <td className="px-4 py-3 text-slate-600">{c.pincode}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => askDelete(c)}
                      disabled={deletingId === c.id}
                      className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingId === c.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={4}>
                  No results
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        </div>
      </div>

      <CityModal
        key={`${modalMode}:${editing?.id ?? 'new'}:${modalOpen ? 'open' : 'closed'}`}
        open={modalOpen}
        mode={modalMode}
        initialValue={editing}
        saving={saving}
        error={modalError}
        onClose={closeModal}
        onSubmit={submitModal}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete city?"
        description={pendingDelete ? `This will permanently remove ${pendingDelete.name} from active cities.` : ''}
        confirmText={pendingDelete ? `Delete ${pendingDelete.name}` : 'Delete'}
        cancelText="Cancel"
        confirmVariant="danger"
        loading={Boolean(deletingId)}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

