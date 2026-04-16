import { useState } from 'react'
import { useLocalStorageState } from '../../shared/hooks/useLocalStorageState.js'

export default function ProfilePage() {
  const [profile, setProfile] = useLocalStorageState('fna.admin.profile', {
    name: 'Admin',
    email: 'admin@fnaestate.example',
    phone: '+91 120 0000 0000',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    window.setTimeout(() => {
      setSaving(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 1200)
    }, 400)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profile</h2>
        <p className="mt-1 text-sm text-slate-600">Update your personal details.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-700" htmlFor="profile-name">
              Name
            </label>
            <input
              id="profile-name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              placeholder="Your name"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-700" htmlFor="profile-email">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              placeholder="you@company.com"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-700" htmlFor="profile-phone">
              Phone
            </label>
            <input
              id="profile-phone"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              placeholder="+91 …"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-700" htmlFor="profile-role">
              Role
            </label>
            <input
              id="profile-role"
              value="Admin"
              disabled
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
           <div className="flex items-center gap-2">
            {saved ? <span className="text-xs font-semibold text-emerald-700">Saved</span> : null}
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

