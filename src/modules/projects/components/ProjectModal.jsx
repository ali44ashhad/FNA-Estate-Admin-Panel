import { useEffect, useMemo, useState } from 'react'
import {
  CATEGORY_OPTIONS,
  SUBTYPE_OPTIONS_BY_CATEGORY,
  formatCityLabel,
  parseAmenitiesInput,
  parseImagesInput,
  slugifyUnitKey,
} from '../projects.utils.js'

function emptyUnitRow() {
  return { unitLabel: '', unitKey: '', minPrice: '', maxPrice: '', size: '' }
}

function emptyApartmentConfig() {
  return { config: '', configLabel: '', pricingType: 'direct', directMin: '', directMax: '', units: [emptyUnitRow()] }
}

function emptyInventoryItem() {
  return {
    category: 'residential',
    subType: 'apartment',
    pricingType: 'direct',
    directMin: '',
    directMax: '',
    units: [emptyUnitRow()],
    apartmentConfigs: [emptyApartmentConfig()],
  }
}

export default function ProjectModal({ open, mode, cities, initialValue, saving, error, onClose, onSubmit }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const seeded = useMemo(() => {
    const name = initialValue?.name ?? ''
    const cityId = initialValue?.city?.id ?? initialValue?.cityId ?? ''
    const status = initialValue?.status ?? 'active'
    const projectCode = initialValue?.projectCode ?? ''

    const incomingInv = Array.isArray(initialValue?.inventory) ? initialValue.inventory : []
    const inventory =
      incomingInv.length > 0
        ? incomingInv.map((row) => {
            const category = row?.category === 'commercial' || row?.category === 'residential' ? row.category : 'residential'
            const subType = typeof row?.subType === 'string' ? row.subType : ''
            const isApartment = category === 'residential' && subType === 'apartment'

            if (isApartment) {
              const cfgs = Array.isArray(row?.apartmentConfigs) ? row.apartmentConfigs : []
              const apartmentConfigs =
                cfgs.length > 0
                  ? cfgs.map((c) => {
                      const pricingType = c?.pricingType === 'unit_based' || c?.pricingType === 'direct' ? c.pricingType : 'direct'
                      const pMin = c?.price?.min
                      const pMax = c?.price?.max
                      const directMin = typeof pMin === 'number' ? String(pMin) : ''
                      const directMax = typeof pMax === 'number' ? String(pMax) : ''
                      const incomingUnits = Array.isArray(c?.units) ? c.units : []
                      const units =
                        incomingUnits.length > 0
                          ? incomingUnits.map((u) => ({
                              unitLabel: u?.unitLabel ?? '',
                              unitKey: u?.unitKey ?? '',
                              minPrice: typeof u?.minPrice === 'number' ? String(u.minPrice) : '',
                              maxPrice: typeof u?.maxPrice === 'number' ? String(u.maxPrice) : '',
                              size: u?.size ?? '',
                            }))
                          : [emptyUnitRow()]
                      return {
                        config: c?.config ?? '',
                        configLabel: c?.configLabel ?? '',
                        pricingType,
                        directMin,
                        directMax,
                        units,
                      }
                    })
                  : [emptyApartmentConfig()]

              return {
                category,
                subType: 'apartment',
                pricingType: 'direct',
                directMin: '',
                directMax: '',
                units: [emptyUnitRow()],
                apartmentConfigs,
              }
            }

            const pricingType = row?.pricingType === 'unit_based' || row?.pricingType === 'direct' ? row.pricingType : 'direct'
            const pMin = row?.price?.min
            const pMax = row?.price?.max
            const directMin = typeof pMin === 'number' ? String(pMin) : ''
            const directMax = typeof pMax === 'number' ? String(pMax) : ''

            const incomingUnits = Array.isArray(row?.units) ? row.units : []
            const units =
              incomingUnits.length > 0
                ? incomingUnits.map((u) => ({
                    unitLabel: u?.unitLabel ?? '',
                    unitKey: u?.unitKey ?? '',
                    minPrice: typeof u?.minPrice === 'number' ? String(u.minPrice) : '',
                    maxPrice: typeof u?.maxPrice === 'number' ? String(u.maxPrice) : '',
                    size: u?.size ?? '',
                  }))
                : [emptyUnitRow()]

            return {
              category,
              subType,
              pricingType,
              directMin,
              directMax,
              units,
              apartmentConfigs: [emptyApartmentConfig()],
            }
          })
        : [emptyInventoryItem()]

    const imgs = Array.isArray(initialValue?.images) ? initialValue.images : []
    const imagesText = imgs.join('\n')

    const ams = Array.isArray(initialValue?.amenities) ? initialValue.amenities : []
    const amenitiesText = ams.join('\n')

    const description = initialValue?.description ?? ''

    return { name, cityId, status, projectCode, inventory, imagesText, amenitiesText, description }
  }, [initialValue])

  const [name, setName] = useState(seeded.name)
  const [cityId, setCityId] = useState(seeded.cityId)
  const [status, setStatus] = useState(seeded.status)
  const [projectCode, setProjectCode] = useState(seeded.projectCode)
  const [inventory, setInventory] = useState(seeded.inventory)
  const [imagesText, setImagesText] = useState(seeded.imagesText)
  const [amenitiesText, setAmenitiesText] = useState(seeded.amenitiesText)
  const [description, setDescription] = useState(seeded.description)
  const [localError, setLocalError] = useState('')

  if (!open) return null

  const title = mode === 'edit' ? 'Edit project' : 'Add project'

  function addInventoryItem() {
    setInventory((prev) => [...prev, emptyInventoryItem()])
  }

  function removeInventoryItem(idx) {
    setInventory((prev) => prev.filter((_, i) => i !== idx))
  }

  function setInventoryField(idx, field, value) {
    setInventory((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)))
  }

  function setInventoryUnitField(invIdx, unitIdx, field, value) {
    setInventory((prev) =>
      prev.map((it, i) => {
        if (i !== invIdx) return it
        const nextUnits = Array.isArray(it.units) ? it.units : []
        return { ...it, units: nextUnits.map((u, j) => (j === unitIdx ? { ...u, [field]: value } : u)) }
      })
    )
  }

  function addInventoryUnit(invIdx) {
    setInventory((prev) =>
      prev.map((it, i) => (i === invIdx ? { ...it, units: [...(Array.isArray(it.units) ? it.units : []), emptyUnitRow()] } : it))
    )
  }

  function removeInventoryUnit(invIdx, unitIdx) {
    setInventory((prev) =>
      prev.map((it, i) => {
        if (i !== invIdx) return it
        const nextUnits = (Array.isArray(it.units) ? it.units : []).filter((_, j) => j !== unitIdx)
        return { ...it, units: nextUnits.length ? nextUnits : [emptyUnitRow()] }
      })
    )
  }

  function addApartmentConfig(invIdx) {
    setInventory((prev) =>
      prev.map((it, i) => {
        if (i !== invIdx) return it
        return { ...it, apartmentConfigs: [...(Array.isArray(it.apartmentConfigs) ? it.apartmentConfigs : []), emptyApartmentConfig()] }
      })
    )
  }

  function removeApartmentConfig(invIdx, cfgIdx) {
    setInventory((prev) =>
      prev.map((it, i) => {
        if (i !== invIdx) return it
        const next = (Array.isArray(it.apartmentConfigs) ? it.apartmentConfigs : []).filter((_, j) => j !== cfgIdx)
        return { ...it, apartmentConfigs: next.length ? next : [emptyApartmentConfig()] }
      })
    )
  }

  function setApartmentConfigField(invIdx, cfgIdx, field, value) {
    setInventory((prev) =>
      prev.map((it, i) => {
        if (i !== invIdx) return it
        const cfgs = Array.isArray(it.apartmentConfigs) ? it.apartmentConfigs : []
        return { ...it, apartmentConfigs: cfgs.map((c, j) => (j === cfgIdx ? { ...c, [field]: value } : c)) }
      })
    )
  }

  function addApartmentConfigUnit(invIdx, cfgIdx) {
    setInventory((prev) =>
      prev.map((it, i) => {
        if (i !== invIdx) return it
        const cfgs = Array.isArray(it.apartmentConfigs) ? it.apartmentConfigs : []
        return {
          ...it,
          apartmentConfigs: cfgs.map((c, j) => (j === cfgIdx ? { ...c, units: [...(Array.isArray(c.units) ? c.units : []), emptyUnitRow()] } : c)),
        }
      })
    )
  }

  function removeApartmentConfigUnit(invIdx, cfgIdx, unitIdx) {
    setInventory((prev) =>
      prev.map((it, i) => {
        if (i !== invIdx) return it
        const cfgs = Array.isArray(it.apartmentConfigs) ? it.apartmentConfigs : []
        return {
          ...it,
          apartmentConfigs: cfgs.map((c, j) => {
            if (j !== cfgIdx) return c
            const nextUnits = (Array.isArray(c.units) ? c.units : []).filter((_, k) => k !== unitIdx)
            return { ...c, units: nextUnits.length ? nextUnits : [emptyUnitRow()] }
          }),
        }
      })
    )
  }

  function setApartmentConfigUnitField(invIdx, cfgIdx, unitIdx, field, value) {
    setInventory((prev) =>
      prev.map((it, i) => {
        if (i !== invIdx) return it
        const cfgs = Array.isArray(it.apartmentConfigs) ? it.apartmentConfigs : []
        return {
          ...it,
          apartmentConfigs: cfgs.map((c, j) => {
            if (j !== cfgIdx) return c
            const units = Array.isArray(c.units) ? c.units : []
            return { ...c, units: units.map((u, k) => (k === unitIdx ? { ...u, [field]: value } : u)) }
          }),
        }
      })
    )
  }

  function validateAndBuildPayload() {
    setLocalError('')
    const nextName = name.trim()
    const nextStatus = status.trim()
    if (!nextName) return { ok: false, message: 'Name is required.' }
    if (!cityId) return { ok: false, message: 'City is required.' }
    const nextProjectCode = String(projectCode ?? '').trim()
    if (mode !== 'edit' && !nextProjectCode) return { ok: false, message: 'Project code is required.' }
    if (!nextStatus) return { ok: false, message: 'Status is required.' }

    const images = parseImagesInput(imagesText)
    const amenities = parseAmenitiesInput(amenitiesText)
    const nextDescription = String(description ?? '').trim()

    const inv = Array.isArray(inventory) ? inventory : []
    if (inv.length === 0) return { ok: false, message: 'At least one inventory item is required.' }

    const builtInventory = inv.map((it, idx) => {
      const category = it?.category
      const subType = it?.subType
      if (category !== 'commercial' && category !== 'residential') return { ok: false, message: `Inventory #${idx + 1}: category is required.` }
      if (!subType) return { ok: false, message: `Inventory #${idx + 1}: subtype is required.` }

      const isApartment = category === 'residential' && subType === 'apartment'
      if (isApartment) {
        const cfgs = Array.isArray(it.apartmentConfigs) ? it.apartmentConfigs : []
        if (cfgs.length === 0) return { ok: false, message: `Inventory #${idx + 1}: add at least one apartment config.` }

        const builtCfgs = cfgs.map((c, cfgIdx) => {
          const config = String(c?.config ?? '').trim()
          if (!config) return { ok: false, message: `Inventory #${idx + 1} config #${cfgIdx + 1}: config key is required.` }
          const configLabel = String(c?.configLabel ?? '').trim()
          const pricingType = c?.pricingType === 'unit_based' || c?.pricingType === 'direct' ? c.pricingType : null
          if (!pricingType) return { ok: false, message: `Inventory #${idx + 1} config #${cfgIdx + 1}: pricing type is required.` }

          if (pricingType === 'direct') {
            const min = Number(c?.directMin)
            const max = Number(c?.directMax)
            if (!Number.isFinite(min) || !Number.isFinite(max))
              return { ok: false, message: `Inventory #${idx + 1} config #${cfgIdx + 1}: direct min/max is required.` }
            if (min < 0 || max < 0) return { ok: false, message: `Inventory #${idx + 1} config #${cfgIdx + 1}: price cannot be negative.` }
            return { ok: true, value: { config, ...(configLabel ? { configLabel } : {}), pricingType, price: { min, max } } }
          }

          const units = Array.isArray(c?.units) ? c.units : []
          const builtUnits = units
            .map((u) => {
              const unitLabel = String(u?.unitLabel ?? '').trim()
              if (!unitLabel) return null
              const unitKeyRaw = String(u?.unitKey ?? '').trim()
              const unitKey = unitKeyRaw || slugifyUnitKey(unitLabel)
              const size = String(u?.size ?? '').trim()
              const minPrice = Number(u?.minPrice)
              const maxPrice = Number(u?.maxPrice)
              if (!unitKey) return null
              if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) return null
              if (minPrice < 0 || maxPrice < 0) return null
              return { unitKey, unitLabel, minPrice, maxPrice, ...(size ? { size } : {}) }
            })
            .filter(Boolean)

          if (!builtUnits.length)
            return { ok: false, message: `Inventory #${idx + 1} config #${cfgIdx + 1}: at least one valid unit row is required.` }

          return { ok: true, value: { config, ...(configLabel ? { configLabel } : {}), pricingType, units: builtUnits } }
        })

        for (const r of builtCfgs) {
          if (!r.ok) return r
        }

        return { ok: true, value: { category, subType, apartmentConfigs: builtCfgs.map((r) => r.value) } }
      }

      const pricingType = it?.pricingType === 'unit_based' || it?.pricingType === 'direct' ? it.pricingType : null
      if (!pricingType) return { ok: false, message: `Inventory #${idx + 1}: pricing type is required.` }

      if (pricingType === 'direct') {
        const min = Number(it?.directMin)
        const max = Number(it?.directMax)
        if (!Number.isFinite(min) || !Number.isFinite(max)) return { ok: false, message: `Inventory #${idx + 1}: direct min/max is required.` }
        if (min < 0 || max < 0) return { ok: false, message: `Inventory #${idx + 1}: price cannot be negative.` }
        return { ok: true, value: { category, subType, pricingType, price: { min, max } } }
      }

      const units = Array.isArray(it?.units) ? it.units : []
      const builtUnits = units
        .map((u) => {
          const unitLabel = String(u?.unitLabel ?? '').trim()
          if (!unitLabel) return null
          const unitKeyRaw = String(u?.unitKey ?? '').trim()
          const unitKey = unitKeyRaw || slugifyUnitKey(unitLabel)
          const size = String(u?.size ?? '').trim()
          const minPrice = Number(u?.minPrice)
          const maxPrice = Number(u?.maxPrice)
          if (!unitKey) return null
          if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) return null
          if (minPrice < 0 || maxPrice < 0) return null
          return { unitKey, unitLabel, minPrice, maxPrice, ...(size ? { size } : {}) }
        })
        .filter(Boolean)

      if (!builtUnits.length) return { ok: false, message: `Inventory #${idx + 1}: at least one valid unit row is required.` }

      return { ok: true, value: { category, subType, pricingType, units: builtUnits } }
    })

    for (const r of builtInventory) {
      if (!r.ok) return r
    }

    return {
      ok: true,
      payload: {
        name: nextName,
        cityId,
        status: nextStatus,
        ...(nextProjectCode ? { projectCode: nextProjectCode } : {}),
        inventory: builtInventory.map((r) => r.value),
        images,
        amenities,
        description: nextDescription,
      },
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl max-h-[92vh] flex flex-col">
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
          className="space-y-4 px-5 py-4 overflow-y-auto"
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
              <label htmlFor="proj-code" className="text-xs font-semibold text-slate-700">
                Project code
              </label>
              <input
                id="proj-code"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                placeholder="e.g. PRJ-DEL-0007"
              />
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
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Inventory</p>
                <p className="text-xs text-slate-500">Add offerings and pricing per subtype/config.</p>
              </div>
              <button
                type="button"
                onClick={addInventoryItem}
                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Add inventory item
              </button>
            </div>

            <div className="space-y-3">
              {inventory.map((it, invIdx) => {
                const isApartment = it.category === 'residential' && it.subType === 'apartment'
                const subtypeOptions =
                  it.category === 'commercial'
                    ? SUBTYPE_OPTIONS_BY_CATEGORY.commercial
                    : it.category === 'residential'
                      ? SUBTYPE_OPTIONS_BY_CATEGORY.residential
                      : []

                return (
                  <div key={invIdx} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Item #{invIdx + 1}</p>
                        <p className="text-xs text-slate-500">Category + subtype + pricing.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeInventoryItem(invIdx)}
                        disabled={inventory.length <= 1}
                        className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Remove item
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Category</label>
                        <select
                          value={it.category}
                          onChange={(e) => {
                            const nextCategory = e.target.value
                            const nextSubType = nextCategory === 'commercial' ? 'office' : 'apartment'
                            setInventory((prev) =>
                              prev.map((x, i) =>
                                i === invIdx
                                  ? {
                                      ...x,
                                      category: nextCategory,
                                      subType: nextSubType,
                                      pricingType: 'direct',
                                      directMin: '',
                                      directMax: '',
                                      units: [emptyUnitRow()],
                                      apartmentConfigs: [emptyApartmentConfig()],
                                    }
                                  : x
                              )
                            )
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                        >
                          {CATEGORY_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700">Subtype</label>
                        <select
                          value={it.subType}
                          onChange={(e) => {
                            const nextSubType = e.target.value
                            setInventory((prev) =>
                              prev.map((x, i) =>
                                i === invIdx
                                  ? {
                                      ...x,
                                      subType: nextSubType,
                                      pricingType: 'direct',
                                      directMin: '',
                                      directMax: '',
                                      units: [emptyUnitRow()],
                                      apartmentConfigs: [emptyApartmentConfig()],
                                    }
                                  : x
                              )
                            )
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                        >
                          {subtypeOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {!isApartment ? (
                        <div>
                          <label className="text-xs font-semibold text-slate-700">Pricing type</label>
                          <select
                            value={it.pricingType}
                            onChange={(e) => {
                              const next = e.target.value
                              setInventory((prev) =>
                                prev.map((x, i) =>
                                  i === invIdx ? { ...x, pricingType: next, directMin: '', directMax: '', units: [emptyUnitRow()] } : x
                                )
                              )
                            }}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                          >
                            <option value="direct">Direct</option>
                            <option value="unit_based">Unit based</option>
                          </select>
                        </div>
                      ) : null}
                    </div>

                    {!isApartment && it.pricingType === 'direct' ? (
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold text-slate-700">Min price</label>
                          <input
                            value={it.directMin}
                            onChange={(e) => setInventoryField(invIdx, 'directMin', e.target.value)}
                            inputMode="numeric"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                            placeholder="e.g. 4500000"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-700">Max price</label>
                          <input
                            value={it.directMax}
                            onChange={(e) => setInventoryField(invIdx, 'directMax', e.target.value)}
                            inputMode="numeric"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                            placeholder="e.g. 9000000"
                          />
                        </div>
                      </div>
                    ) : null}

                    {!isApartment && it.pricingType === 'unit_based' ? (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Units</p>
                            <p className="text-xs text-slate-500">Unit label/key + price range.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addInventoryUnit(invIdx)}
                            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                          >
                            Add unit
                          </button>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-200">
                          <div className="overflow-x-auto">
                            <table className="min-w-[980px] w-full text-left text-sm">
                              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                <tr>
                                  <th className="px-4 py-3">Unit label</th>
                                  <th className="px-4 py-3">Unit key</th>
                                  <th className="px-4 py-3">Min price</th>
                                  <th className="px-4 py-3">Max price</th>
                                  <th className="px-4 py-3">Size (optional)</th>
                                  <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 bg-white">
                                {it.units.map((u, unitIdx) => (
                                  <tr key={unitIdx} className="hover:bg-slate-50/70">
                                    <td className="px-4 py-2">
                                      <input
                                        value={u.unitLabel}
                                        onChange={(e) => {
                                          const nextLabel = e.target.value
                                          setInventoryUnitField(invIdx, unitIdx, 'unitLabel', nextLabel)
                                          if (!String(u.unitKey ?? '').trim()) {
                                            setInventoryUnitField(invIdx, unitIdx, 'unitKey', slugifyUnitKey(nextLabel))
                                          }
                                        }}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                        placeholder="e.g. Office Space 500-800"
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        value={u.unitKey}
                                        onChange={(e) => setInventoryUnitField(invIdx, unitIdx, 'unitKey', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-mono text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                        placeholder="office_500_800"
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        value={u.minPrice}
                                        onChange={(e) => setInventoryUnitField(invIdx, unitIdx, 'minPrice', e.target.value)}
                                        inputMode="numeric"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                        placeholder="e.g. 5000000"
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        value={u.maxPrice}
                                        onChange={(e) => setInventoryUnitField(invIdx, unitIdx, 'maxPrice', e.target.value)}
                                        inputMode="numeric"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                        placeholder="e.g. 7500000"
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        value={u.size}
                                        onChange={(e) => setInventoryUnitField(invIdx, unitIdx, 'size', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                        placeholder="e.g. 1200 sqft"
                                      />
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                      <button
                                        type="button"
                                        onClick={() => removeInventoryUnit(invIdx, unitIdx)}
                                        disabled={it.units.length <= 1}
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
                    ) : null}

                    {isApartment ? (
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Apartment configs</p>
                            <p className="text-xs text-slate-500">Pricing is set per config (Studio/2BHK/etc.).</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addApartmentConfig(invIdx)}
                            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                          >
                            Add config
                          </button>
                        </div>

                        {it.apartmentConfigs.map((cfg, cfgIdx) => (
                          <div key={cfgIdx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-sm font-semibold text-slate-900">Config #{cfgIdx + 1}</p>
                              <button
                                type="button"
                                onClick={() => removeApartmentConfig(invIdx, cfgIdx)}
                                disabled={it.apartmentConfigs.length <= 1}
                                className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                Remove config
                              </button>
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                              <div>
                                <label className="text-xs font-semibold text-slate-700">Config key</label>
                                <input
                                  value={cfg.config}
                                  onChange={(e) => setApartmentConfigField(invIdx, cfgIdx, 'config', e.target.value)}
                                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                  placeholder="e.g. 2bhk"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-slate-700">Config label (optional)</label>
                                <input
                                  value={cfg.configLabel}
                                  onChange={(e) => setApartmentConfigField(invIdx, cfgIdx, 'configLabel', e.target.value)}
                                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                  placeholder="e.g. 2 BHK"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-slate-700">Pricing type</label>
                                <select
                                  value={cfg.pricingType}
                                  onChange={(e) => setApartmentConfigField(invIdx, cfgIdx, 'pricingType', e.target.value)}
                                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                >
                                  <option value="direct">Direct</option>
                                  <option value="unit_based">Unit based</option>
                                </select>
                              </div>
                            </div>

                            {cfg.pricingType === 'direct' ? (
                              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="text-xs font-semibold text-slate-700">Min price</label>
                                  <input
                                    value={cfg.directMin}
                                    onChange={(e) => setApartmentConfigField(invIdx, cfgIdx, 'directMin', e.target.value)}
                                    inputMode="numeric"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                    placeholder="e.g. 4500000"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-slate-700">Max price</label>
                                  <input
                                    value={cfg.directMax}
                                    onChange={(e) => setApartmentConfigField(invIdx, cfgIdx, 'directMax', e.target.value)}
                                    inputMode="numeric"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                    placeholder="e.g. 9000000"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">Units</p>
                                    <p className="text-xs text-slate-500">Unit label/key + price range.</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => addApartmentConfigUnit(invIdx, cfgIdx)}
                                    className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                                  >
                                    Add unit
                                  </button>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                  <div className="overflow-x-auto">
                                    <table className="min-w-[980px] w-full text-left text-sm">
                                      <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                        <tr>
                                          <th className="px-4 py-3">Unit label</th>
                                          <th className="px-4 py-3">Unit key</th>
                                          <th className="px-4 py-3">Min price</th>
                                          <th className="px-4 py-3">Max price</th>
                                          <th className="px-4 py-3">Size (optional)</th>
                                          <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-200 bg-white">
                                        {(Array.isArray(cfg.units) ? cfg.units : []).map((u, unitIdx) => (
                                          <tr key={unitIdx} className="hover:bg-slate-50/70">
                                            <td className="px-4 py-2">
                                              <input
                                                value={u.unitLabel}
                                                onChange={(e) => {
                                                  const nextLabel = e.target.value
                                                  setApartmentConfigUnitField(invIdx, cfgIdx, unitIdx, 'unitLabel', nextLabel)
                                                  if (!String(u.unitKey ?? '').trim()) {
                                                    setApartmentConfigUnitField(invIdx, cfgIdx, unitIdx, 'unitKey', slugifyUnitKey(nextLabel))
                                                  }
                                                }}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                                placeholder="e.g. 2 BHK Premium"
                                              />
                                            </td>
                                            <td className="px-4 py-2">
                                              <input
                                                value={u.unitKey}
                                                onChange={(e) => setApartmentConfigUnitField(invIdx, cfgIdx, unitIdx, 'unitKey', e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-mono text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                                placeholder="2bhk_premium"
                                              />
                                            </td>
                                            <td className="px-4 py-2">
                                              <input
                                                value={u.minPrice}
                                                onChange={(e) => setApartmentConfigUnitField(invIdx, cfgIdx, unitIdx, 'minPrice', e.target.value)}
                                                inputMode="numeric"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                                placeholder="e.g. 5000000"
                                              />
                                            </td>
                                            <td className="px-4 py-2">
                                              <input
                                                value={u.maxPrice}
                                                onChange={(e) => setApartmentConfigUnitField(invIdx, cfgIdx, unitIdx, 'maxPrice', e.target.value)}
                                                inputMode="numeric"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                                placeholder="e.g. 7500000"
                                              />
                                            </td>
                                            <td className="px-4 py-2">
                                              <input
                                                value={u.size}
                                                onChange={(e) => setApartmentConfigUnitField(invIdx, cfgIdx, unitIdx, 'size', e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                                placeholder="e.g. 1200 sqft"
                                              />
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                              <button
                                                type="button"
                                                onClick={() => removeApartmentConfigUnit(invIdx, cfgIdx, unitIdx)}
                                                disabled={(Array.isArray(cfg.units) ? cfg.units : []).length <= 1}
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
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

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

