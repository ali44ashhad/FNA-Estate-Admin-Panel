/** Employee `role` values from API / DB (see server employee model). */
export const EMPLOYEE_ROLE = {
  admin: 'admin',
  operations: 'operations',
  sales: 'sales',
}

/** @type {Readonly<Record<keyof typeof EMPLOYEE_ROLE, string>>} */
export const EMPLOYEE_ROLE_LABEL = {
  admin: 'Admin',
  operations: 'Ops',
  sales: 'Sales',
}
