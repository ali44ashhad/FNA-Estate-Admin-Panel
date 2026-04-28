import { useCallback, useEffect, useState } from 'react'
import { deleteCity, getCities } from '../api/cities.api.js'

function normalizeMeta(meta, fallback) {
  return {
    page: typeof meta?.page === 'number' ? meta.page : fallback.page,
    limit: typeof meta?.limit === 'number' ? meta.limit : fallback.limit,
    total: typeof meta?.total === 'number' ? meta.total : fallback.total,
    hasNext: Boolean(meta?.hasNext),
  }
}

export function useCities({ q, page, limit }) {
  const [cities, setCities] = useState([])
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, hasNext: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(
    async (nextPage = page) => {
      setLoading(true)
      setError('')
      try {
        const { items, meta: apiMeta } = await getCities({ q, page: nextPage, limit })
        setCities(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page: nextPage,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cities')
      } finally {
        setLoading(false)
      }
    },
    [q, page, limit]
  )

  useEffect(() => {
    let alive = true

    async function load() {
      if (!alive) return
      setLoading(true)
      setError('')
      try {
        const { items, meta: apiMeta } = await getCities({ q, page, limit })
        if (!alive) return
        setCities(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Failed to load cities')
      } finally {
        if (alive) setLoading(false)
      }
    }

    void load()
    return () => {
      alive = false
    }
  }, [q, page, limit])

  const remove = useCallback(
    async ({ id, itemsOnPage, currentPage, onPageChange }) => {
      if (!id) return
      setError('')
      await deleteCity(id)
      const nextPage = itemsOnPage <= 1 && currentPage > 1 ? currentPage - 1 : currentPage
      if (nextPage !== currentPage) onPageChange?.(nextPage)
      await refresh(nextPage)
      return nextPage
    },
    [refresh]
  )

  return { cities, meta, loading, error, setError, refresh, remove }
}

