import { useCallback, useEffect, useState } from 'react'
import { getVisits } from '../api/visits.api.js'

function normalizeMeta(meta, fallback) {
  const page = typeof meta?.page === 'number' ? meta.page : fallback.page
  const limit = typeof meta?.limit === 'number' ? meta.limit : fallback.limit
  const total = typeof meta?.total === 'number' ? meta.total : fallback.total
  const hasNext = typeof meta?.hasNext === 'boolean' ? meta.hasNext : page * limit < total
  return { page, limit, total, hasNext }
}

export function useVisits({ filters, page, limit, sortBy, sortOrder }) {
  const [visits, setVisits] = useState([])
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, hasNext: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(
    async (nextPage = page) => {
      setLoading(true)
      setError('')
      try {
        const { items, meta: apiMeta } = await getVisits({
          filters,
          page: nextPage,
          limit,
          sortBy,
          sortOrder,
        })
        setVisits(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page: nextPage,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load visits')
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
        const { items, meta: apiMeta } = await getVisits({ filters, page, limit, sortBy, sortOrder })
        if (!alive) return
        setVisits(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Failed to load visits')
      } finally {
        if (alive) setLoading(false)
      }
    }

    void load()
    return () => {
      alive = false
    }
  }, [filters, page, limit, sortBy, sortOrder])

  return { visits, meta, loading, error, setError, refresh, setVisits }
}
