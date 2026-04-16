export default function ToggleSwitch({ enabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
        enabled ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

