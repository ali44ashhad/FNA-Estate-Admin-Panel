import PortalShell from './layout/PortalShell.jsx'
import { ROUTES } from '../shared/constants/routes.js'

const SALES_THEME = {
  logo: 'bg-violet-700',
  kicker: 'text-violet-700',
  navActive: 'bg-violet-600 text-white shadow-sm',
  navIdle: 'text-slate-700 hover:bg-slate-100 hover:text-violet-800',
  userPill: 'bg-violet-700',
}

const SALES_NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ to: ROUTES.salesHome, label: 'Sales dashboard' }],
  },
  {
    label: 'Pipeline',
    items: [
      { to: ROUTES.salesLeads, label: 'Leads' },
      { to: ROUTES.salesVisits, label: 'Visits' },
    ],
  },
]

export default function SalesLayout() {
  return (
    <PortalShell
      brandName="Sales"
      kicker="FNA Estate"
      headerTitle="Sales portal"
      theme={SALES_THEME}
      navSections={SALES_NAV_SECTIONS}
    />
  )
}
