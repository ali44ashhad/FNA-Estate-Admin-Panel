import { useMemo, useState } from 'react'
import { formatCityLabel, parseAmenitiesInput, parseImagesInput, PROPERTY_TYPE_OPTIONS } from '../projects.utils.js'

export default function ProjectModal({ open, mode, cities, initialValue, saving, error, onClose, onSubmit }) {
  const seeded = useMemo(() => {
    const name = initialValue?.name ?? ''
    const cityId = initialValue?.city?.id ?? initialValue?.cityId ?? ''
    const propertyType = initialValue?.propertyType ?? 'apartment'
    const status = initialValue?.status ?? 'active'
    const pricingType = initialValue?.pricingType ?? 'direct'

    const pMin = initialValue?.price?.min
    const pMax = initialValue?.price?.max
    const directMin = typeof pMin === 'number' ? String(pMin) : ''
    const directMax = typeof pMax === 'number' ? String(pMax) : ''

    const incomingUnits = Array.isArray(initialValue?.units) ? initialValue.units : []
    const units =
      incomingUnits.length > 0
        ? incomingUnits.map((u) => ({
            type: u?.type ?? '',
            minPrice: typeof u?.minPrice === 'number' ? String(u.minPrice) : '',
            maxPrice: typeof u?.maxPrice === 'number' ? String(u.maxPrice) : '',
            size: u?.size ?? '',
          }))
        : [{ type: '', minPrice: '', maxPrice: '', size: '' }]

    const imgs = Array.isArray(initialValue?.images) ? initialValue.images : []
    const imagesText = imgs.join('\n')

    const ams = Array.isArray(initialValue?.amenities) ? initialValue.amenities : []
    const amenitiesText = ams.join('\n')

    const description = initialValue?.description ?? ''

    return { name, cityId, propertyType, status, pricingType, directMin, directMax, units, imagesText, amenitiesText, description }
  }, [initialValue])

  const [name, setName] = useState(seeded.name)
  const [cityId, setCityId] = useState(seeded.cityId)
  const [propertyType, setPropertyType] = useState(seeded.propertyType)
  const [status, setStatus] = useState(seeded.status)
  const [pricingType, setPricingType] = useState(seeded.pricingType)
  const [directMin, setDirectMin] = useState(seeded.directMin)
  const [directMax, setDirectMax] = useState(seeded.directMax)
  const [units, setUnits] = useState(seeded.units)
  const [imagesText, setImagesText] = useState(seeded.imagesText)
  const [amenitiesText, setAmenitiesText] = useState(seeded.amenitiesText)
  const [description, setDescription] = useState(seeded.description)
  const [localError, setLocalError] = useState('')

  if (!open) return null

  const title = mode === 'edit' ? 'Edit project' : 'Add project'

  function addUnit() {
    setUnits((prev) => [...prev, { type: '', minPrice: '', maxPrice: '', size: '' }])
  }

  function removeUnit(idx) {
    setUnits((prev) => prev.filter((_, i) => i !== idx))
  }

  function setUnitField(idx, field, value) {
    setUnits((prev) => prev.map((u, i) => (i === idx ? { ...u, [field]: value } : u)))
  }

  function validateAndBuildPayload() {
    setLocalError('')
    const nextName = name.trim()
    const nextStatus = status.trim()
    if (!nextName) return { ok: false, message: 'Name is required.' }
    if (!cityId) return { ok: false, message: 'City is required.' }
    if (!nextStatus) return { ok: false, message: 'Status is required.' }

    const images = parseImagesInput(imagesText)
    const amenities = parseAmenitiesInput(amenitiesText)
    const nextDescription = String(description ?? '').trim()

    if (pricingType === 'direct') {
      const min = Number(directMin)
      const max = Number(directMax)
      if (!Number.isFinite(min) || !Number.isFinite(max)) return { ok: false, message: 'Direct min/max price is required.' }
      if (min < 0 || max < 0) return { ok: false, message: 'Price cannot be negative.' }

      return {
        ok: true,
        payload: {
          name: nextName,
          cityId,
          propertyType,
          status: nextStatus,
          pricingType,
          price: { min, max },
          images,
          amenities,
          description: nextDescription,
        },
      }
    }

    const rows = units
      .map((u) => {
        const type = String(u.type ?? '').trim()
        const size = String(u.size ?? '').trim()
        const minPrice = Number(u.minPrice)
        const maxPrice = Number(u.maxPrice)
        if (!type) return null
        if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) return null
        if (minPrice < 0 || maxPrice < 0) return null
        return {
          type,
          minPrice,
          maxPrice,
          ...(size ? { size } : {}),
        }
      })
      .filter(Boolean)

    if (!rows.length) return { ok: false, message: 'At least one valid unit row is required for unit-based pricing.' }

    return {
      ok: true,
      payload: {
        name: nextName,
        cityId,
        propertyType,
        status: nextStatus,
        pricingType,
        units: rows,
        images,
        amenities,
        description: nextDescription,
      },
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">Manage project details and pricing.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const built = validateAndBuildPayload()
            if (!built.ok) {
              setLocalError(built.message)
              return
            }
            onSubmit(built.payload)
          }}
          className="space-y-4 px-5 py-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="proj-name" className="text-xs font-semibold text-slate-700">
                Name
              </label>
              <input
                id="proj-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                placeholder="Project name"
                autoFocus
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="proj-city" className="text-xs font-semibold text-slate-700">
                City
              </label>
              <select
                id="proj-city"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              >
                <option value="">{cities?.length ? 'Select city' : 'No cities found'}</option>
                {(cities || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {formatCityLabel(c)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="proj-type" className="text-xs font-semibold text-slate-700">
                Property type
              </label>
              <select
                id="proj-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              >
                {PROPERTY_TYPE_OPTIONS.filter((o) => o.value).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="proj-status" className="text-xs font-semibold text-slate-700">
                Status
              </label>
              <input
                id="proj-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                placeholder="active / inactive / launched ..."
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="proj-pricing" className="text-xs font-semibold text-slate-700">
                Pricing type
              </label>
              <select
                id="proj-pricing"
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              >
                <option value="direct">Direct</option>
                <option value="unit_based">Unit based</option>
              </select>
            </div>
          </div>

          {pricingType === 'direct' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="proj-direct-min" className="text-xs font-semibold text-slate-700">
                  Min price
                </label>
                <input
                  id="proj-direct-min"
                  value={directMin}
                  onChange={(e) => setDirectMin(e.target.value)}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  placeholder="e.g. 4500000"
                />
              </div>
              <div>
                <label htmlFor="proj-direct-max" className="text-xs font-semibold text-slate-700">
                  Max price
                </label>
                <input
                  id="proj-direct-max"
                  value={directMax}
                  onChange={(e) => setDirectMax(e.target.value)}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  placeholder="e.g. 9000000"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Units</p>
                  <p className="text-xs text-slate-500">Add at least one unit row.</p>
                </div>
                <button
                  type="button"
                  onClick={addUnit}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Add unit
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-[900px] w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Min price</th>
                        <th className="px-4 py-3">Max price</th>
                        <th className="px-4 py-3">Size (optional)</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {units.map((u, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="px-4 py-2">
                            <input
                              value={u.type}
                              onChange={(e) => setUnitField(idx, 'type', e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                              placeholder="2BHK / Studio / ..."
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={u.minPrice}
                              onChange={(e) => setUnitField(idx, 'minPrice', e.target.value)}
                              inputMode="numeric"
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                              placeholder="e.g. 5000000"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={u.maxPrice}
                              onChange={(e) => setUnitField(idx, 'maxPrice', e.target.value)}
                              inputMode="numeric"
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                              placeholder="e.g. 7500000"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={u.size}
                              onChange={(e) => setUnitField(idx, 'size', e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                              placeholder="e.g. 1200 sqft"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => removeUnit(idx)}
                              disabled={units.length <= 1}
                              className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="proj-images" className="text-xs font-semibold text-slate-700">
              Images (URLs, one per line)
            </label>
            <textarea
              id="proj-images"
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              placeholder="https://...\nhttps://..."
            />
          </div>

          <div>
            <label htmlFor="proj-amenities" className="text-xs font-semibold text-slate-700">
              Amenities (one per line)
            </label>
            <textarea
              id="proj-amenities"
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              placeholder={'Swimming Pool\nGym\nChildren’s Play Area'}
            />
          </div>

          <div>
            <label htmlFor="proj-description" className="text-xs font-semibold text-slate-700">
              Description
            </label>
            <textarea
              id="proj-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              placeholder={'Tell buyers about the project...\n\nHighlights:\n- Great connectivity\n- Premium amenities\n- Trusted developer'}
            />
            <p className="mt-1 text-xs text-slate-500">Plain text or HTML supported. Saved as-is and rendered on the project details page.</p>
          </div>

          {localError ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{localError}</p> : null}
          {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

