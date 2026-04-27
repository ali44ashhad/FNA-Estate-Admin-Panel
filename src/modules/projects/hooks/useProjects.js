import { useCallback, useEffect, useState } from 'react'
import { deleteProject, getProjects } from '../api/projects.api.js'

function normalizeMeta(meta, fallback) {
  return {
    page: typeof meta?.page === 'number' ? meta.page : fallback.page,
    limit: typeof meta?.limit === 'number' ? meta.limit : fallback.limit,
    total: typeof meta?.total === 'number' ? meta.total : fallback.total,
    hasNext: Boolean(meta?.hasNext),
  }
}

export function useProjects({ filters, page, limit }) {
  const [projects, setProjects] = useState([])
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, hasNext: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(
    async (nextPage = page) => {
      setLoading(true)
      setError('')
      try {
        const { items, meta: apiMeta } = await getProjects({ filters, page: nextPage, limit })
        setProjects(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page: nextPage,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    },
    [filters, page, limit]
  )

  useEffect(() => {
    let alive = true

    async function load() {
      if (!alive) return
      setLoading(true)
      setError('')
      try {
        const { items, meta: apiMeta } = await getProjects({ filters, page, limit })
        if (!alive) return
        setProjects(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Failed to load projects')
      } finally {
        if (alive) setLoading(false)
      }
    }

    void load()
    return () => {
      alive = false
    }
  }, [filters, page, limit])

  const remove = useCallback(
    async ({ id, itemsOnPage, currentPage, onPageChange }) => {
      if (!id) return
      setError('')
      await deleteProject(id)
      const nextPage = itemsOnPage <= 1 && currentPage > 1 ? currentPage - 1 : currentPage
      if (nextPage !== currentPage) onPageChange?.(nextPage)
      await refresh(nextPage)
      return nextPage
    },
    [refresh]
  )

  return { projects, meta, loading, error, setError, refresh, remove }
}

