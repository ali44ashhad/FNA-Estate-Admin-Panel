import { useMemo, useState } from 'react'
import EmployeeOnboardingForm from './components/EmployeeOnboardingForm.jsx'
import EmployeesPagination from './components/EmployeesPagination.jsx'
import EmployeesTable from './components/EmployeesTable.jsx'
import EmployeesToolbar from './components/EmployeesToolbar.jsx'
import { useCities } from './hooks/useCities.js'
import { useEmployees } from './hooks/useEmployees.js'
import { useEmployeesPageState } from './hooks/useEmployeesPageState.js'

export default function EmployeesPage() {
  const { q, setQ, stableQ, role, setRole, page, setPage, limit, setLimit } = useEmployeesPageState()
  const { cities, loading: citiesLoading, error: citiesError } = useCities()
  const { employees, meta, loading, error, refresh } = useEmployees({
    q: stableQ,
    role,
    page,
    limit,
  })

  const [showOnboarding, setShowOnboarding] = useState(false)

  const cityById = useMemo(() => {
    const map = new Map()
    for (const c of cities) map.set(c.id, c)
    return map
  }, [cities])

  return (
    <div className="space-y-5">
      <EmployeesToolbar
        role={role}
        q={q}
        onChangeRole={(next) => {
          setRole(next)
          setPage(1)
        }}
        onChangeQ={(next) => {
          setQ(next)
          setPage(1)
        }}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {citiesError ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{citiesError}</p>
      ) : null}

      <EmployeesPagination
        meta={meta}
        page={page}
        limit={limit}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        onSetLimit={(n) => {
          setLimit(n)
          setPage(1)
        }}
        onClearFilters={() => {
          setRole('all')
          setQ('')
          setPage(1)
        }}
      />

      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

      {showOnboarding ? (
        <EmployeeOnboardingForm
          cities={cities}
          onCreate={async () => {
            setShowOnboarding(false)
            await refresh(1)
            setPage(1)
          }}
          onClose={() => setShowOnboarding(false)}
        />
      ) : null}

      <EmployeesTable employees={employees} loading={loading} citiesLoading={citiesLoading} cityById={cityById} />
    </div>
  )
}

