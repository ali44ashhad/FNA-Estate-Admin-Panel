import { useEffect, useState } from 'react'
import { getLeads } from '../../leads/api/leads.api.js'
import { getVisits } from '../../visits/api/visits.api.js'
import { extractTotal } from '../../dashboard/dashboard.utils.js'

async function fetchCount(fetcher) {
  try {
    const result = await fetcher()
    return extractTotal(result?.meta, result?.items)
  } catch {
    return null
  }
}

export function useSalesDashboard() {
  const [stats, setStats] = useState({ leads: null, visits: null })
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)

      const [leads, visits, recent] = await Promise.all([
        fetchCount(() => getLeads({ filters: {}, page: 1, limit: 1, sortBy: 'createdAt', sortOrder: 'desc' })),
        fetchCount(() => getVisits({ filters: {}, page: 1, limit: 1, sortBy: 'createdAt', sortOrder: 'desc' })),
        getLeads({ filters: {}, page: 1, limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' })
          .then((r) => r.items ?? [])
          .catch(() => []),
      ])

      if (!alive) return

      setStats({ leads, visits })
      setRecentLeads(recent)
      setLoading(false)
    }

    void load()

    return () => {
      alive = false
    }
  }, [])

  return { stats, recentLeads, loading }
}
