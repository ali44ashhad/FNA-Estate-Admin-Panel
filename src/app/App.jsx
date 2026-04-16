import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import { AdminSettingsProvider } from './adminSettings.context.jsx'
import { AuthProvider } from './auth.context.jsx'
import RequireAuth from './RequireAuth.jsx'
import { ROUTES } from '../shared/constants/routes.js'
import DashboardPage from '../modules/dashboard/DashboardPage.jsx'
import CitiesPage from '../modules/cities/CitiesPage.jsx'
import ProjectsPage from '../modules/projects/ProjectsPage.jsx'
import DealsPage from '../modules/deals/DealsPage.jsx'
import LeadsPage from '../modules/leads/LeadsPage.jsx'
import EmployeesPage from '../modules/employees/EmployeesPage.jsx'
import UsersPage from '../modules/users/UsersPage.jsx'
import ProfilePage from '../modules/settings/SettingsPage.jsx'
import LoginPage from '../modules/auth/LoginPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <AdminSettingsProvider>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path={ROUTES.login} element={<LoginPage />} />

          <Route
            element={
              <RequireAuth>
                <AdminLayout />
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
        </Routes>
      </AdminSettingsProvider>
    </AuthProvider>
  )
}

