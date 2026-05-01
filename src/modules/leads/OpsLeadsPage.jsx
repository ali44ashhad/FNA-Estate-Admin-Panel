import { useMemo, useState } from 'react'
import { updateLead } from './api/leads.api.js'
import LeadPanel from './components/LeadPanel.jsx'
import LeadsFilters from './components/LeadsFilters.jsx'
import LeadsPagination from './components/LeadsPagination.jsx'
import LeadsTable from './components/LeadsTable.jsx'
import LeadsToolbar from './components/LeadsToolbar.jsx'
import { useLeads } from './hooks/useLeads.js'
import { useLeadsPageState } from './hooks/useLeadsPageState.js'

export default function OpsLeadsPage() {
  const { filters, setFilters, stableFilters, sortBy, setSortBy, sortOrder, setSortOrder, page, setPage, limit, setLimit } =
    useLeadsPageState()
  const { leads, meta, loading, error, refresh } = useLeads({
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

  const filtered = useMemo(() => {
    if (!stableQuery) return leads
    return leads.filter((l) => {
      const hay = `${l?.leadNo ?? ''} ${l?.id ?? ''} ${l?.userId ?? ''} ${l?.projectId ?? ''} ${l?.status ?? ''} ${
        l?.interest?.inventoryKey ?? ''
      }`.toLowerCase()
      return hay.includes(stableQuery)
    })
  }, [leads, stableQuery])

  function openPanel(lead) {
    setPanelError('')
    setSelected(lead)
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
      const updated = await updateLead(id, { status: payload?.status })
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
      <LeadsToolbar
        title="Leads"
        subtitle={
          <>
            Ops view: update lead <span className="font-semibold text-slate-800">status</span> and track pipeline.
          </>
        }
        total={meta?.total ?? 0}
        query={query}
        onChangeQuery={setQuery}
      />

      <LeadsFilters
        filters={filters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        canEditAssignments={false}
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

      <LeadsPagination
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
          setFilters({ status: 'all', projectId: '', userId: '', assignedOpsId: '', assignedSalesId: '' })
          setSortBy('createdAt')
          setSortOrder('desc')
          setPage(1)
        }}
      />

      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

      <LeadsTable leads={filtered} loading={loading} onOpen={openPanel} />

      <LeadPanel
        open={panelOpen}
        lead={selected}
        canEditAssignments={false}
        saving={saving}
        error={panelError}
        onClose={closePanel}
        onSave={onSave}
      />
    </div>
  )
}

