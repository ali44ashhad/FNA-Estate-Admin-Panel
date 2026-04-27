import PortalShell from './layout/PortalShell.jsx'
import { ROUTES } from '../shared/constants/routes.js'

const OPS_THEME = {
  logo: 'bg-sky-700',
  kicker: 'text-sky-700',
  navActive: 'bg-sky-600 text-white shadow-sm',
  navIdle: 'text-slate-700 hover:bg-slate-100 hover:text-sky-800',
  userPill: 'bg-sky-700',
}

const OPS_NAV = [{ to: ROUTES.opsHome, label: 'Ops dashboard' }]

export default function OpsLayout() {
  return (
    <PortalShell
      brandName="Ops"
      kicker="FNA Estate"
      headerTitle="Operations portal"
      theme={OPS_THEME}
      navItems={OPS_NAV}
      sidebarFooter={{ title: 'Operations', subtitle: 'Field & pipeline tasks.' }}
    />
  )
}
