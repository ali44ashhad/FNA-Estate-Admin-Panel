import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Container from '../../shared/components/Container.jsx'
import { ROUTES } from '../../shared/constants/routes.js'
import { useAuth } from '../../app/auth.context.jsx'
import { request } from '../../shared/api/http.js'
import { setAccessToken, setEmployeeSession } from '../../shared/auth/authStorage.js'

function useNextPath() {
  const { search } = useLocation()
  return useMemo(() => {
    const params = new URLSearchParams(search)
    const next = params.get('next')
    return next && next.startsWith('/') ? next : ROUTES.dashboard
  }, [search])
}

export default function LoginPage() {
  const navigate = useNavigate()
  const nextPath = useNextPath()
  const { isAuthed, login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthed) return <Navigate to={ROUTES.dashboard} replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    try {
      const res = await request('/api/auth/employee/login', {
        method: 'POST',
        body: { email: email.trim(), password },
      })

      const accessToken = res?.data?.accessToken
      const employee = res?.data?.employee
      if (!accessToken || !employee) throw new Error('Login failed')

      setAccessToken(accessToken)
      setEmployeeSession(employee)
      login({ employee, accessToken })
      navigate(nextPath, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Container className="py-10 sm:py-16">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-base font-bold text-white">
              FNA
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Admin login</h1>
            <p className="mt-2 text-sm text-slate-600">Sign in to access the panel.</p>
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="text-xs font-semibold text-slate-700">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  placeholder="admin@company.com"
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-slate-500">Use your employee credentials to sign in.</p>
          </form>
        </div>
      </Container>
    </div>
  )
}

