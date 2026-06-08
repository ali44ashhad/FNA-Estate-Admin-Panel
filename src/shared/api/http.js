import { clearAccessToken, clearEmployeeSession, getAccessToken, setAccessToken } from '../auth/authStorage.js'

const DEFAULT_API_BASE_URL = 'http://localhost:5008'

function getApiBaseUrl() {
  const raw = import.meta.env?.VITE_API_BASE_URL
  if (typeof raw !== 'string' || !raw.trim()) return DEFAULT_API_BASE_URL
  return raw.replace(/\/+$/, '')
}

export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`

  function redirectToLogin() {
    try {
      const next = `${window.location.pathname}${window.location.search}${window.location.hash}`
      window.location.assign(`/login?next=${encodeURIComponent(next)}`)
    } catch {
      window.location.assign('/login')
    }
  }

  async function doFetch() {
    const headers = { 'Content-Type': 'application/json' }
    if (auth) {
      const token = getAccessToken()
      if (token) headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    const text = await res.text()
    const data = text ? JSON.parse(text) : null
    return { res, data }
  }

  const { res, data } = await doFetch()

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`

    if (auth && res.status === 401 && message === 'Access token expired') {
      const refreshUrl = `${getApiBaseUrl()}/api/auth/refresh`
      const refreshRes = await fetch(refreshUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      const refreshText = await refreshRes.text()
      const refreshData = refreshText ? JSON.parse(refreshText) : null

      if (refreshRes.ok) {
        const nextAccessToken = refreshData?.data?.accessToken
        if (nextAccessToken) {
          setAccessToken(nextAccessToken)
          const retry = await doFetch()
          if (!retry.res.ok) {
            const retryMessage = retry.data?.message || `Request failed (${retry.res.status})`
            throw new Error(retryMessage)
          }
          return retry.data
        }
      }

      // Refresh failed or returned no token: clear local session and force re-auth.
      clearAccessToken()
      clearEmployeeSession()
      redirectToLogin()
      throw new Error('Session expired. Please login again.')
    }

    throw new Error(message)
  }

  return data
}

