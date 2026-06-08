import { useMemo, useState } from 'react'
import { updateVisit } from './api/visits.api.js'
import VisitPanel from './components/VisitPanel.jsx'
import VisitsFilters from './components/VisitsFilters.jsx'
import VisitsPagination from './components/VisitsPagination.jsx'
import VisitsTable from './components/VisitsTable.jsx'
import VisitsToolbar from './components/VisitsToolbar.jsx'
import { useVisits } from './hooks/useVisits.js'
import { useVisitsPageState } from './hooks/useVisitsPageState.js'
import { useEmployees } from '../employees/hooks/useEmployees.js'

export default function VisitsPage() {
  const { filters, setFilters, stableFilters, sortBy, setSortBy, sortOrder, setSortOrder, page, setPage, limit, setLimit } =
    useVisitsPageState()
  const { visits, meta, loading, error, refresh } = useVisits({
    filters: stableFilters,
    page,
    limit,
    sortBy,
    sortOrder,
  })

  const [query, setQuery] = useState('')
  const stableQuery = useMemo(() => query.trim().toLowerCase(), [query])

  const [panelOpen, setPanelOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [panelError, setPanelError] = useState('')

  const { employees: salesEmployees } = useEmployees({ q: '', role: 'sales', page: 1, limit: 200 })

  const salesOptions = useMemo(() => {
    return (salesEmployees ?? [])
      .filter((e) => e?.id)
      .map((e) => ({ value: e.id, label: e.name || e.email || e.id }))
  }, [salesEmployees])

  const salesNameById = useMemo(() => {
    const map = new Map()
    for (const e of salesEmployees ?? []) if (e?.id) map.set(e.id, e?.name || e?.email || e.id)
    return map
  }, [salesEmployees])

  const filtered = useMemo(() => {
    if (!stableQuery) return visits
    return visits.filter((v) => {
      const hay = `${v?.lead?.leadNo ?? ''} ${v?.id ?? ''} ${v?.leadId ?? ''} ${v?.location ?? ''} ${
        v?.sales?.name ?? ''
      } ${v?.status ?? ''}`.toLowerCase()
      return hay.includes(stableQuery)
    })
  }, [visits, stableQuery])

  function openPanel(v) {
    setPanelError('')
    setSelected(v)
    setPanelOpen(true)
  }

  function closePanel() {
    if (saving) return
    setPanelOpen(false)
    setSelected(null)
  }

  async function onSave({ id, payload }) {
    setPanelError('')
    setSaving(true)
    try {
      const updated = await updateVisit(id, payload)
      if (!updated?.id) throw new Error('Update failed')
      closePanel()
      await refresh(page)
    } catch (err) {
      setPanelError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <VisitsToolbar title="Visits" total={meta?.total ?? 0} query={query} onChangeQuery={setQuery} />

      <VisitsFilters
        filters={filters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onChangeFilters={setFilters}
        onChangeSortBy={(next) => {
          setSortBy(next)
          setPage(1)
        }}
        onChangeSortOrder={(next) => {
          setSortOrder(next)
          setPage(1)
        }}
        onResetPage={() => setPage(1)}
      />

      <VisitsPagination
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
          setFilters({ status: 'all', salesId: '', leadId: '', from: '', to: '' })
          setSortBy('visitTime')
          setSortOrder('desc')
          setPage(1)
        }}
      />

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      ) : null}

      <VisitsTable visits={filtered} loading={loading} salesNameById={salesNameById} onOpen={openPanel} />

      <VisitPanel
        open={panelOpen}
        visit={selected}
        canEditDetails
        salesOptions={salesOptions}
        saving={saving}
        error={panelError}
        onClose={closePanel}
        onSave={onSave}
      />
    </div>
  )
}
