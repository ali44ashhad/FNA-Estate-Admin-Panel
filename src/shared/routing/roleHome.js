import { ROUTES } from '../constants/routes.js'
import { EMPLOYEE_ROLE } from '../constants/employeeRoles.js'

const ADMIN_PREFIX = '/admin'
const OPS_PREFIX = '/ops'
const SALES_PREFIX = '/sales'

/**
 * @param {string} pathname e.g. /admin/cities
 * @param {string | undefined} role
 */
export function getDefaultPathForRole(role) {
  if (role === EMPLOYEE_ROLE.admin) return ROUTES.dashboard
  if (role === EMPLOYEE_ROLE.operations) return ROUTES.opsHome
  if (role === EMPLOYEE_ROLE.sales) return ROUTES.salesHome
  return ROUTES.login
}

/**
 * Whether the user may land on this path after login or when typing the URL.
 * @param {string} pathname path only, no query (e.g. from useLocation().pathname)
 * @param {string | undefined} role
 */
export function isPathAllowedForRole(pathname, role) {
  if (role === EMPLOYEE_ROLE.admin) {
    return pathname === ROUTES.dashboard || pathname.startsWith(`${ADMIN_PREFIX}/`)
  }
  if (role === EMPLOYEE_ROLE.operations) {
    return pathname === ROUTES.opsHome || pathname.startsWith(`${OPS_PREFIX}/`)
  }
  if (role === EMPLOYEE_ROLE.sales) {
    return pathname === ROUTES.salesHome || pathname.startsWith(`${SALES_PREFIX}/`)
  }
  return false
}

/**
 * @param {string} pathWithSearch full path, query, hash e.g. /admin/cities?x=1
 * @param {string | undefined} role
 */
export function isNextPathAllowedForRole(pathWithSearch, role) {
  try {
    const path = pathWithSearch.split('?')[0] ?? pathWithSearch
    const onlyPath = path.split('#')[0] ?? path
    return isPathAllowedForRole(onlyPath || '/', role)
  } catch {
    return false
  }
}
