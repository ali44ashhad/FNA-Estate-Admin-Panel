import { useEffect, useState } from 'react'
import { request } from '../../../shared/api/http.js'
import { getCities } from '../../cities/api/cities.api.js'
import { getProjects } from '../../projects/api/projects.api.js'
import { getLeads } from '../../leads/api/leads.api.js'
import { getVisits } from '../../visits/api/visits.api.js'
import { listPurchases } from '../../purchases/api/purchases.api.js'
import { getEmployees } from '../../employees/api/employees.api.js'
import { extractTotal } from '../dashboard.utils.js'

async function fetchCount(fetcher) {
  try {
    const result = await fetcher()
    return extractTotal(result?.meta, result?.items)
  } catch {
    return null
  }
}

async function fetchUsersCount() {
  try {
    const res = await request('/api/users', { auth: true })
    const items = Array.isArray(res?.data) ? res.data : []
    return items.length
  } catch {
    return null
  }
}

export function useAdminDashboard() {
  const [stats, setStats] = useState({
    cities: null,
    projects: null,
    leads: null,
    visits: null,
    purchases: null,
    employees: null,
    users: null,
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)

      const [cities, projects, leads, visits, purchases, employees, users, recent] = await Promise.all([
        fetchCount(() => getCities({ q: '', page: 1, limit: 1 })),
        fetchCount(() => getProjects({ filters: {}, page: 1, limit: 1 })),
        fetchCount(() => getLeads({ filters: {}, page: 1, limit: 1, sortBy: 'createdAt', sortOrder: 'desc' })),
        fetchCount(() => getVisits({ filters: {}, page: 1, limit: 1, sortBy: 'createdAt', sortOrder: 'desc' })),
        fetchCount(() => listPurchases({ filters: {}, page: 1, limit: 1, sortBy: 'createdAt', sortOrder: 'desc' })),
        fetchCount(() => getEmployees({ q: '', role: 'all', page: 1, limit: 1 })),
        fetchUsersCount(),
        getLeads({ filters: {}, page: 1, limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' })
          .then((r) => r.items ?? [])
          .catch(() => []),
      ])

      if (!alive) return

      setStats({ cities, projects, leads, visits, purchases, employees, users })
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
