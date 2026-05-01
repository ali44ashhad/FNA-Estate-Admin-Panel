import { useMemo, useState } from 'react'

export function useLeadsPageState() {
  const [filters, setFilters] = useState({
    status: 'all',
    projectId: '',
    userId: '',
    assignedOpsId: '',
    assignedSalesId: '',
  })

  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const stableFilters = useMemo(
    () => ({
      status: String(filters?.status ?? 'all'),
      projectId: String(filters?.projectId ?? '').trim(),
      userId: String(filters?.userId ?? '').trim(),
      assignedOpsId: String(filters?.assignedOpsId ?? '').trim(),
      assignedSalesId: String(filters?.assignedSalesId ?? '').trim(),
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

