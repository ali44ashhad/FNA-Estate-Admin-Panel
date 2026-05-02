import PortalShell from './layout/PortalShell.jsx'
import { ROUTES } from '../shared/constants/routes.js'

const SALES_THEME = {
  logo: 'bg-violet-700',
  kicker: 'text-violet-700',
  navActive: 'bg-violet-600 text-white shadow-sm',
  navIdle: 'text-slate-700 hover:bg-slate-100 hover:text-violet-800',
  userPill: 'bg-violet-700',
}

const SALES_NAV = [
  { to: ROUTES.salesHome, label: 'Sales dashboard' },
  { to: ROUTES.salesLeads, label: 'Leads' },
]

export default function SalesLayout() {
  return (
    <PortalShell
      brandName="Sales"
      kicker="FNA Estate"
      headerTitle="Sales portal"
      theme={SALES_THEME}
      navItems={SALES_NAV}
      sidebarFooter={{ title: 'Sales', subtitle: 'Deals, leads, and follow-ups.' }}
    />
  )
}
