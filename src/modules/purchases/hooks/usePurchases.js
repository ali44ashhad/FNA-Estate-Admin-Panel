import { useCallback, useEffect, useState } from 'react'
import { listPurchases, updatePurchaseStatus } from '../api/purchases.api.js'

function normalizeMeta(meta, fallback) {
  const page = typeof meta?.page === 'number' ? meta.page : fallback.page
  const limit = typeof meta?.limit === 'number' ? meta.limit : fallback.limit
  const total = typeof meta?.total === 'number' ? meta.total : fallback.total
  const hasNext = typeof meta?.hasNext === 'boolean' ? meta.hasNext : page * limit < total
  return { page, limit, total, hasNext }
}

export function usePurchases({ filters, page, limit, sortBy, sortOrder }) {
  const [purchases, setPurchases] = useState([])
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, hasNext: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(
    async (nextPage = page) => {
      setLoading(true)
      setError('')
      try {
        const { items, meta: apiMeta } = await listPurchases({
          filters,
          page: nextPage,
          limit,
          sortBy,
          sortOrder,
        })
        setPurchases(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page: nextPage,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load purchases')
      } finally {
        setLoading(false)
      }
    },
    [filters, page, limit, sortBy, sortOrder]
  )

  useEffect(() => {
    let alive = true

    async function load() {
      if (!alive) return
      setLoading(true)
      setError('')
      try {
        const { items, meta: apiMeta } = await listPurchases({ filters, page, limit, sortBy, sortOrder })
        if (!alive) return
        setPurchases(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Failed to load purchases')
      } finally {
        if (alive) setLoading(false)
      }
    }

    void load()
    return () => {
      alive = false
    }
  }, [filters, page, limit, sortBy, sortOrder])

  const setStatus = useCallback(async ({ id, status }) => {
    if (!id || !status) return null
    setError('')
    const updated = await updatePurchaseStatus(id, { status })
    setPurchases((prev) => prev.map((p) => (p?.id === id ? { ...p, ...updated } : p)))
    return updated
  }, [])

  return { purchases, meta, loading, error, setError, refresh, setStatus }
}

