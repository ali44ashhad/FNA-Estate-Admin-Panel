import { useMemo, useState } from 'react'

export function useVisitsPageState() {
  const [filters, setFilters] = useState({
    status: 'all',
    salesId: '',
    leadId: '',
    from: '',
    to: '',
  })

  const [sortBy, setSortBy] = useState('visitTime')
  const [sortOrder, setSortOrder] = useState('desc')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const stableFilters = useMemo(
    () => ({
      status: String(filters?.status ?? 'all'),
      salesId: String(filters?.salesId ?? '').trim(),
      leadId: String(filters?.leadId ?? '').trim(),
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
