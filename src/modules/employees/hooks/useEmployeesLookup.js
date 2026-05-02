import { useCallback, useEffect, useState } from 'react'
import { getEmployeesLookup } from '../api/employees.api.js'

function normalizeMeta(meta, fallback) {
  return {
    page: typeof meta?.page === 'number' ? meta.page : fallback.page,
    limit: typeof meta?.limit === 'number' ? meta.limit : fallback.limit,
    total: typeof meta?.total === 'number' ? meta.total : fallback.total,
    hasNext: Boolean(meta?.hasNext),
  }
}

export function useEmployeesLookup({ q, role, page, limit }) {
  const [employees, setEmployees] = useState([])
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, hasNext: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(
    async (nextPage = page) => {
      setLoading(true)
      setError('')
      try {
        const { items, meta: apiMeta } = await getEmployeesLookup({ q, role, page: nextPage, limit })
        setEmployees(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page: nextPage,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employees')
      } finally {
        setLoading(false)
      }
    },
    [q, role, page, limit]
  )

  useEffect(() => {
    let alive = true

    async function load() {
      if (!alive) return
      setLoading(true)
      setError('')
      try {
        const { items, meta: apiMeta } = await getEmployeesLookup({ q, role, page, limit })
        if (!alive) return
        setEmployees(items)
        setMeta(
          normalizeMeta(apiMeta, {
            page,
            limit,
            total: items.length,
          })
        )
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Failed to load employees')
      } finally {
        if (alive) setLoading(false)
      }
    }

    void load()
    return () => {
      alive = false
    }
  }, [q, role, page, limit])

  return { employees, meta, loading, error, setError, refresh, setEmployees }
}

