import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx'
import { useState } from 'react'
import { createCity, updateCity } from './api/cities.api.js'
import CitiesPagination from './components/CitiesPagination.jsx'
import CitiesTable from './components/CitiesTable.jsx'
import CitiesToolbar from './components/CitiesToolbar.jsx'
import CityModal from './components/CityModal.jsx'
import { useCities } from './hooks/useCities.js'
import { useCitiesPageState } from './hooks/useCitiesPageState.js'

export default function CitiesPage() {
  const { q, setQ, stableQ, page, setPage, limit, setLimit } = useCitiesPageState()
  const { cities, meta, loading, error, setError, refresh, remove } = useCities({ q: stableQ, page, limit })

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editing, setEditing] = useState(null)
  const [modalError, setModalError] = useState('')

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
        const updated = await updateCity(editing.id, payload)
        if (!updated?.id) throw new Error('Update failed')
      } else {
        const created = await createCity(payload)
        if (!created?.id) throw new Error('Create failed')
      }
      setModalOpen(false)
      await refresh(page)
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
      await remove({
        id: city.id,
        itemsOnPage: cities.length,
        currentPage: page,
        onPageChange: (p) => setPage(p),
      })
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
      <CitiesToolbar
        q={q}
        onChangeQ={(next) => {
          setQ(next)
          setPage(1)
        }}
        onCreate={openCreate}
      />

      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

      <CitiesPagination
        meta={meta}
        page={page}
        limit={limit}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        onSetLimit={(n) => {
          setLimit(n)
          setPage(1)
        }}
        onClearFilters={() => {
          setQ('')
          setPage(1)
        }}
      />

      <CitiesTable
        cities={cities}
        loading={loading}
        deletingId={deletingId}
        onEdit={openEdit}
        onAskDelete={askDelete}
      />

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

