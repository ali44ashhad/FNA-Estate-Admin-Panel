import { useMemo, useState } from 'react'

export function useEmployeesPageState() {
  const [q, setQ] = useState('')
  const [role, setRole] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const stableQ = useMemo(() => q.trim(), [q])

  return {
    q,
    setQ,
    stableQ,
    role,
    setRole,
    page,
    setPage,
    limit,
    setLimit,
  }
}

