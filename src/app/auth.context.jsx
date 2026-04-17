/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import {
  clearAccessToken,
  clearEmployeeSession,
  getAccessToken,
  getEmployeeSession,
  setAccessToken,
  setEmployeeSession,
} from '../shared/auth/authStorage.js'

const AuthContext = createContext(null)

function readSession() {
  const accessToken = getAccessToken()
  const employee = getEmployeeSession()
  return accessToken && employee ? { accessToken, employee } : null
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession())

  const value = useMemo(
    () => ({
      session,
      isAuthed: Boolean(session?.accessToken),
      login: ({ employee, accessToken }) => {
        const next = { employee, accessToken }
        setSession(next)
        setAccessToken(accessToken)
        setEmployeeSession(employee)
        return next
      },
      logout: () => {
        setSession(null)
        clearAccessToken()
        clearEmployeeSession()
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

