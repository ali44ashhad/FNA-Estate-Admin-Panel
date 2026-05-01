import { Route, Routes } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import OpsLayout from './OpsLayout.jsx'
import SalesLayout from './SalesLayout.jsx'
import RootRedirect from './RootRedirect.jsx'
import { AdminSettingsProvider } from './adminSettings.context.jsx'
import { AuthProvider } from './auth.context.jsx'
import RequireAuth from './RequireAuth.jsx'
import RequireRole from './RequireRole.jsx'
import { EMPLOYEE_ROLE } from '../shared/constants/employeeRoles.js'
import { ROUTES } from '../shared/constants/routes.js'
import DashboardPage from '../modules/dashboard/DashboardPage.jsx'
import CitiesPage from '../modules/cities/CitiesPage.jsx'
import ProjectsPage from '../modules/projects/ProjectsPage.jsx'
import DealsPage from '../modules/deals/DealsPage.jsx'
import LeadsPage from '../modules/leads/LeadsPage.jsx'
import OpsLeadsPage from '../modules/leads/OpsLeadsPage.jsx'
import EmployeesPage from '../modules/employees/EmployeesPage.jsx'
import UsersPage from '../modules/users/UsersPage.jsx'
import ProfilePage from '../modules/settings/SettingsPage.jsx'
import LoginPage from '../modules/auth/LoginPage.jsx'
import OpsDashboardPage from '../modules/ops/OpsDashboardPage.jsx'
import SalesDashboardPage from '../modules/sales/SalesDashboardPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <AdminSettingsProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path={ROUTES.login} element={<LoginPage />} />

          <Route
            element={
              <RequireAuth>
                <RequireRole allowed={[EMPLOYEE_ROLE.admin]}>
                  <AdminLayout />
                </RequireRole>
              </RequireAuth>
            }
          >
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.cities} element={<CitiesPage />} />
            <Route path={ROUTES.projects} element={<ProjectsPage />} />
            <Route path={ROUTES.deals} element={<DealsPage />} />
            <Route path={ROUTES.leads} element={<LeadsPage />} />
            <Route path={ROUTES.employees} element={<EmployeesPage />} />
            <Route path={ROUTES.users} element={<UsersPage />} />
            <Route path={ROUTES.profile} element={<ProfilePage />} />
          </Route>

          <Route
            element={
              <RequireAuth>
                <RequireRole allowed={[EMPLOYEE_ROLE.operations]}>
                  <OpsLayout />
                </RequireRole>
              </RequireAuth>
            }
          >
            <Route path={ROUTES.opsHome} element={<OpsDashboardPage />} />
            <Route path={ROUTES.opsLeads} element={<OpsLeadsPage />} />
          </Route>

          <Route
            element={
              <RequireAuth>
                <RequireRole allowed={[EMPLOYEE_ROLE.sales]}>
                  <SalesLayout />
                </RequireRole>
              </RequireAuth>
            }
          >
            <Route path={ROUTES.salesHome} element={<SalesDashboardPage />} />
          </Route>
        </Routes>
      </AdminSettingsProvider>
    </AuthProvider>
  )
}

