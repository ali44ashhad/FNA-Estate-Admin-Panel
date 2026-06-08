import { useMemo, useState } from 'react'
import PurchasePanel from './components/PurchasePanel.jsx'
import PurchasesFilters from './components/PurchasesFilters.jsx'
import PurchasesPagination from './components/PurchasesPagination.jsx'
import PurchasesTable from './components/PurchasesTable.jsx'
import PurchasesToolbar from './components/PurchasesToolbar.jsx'
import { usePurchases } from './hooks/usePurchases.js'
import { usePurchasesPageState } from './hooks/usePurchasesPageState.js'
import { updatePurchaseStatus } from './api/purchases.api.js'

export default function PurchasesPage() {
  const { filters, setFilters, stableFilters, sortBy, setSortBy, sortOrder, setSortOrder, page, setPage, limit, setLimit } =
    usePurchasesPageState()
  const { purchases, meta, loading, error, refresh } = usePurchases({
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
    if (!stableQuery) return purchases
    return purchases.filter((p) => {
      const leadNo = typeof p?.lead?.leadNo === 'number' ? `LEAD-${p.lead.leadNo}` : ''
      const hay = `${p?.id ?? ''} ${p?.inventoryKey ?? ''} ${p?.user?.name ?? ''} ${p?.userId ?? ''} ${
        p?.project?.name ?? ''
      } ${p?.projectId ?? ''} ${leadNo} ${p?.leadId ?? ''} ${p?.visitId ?? ''} ${p?.status ?? ''}`.toLowerCase()
      return hay.includes(stableQuery)
    })
  }, [purchases, stableQuery])

  function openPanel(p) {
    setPanelError('')
    setSelected(p)
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
      const updated = await updatePurchaseStatus(id, payload)
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
      <PurchasesToolbar title="Purchases" total={meta?.total ?? 0} query={query} onChangeQuery={setQuery} />

      <PurchasesFilters
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

      <PurchasesPagination
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
          setFilters({ status: 'all', from: '', to: '' })
          setSortBy('createdAt')
          setSortOrder('desc')
          setPage(1)
        }}
      />

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      ) : null}

      <PurchasesTable purchases={filtered} loading={loading} onOpen={openPanel} />

      <PurchasePanel open={panelOpen} purchase={selected} saving={saving} error={panelError} onClose={closePanel} onSave={onSave} />
    </div>
  )
}

