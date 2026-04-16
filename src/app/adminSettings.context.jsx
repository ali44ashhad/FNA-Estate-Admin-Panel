/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react'

const AdminSettingsContext = createContext(null)

export function AdminSettingsProvider({ children }) {
  const value = useMemo(() => ({}), [])

  return <AdminSettingsContext.Provider value={value}>{children}</AdminSettingsContext.Provider>
}

export function useAdminSettings() {
  const ctx = useContext(AdminSettingsContext)
  if (!ctx) throw new Error('useAdminSettings must be used within AdminSettingsProvider')
  return ctx
}

