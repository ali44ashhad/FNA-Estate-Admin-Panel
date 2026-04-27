import { Navigate } from 'react-router-dom'
import { getDefaultPathForRole } from '../shared/routing/roleHome.js'
import { useAuth } from './auth.context.jsx'

/**
 * Renders `children` only if `session.employee.role` is in `allowed` (inclusive).
 * Otherwise redirects to the role-appropriate home (or login if no role).
 * @param {{ children: import('react').ReactNode, allowed: readonly string[] }} props
 */
export default function RequireRole({ children, allowed }) {
  const { session } = useAuth()
  const role = session?.employee?.role
  if (!role || !allowed.includes(role)) {
    return <Navigate to={getDefaultPathForRole(role)} replace />
  }
  return children
}
