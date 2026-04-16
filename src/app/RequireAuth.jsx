import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../shared/constants/routes.js'
import { useAuth } from './auth.context.jsx'

export default function RequireAuth({ children }) {
  const { isAuthed } = useAuth()
  const location = useLocation()

  if (!isAuthed) {
    const next = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={`${ROUTES.login}?next=${encodeURIComponent(next)}`} replace />
  }

  return children
}

