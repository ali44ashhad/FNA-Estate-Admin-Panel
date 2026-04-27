import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Container from '../../shared/components/Container.jsx'
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
function NavItem({ to, label, theme }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
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
 * @param {Array<{ to: string, label: string }>} props.navItems
 * @param {{ title: string, subtitle?: string } | null} [props.sidebarFooter]
 */
export default function PortalShell({ brandName, headerTitle, kicker, theme, navItems, sidebarFooter = null }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session, logout } = useAuth()
  const email = session?.employee?.email

  const sidebar = (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white ${theme.logo}`}
          >
            FNA
          </span>
          <span className="text-sm font-bold text-slate-900">{brandName}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 lg:hidden"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="space-y-1" onClick={() => setMobileOpen(false)}>
        {navItems.map((item) => (
          <NavItem key={item.to} to={item.to} label={item.label} theme={theme} />
        ))}
      </nav>

      {sidebarFooter ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-900">{sidebarFooter.title}</p>
          {sidebarFooter.subtitle ? <p className="mt-1 text-xs text-slate-500">{sidebarFooter.subtitle}</p> : null}
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="truncate text-xs font-semibold text-slate-600">{email ?? brandName}</span>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                logout()
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Container className="py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">{sidebar}</aside>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3 sm:items-center">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${theme.kicker}`}>{kicker}</p>
                  <h1 className="text-lg font-bold text-slate-900">{headerTitle}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 lg:hidden"
                    aria-label="Open menu"
                  >
                    Menu
                  </button>
                  <span
                    className={`hidden rounded-full px-3 py-2 text-xs font-semibold text-white sm:inline-flex ${theme.userPill}`}
                  >
                    {email ?? brandName}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 sm:p-5">
              <Outlet />
            </div>
          </section>
        </div>
      </Container>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-3 top-3 w-[min(92vw,360px)]">{sidebar}</div>
        </div>
      ) : null}
    </div>
  )
}
