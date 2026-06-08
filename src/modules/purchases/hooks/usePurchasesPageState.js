import { useMemo, useState } from 'react'

export function usePurchasesPageState() {
  const [filters, setFilters] = useState({
    status: 'all',
    from: '',
    to: '',
  })

  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const stableFilters = useMemo(
    () => ({
      status: String(filters?.status ?? 'all'),
      from: String(filters?.from ?? '').trim(),
      to: String(filters?.to ?? '').trim(),
    }),
    [filters]
  )

  return {
    filters,
    setFilters,
    stableFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    limit,
    setLimit,
  }
}

