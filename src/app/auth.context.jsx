/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'fna.admin.session'

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession())

  const value = useMemo(
    () => ({
      session,
      isAuthed: Boolean(session),
      login: ({ email }) => {
        const next = { email: String(email).toLowerCase(), name: 'Admin' }
        setSession(next)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      },
      logout: () => {
        setSession(null)
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          // ignore
        }
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

