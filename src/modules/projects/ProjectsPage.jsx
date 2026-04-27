import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx'
import { useState } from 'react'
import { createProject, updateProject } from './api/projects.api.js'
import ProjectModal from './components/ProjectModal.jsx'
import ProjectsFilters from './components/ProjectsFilters.jsx'
import ProjectsPagination from './components/ProjectsPagination.jsx'
import ProjectsTable from './components/ProjectsTable.jsx'
import ProjectsToolbar from './components/ProjectsToolbar.jsx'
import { useCities } from './hooks/useCities.js'
import { useProjects } from './hooks/useProjects.js'
import { useProjectsPageState } from './hooks/useProjectsPageState.js'

export default function ProjectsPage() {
  const { filters, setFilters, page, setPage, limit, setLimit } = useProjectsPageState()
  const { cities, loading: citiesLoading, error: citiesError } = useCities()
  const { projects, meta, loading, error, setError, refresh, remove } = useProjects({ filters, page, limit })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState('')

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deletingId, setDeletingId] = useState('')

  function openCreate() {
    setModalError('')
    setModalMode('create')
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(project) {
    setModalError('')
    setModalMode('edit')
    setEditing(project)
    setModalOpen(true)
  }

  function closeModal() {
    if (saving) return
    setModalOpen(false)
  }

  async function submitModal(payload) {
    setModalError('')
    setSaving(true)
    try {
      if (modalMode === 'edit' && editing?.id) {
        const updated = await updateProject(editing.id, payload)
        if (!updated?.id) throw new Error('Update failed')
      } else {
        const created = await createProject(payload)
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

  function askDelete(project) {
    if (!project?.id) return
    setPendingDelete(project)
    setConfirmDeleteOpen(true)
  }

  function closeDeleteConfirm() {
    if (deletingId) return
    setConfirmDeleteOpen(false)
    setPendingDelete(null)
  }

  async function confirmDelete() {
    const project = pendingDelete
    if (!project?.id) return
    setDeletingId(project.id)
    try {
      await remove({
        id: project.id,
        itemsOnPage: projects.length,
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
      <ProjectsToolbar onCreate={openCreate} />

      {citiesError ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{citiesError}</p>
      ) : null}

      <ProjectsFilters
        cities={cities}
        citiesLoading={citiesLoading}
        filters={filters}
        onChangeFilters={setFilters}
        onResetPage={() => setPage(1)}
      />

      <ProjectsPagination
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
          setFilters({ cityId: '', propertyType: '', minPrice: '', maxPrice: '' })
          setPage(1)
        }}
      />

      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

      <ProjectsTable
        projects={projects}
        loading={loading}
        deletingId={deletingId}
        onEdit={openEdit}
        onAskDelete={askDelete}
      />

      <ProjectModal
        key={`${modalMode}:${editing?.id ?? 'new'}:${modalOpen ? 'open' : 'closed'}`}
        open={modalOpen}
        mode={modalMode}
        cities={cities}
        initialValue={editing}
        saving={saving}
        error={modalError}
        onClose={closeModal}
        onSubmit={submitModal}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete project?"
        description={pendingDelete ? `This will remove ${pendingDelete.name} from active projects.` : ''}
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

