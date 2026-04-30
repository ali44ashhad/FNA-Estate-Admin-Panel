import { useMemo, useState } from 'react'
import { buildProjectsQuery } from '../projects.utils.js'

export function useProjectsPageState() {
  const [filters, setFilters] = useState({
    cityId: '',
    category: '',
    subType: '',
    apartmentConfig: '',
    minPrice: '',
    maxPrice: '',
  })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const queryString = useMemo(() => buildProjectsQuery(filters, page, limit), [filters, page, limit])

  return { filters, setFilters, page, setPage, limit, setLimit, queryString }
}

