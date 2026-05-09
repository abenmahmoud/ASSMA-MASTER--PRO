import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Settings as SettingsIcon, Save, Globe, Server, Info } from 'lucide-react'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const defaultUrl =
    typeof window !== 'undefined'
      ? (import.meta.env.VITE_API_BASE_URL as string) || ''
      : ''

  const [apiUrl, setApiUrl] = useState(defaultUrl)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('assma_api_url', apiUrl)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="h-7 w-7 text-accent-violet" />
          Settings
        </h1>
        <p className="mt-1 text-sm text-studio-400">
          Configure your ASSMA Production Studio.
        </p>
      </div>

      <div className="rounded-xl border border-studio-700 bg-studio-800 p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Server className="h-5 w-5 text-accent-violet" />
          <h2 className="text-lg font-semibold text-white">API Configuration</h2>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-studio-200">
            Backend API URL
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-500" />
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-vps.example.com/api"
                className="w-full rounded-xl border border-studio-600 bg-studio-900 pl-10 pr-4 py-3 text-white placeholder-studio-500 focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet"
              />
            </div>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-violet px-5 py-3 text-sm font-semibold text-white hover:bg-accent-violet/80 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
          {saved && (
            <p className="mt-2 text-sm text-accent-green">Settings saved.</p>
          )}
        </div>

        <div className="rounded-lg bg-studio-700/50 p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-accent-cyan shrink-0 mt-0.5" />
          <div className="text-sm text-studio-300">
            <p className="font-medium text-studio-200 mb-1">Environment Variable</p>
            <p>
              You can also set the API URL via the{' '}
              <code className="rounded bg-studio-800 px-1.5 py-0.5 text-accent-cyan text-xs">
                VITE_API_BASE_URL
              </code>{' '}
              environment variable in your Netlify site settings. The environment variable
              takes precedence over this setting.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-studio-700 bg-studio-800 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">About</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-studio-400">Application</p>
            <p className="text-white font-medium">ASSMA Production Studio</p>
          </div>
          <div>
            <p className="text-studio-400">Version</p>
            <p className="text-white font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-studio-400">Framework</p>
            <p className="text-white font-medium">TanStack Start + React</p>
          </div>
          <div>
            <p className="text-studio-400">Deployment</p>
            <p className="text-white font-medium">Netlify</p>
          </div>
        </div>
      </div>
    </div>
  )
}
