import { useEffect, useState } from 'react'
import { listCities } from '../api/cities.api.js'

export function useCities() {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await listCities()
        if (!alive) return
        setCities(data)
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Failed to load cities')
      } finally {
        if (alive) setLoading(false)
      }
    }

    void load()
    return () => {
      alive = false
    }
  }, [])

  return { cities, loading, error }
}

