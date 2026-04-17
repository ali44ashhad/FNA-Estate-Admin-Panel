const ACCESS_TOKEN_KEY = 'fna.admin.accessToken'
const EMPLOYEE_KEY = 'fna.admin.employee'

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setAccessToken(token) {
  if (!token) return
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } catch {
    // ignore
  }
}

export function clearAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  } catch {
    // ignore
  }
}

export function getEmployeeSession() {
  try {
    const raw = localStorage.getItem(EMPLOYEE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setEmployeeSession(employee) {
  if (!employee) return
  try {
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employee))
  } catch {
    // ignore
  }
}

export function clearEmployeeSession() {
  try {
    localStorage.removeItem(EMPLOYEE_KEY)
  } catch {
    // ignore
  }
}

