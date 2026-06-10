import PortalShell from './layout/PortalShell.jsx'
import { ROUTES } from '../shared/constants/routes.js'

const ADMIN_THEME = {
  logo: 'bg-emerald-700',
  kicker: 'text-emerald-700',
  navActive: 'bg-emerald-600 text-white shadow-sm',
  navIdle: 'text-slate-700 hover:bg-slate-100 hover:text-emerald-800',
  userPill: 'bg-emerald-700',
}

const ADMIN_NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ to: ROUTES.dashboard, label: 'Dashboard' }],
  },
  {
    label: 'Content',
    items: [
      { to: ROUTES.cities, label: 'Cities' },
      { to: ROUTES.projects, label: 'Projects' },
      { to: ROUTES.deals, label: 'Deals' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { to: ROUTES.leads, label: 'Leads' },
      { to: ROUTES.visits, label: 'Visits' },
      { to: ROUTES.purchases, label: 'Purchases' },
    ],
  },
  {
    label: 'Team',
    items: [
      { to: ROUTES.employees, label: 'Employees' },
      { to: ROUTES.users, label: 'Users' },
    ],
  },
  {
    label: 'Account',
    items: [{ to: ROUTES.profile, label: 'Profile' }],
  },
]

export default function AdminLayout() {
  return (
    <PortalShell
      brandName="Admin"
      kicker="FNA Estate"
      headerTitle="Admin panel"
      theme={ADMIN_THEME}
      navSections={ADMIN_NAV_SECTIONS}
    />
  )
}
