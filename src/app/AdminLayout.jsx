import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '../shared/constants/routes.js'
import Container from '../shared/components/Container.jsx'
import { useAuth } from './auth.context.jsx'

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-800'
        }`
      }
    >
      <span>{label}</span>
    </NavLink>
  )
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session, logout } = useAuth()
  const email = session?.employee?.email

  const sidebar = (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-sm font-bold text-white">
            FNA
          </span>
          <span className="text-sm font-bold text-slate-900">Admin</span>
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
        <NavItem to={ROUTES.dashboard} label="Dashboard" />
        <NavItem to={ROUTES.cities} label="Cities" />
        <NavItem to={ROUTES.projects} label="Projects" />
        <NavItem to={ROUTES.deals} label="Deals" />
        <NavItem to={ROUTES.leads} label="Leads" />
        <NavItem to={ROUTES.employees} label="Employees" />
        <NavItem to={ROUTES.users} label="Users" />
        <NavItem to={ROUTES.profile} label="Profile" />
      </nav>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold text-slate-900">Admin console</p>
        <p className="mt-1 text-xs text-slate-500">Manage content & leads.</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold text-slate-600">{email ?? 'Admin'}</span>
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">FNA Estate</p>
                  <h1 className="text-lg font-bold text-slate-900">Admin panel</h1>
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
                  <span className="hidden rounded-full bg-emerald-700 px-3 py-2 text-xs font-semibold text-white sm:inline-flex">
                    {email ?? 'Admin'}
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

