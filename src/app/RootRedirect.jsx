import { Navigate } from 'react-router-dom'
import { useAuth } from './auth.context.jsx'
import { ROUTES } from '../shared/constants/routes.js'
import { getDefaultPathForRole } from '../shared/routing/roleHome.js'

/**
 * Unauthenticated: login. Authenticated: role-appropriate home (not always /admin).
 */
export default function RootRedirect() {
  const { isAuthed, session } = useAuth()
  if (!isAuthed) {
    return <Navigate to={ROUTES.login} replace />
  }
  return <Navigate to={getDefaultPathForRole(session?.employee?.role)} replace />
}
