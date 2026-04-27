import { formatCityLabel, PROPERTY_TYPE_OPTIONS } from '../projects.utils.js'

export default function ProjectsFilters({ cities, citiesLoading, filters, onChangeFilters, onResetPage }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700" htmlFor="filter-city">
            City
          </label>
          <select
            id="filter-city"
            value={filters.cityId}
            onChange={(e) => {
              onChangeFilters((prev) => ({ ...prev, cityId: e.target.value }))
              onResetPage()
            }}
            disabled={citiesLoading}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 disabled:bg-slate-50 disabled:text-slate-500"
          >
            <option value="">{citiesLoading ? 'Loading…' : cities?.length ? 'All cities' : 'No cities found'}</option>
            {(cities || []).map((c) => (
              <option key={c.id} value={c.id}>
                {formatCityLabel(c)}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="filter-type">
            Property type
          </label>
          <select
            id="filter-type"
            value={filters.propertyType}
            onChange={(e) => {
              onChangeFilters((prev) => ({ ...prev, propertyType: e.target.value }))
              onResetPage()
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            {PROPERTY_TYPE_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="filter-min">
            Min price
          </label>
          <input
            id="filter-min"
            value={filters.minPrice}
            onChange={(e) => {
              onChangeFilters((prev) => ({ ...prev, minPrice: e.target.value }))
              onResetPage()
            }}
            inputMode="numeric"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            placeholder="0"
          />
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="filter-max">
            Max price
          </label>
          <input
            id="filter-max"
            value={filters.maxPrice}
            onChange={(e) => {
              onChangeFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
              onResetPage()
            }}
            inputMode="numeric"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            placeholder="999999999"
          />
        </div>
      </div>
    </div>
  )
}

