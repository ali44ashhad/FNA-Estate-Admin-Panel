import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth.context.jsx'

/**
 * @typedef {Object} PortalTheme
 * @property {string} logo
 * @property {string} kicker
 * @property {string} navActive
 * @property {string} navIdle
 * @property {string} userPill
 */

/**
 * @param {{ to: string, label: string }} props
 * @param {{ navActive: string, navIdle: string }} theme
 */
function NavItem({ to, label, theme, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin' || to === '/ops' || to === '/sales'}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive ? theme.navActive : theme.navIdle
        }`
      }
    >
      <span>{label}</span>
    </NavLink>
  )
}

/**
 * @param {object} props
 * @param {string} props.brandName
 * @param {string} props.headerTitle
 * @param {string} props.kicker
 * @param {PortalTheme} props.theme
 * @param {Array<{ to: string, label: string }>} [props.navItems]
 * @param {Array<{ label: string, items: Array<{ to: string, label: string }> }>} [props.navSections]
 */
export default function PortalShell({
  brandName,
  headerTitle,
  kicker,
  theme,
  navItems = [],
  navSections = null,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session, logout } = useAuth()
  const email = session?.employee?.email

  const sections =
    navSections ??
    (navItems.length > 0 ? [{ label: null, items: navItems }] : [])

  function closeMobile() {
    setMobileOpen(false)
  }

  function handleLogout() {
    closeMobile()
    logout()
  }

  const navContent = (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {sections.map((section) => (
        <div key={section.label ?? 'default'}>
          {section.label ? (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {section.label}
            </p>
          ) : null}
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                theme={theme}
                onNavigate={closeMobile}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )

  const sidebarFooter = (
    <div className="mt-auto border-t border-slate-200 p-4">
      
      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
      >
        Logout
      </button>
    </div>
  )

  const sidebarInner = (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${theme.logo}`}
          >
            FNA
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">{brandName}</p>
            <p className="text-xs text-slate-500">FNA Estate</p>
          </div>
        </div>
        <button
          type="button"
          onClick={closeMobile}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>
      {navContent}
      {sidebarFooter}
    </>
  )

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        {sidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close menu overlay"
            onClick={closeMobile}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(88vw,280px)] flex-col bg-white shadow-xl">
            {sidebarInner}
          </aside>
        </div>
      ) : null}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 lg:hidden"
                aria-label="Open menu"
              >
                Menu
              </button>
              <div className="min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wider ${theme.kicker}`}>{kicker}</p>
                <h1 className="truncate text-lg font-bold text-slate-900">{headerTitle}</h1>
              </div>
            </div>
            <span
              className={`hidden shrink-0 rounded-full px-3 py-2 text-xs font-semibold text-white sm:inline-flex ${theme.userPill}`}
            >
              {email ?? brandName}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
