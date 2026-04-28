import { useMemo, useState } from 'react'

export function useCitiesPageState() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const stableQ = useMemo(() => q.trim(), [q])

  return {
    q,
    setQ,
    stableQ,
    page,
    setPage,
    limit,
    setLimit,
  }
}

