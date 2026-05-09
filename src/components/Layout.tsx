import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Home,
  PlusCircle,
  FolderOpen,
  Music,
  Settings,
  Menu,
  X,
  Disc3,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/productions/new', label: 'New Production', icon: PlusCircle },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
  { to: '/styles', label: 'Style Library', icon: Music },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const currentPath = router.state.location.pathname

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-studio-800 border-r border-studio-700 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-studio-700 px-5">
          <Disc3 className="h-7 w-7 text-accent-violet" />
          <span className="text-lg font-bold tracking-tight text-white">
            ASSMA Studio
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = currentPath === to || (to !== '/' && currentPath.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent-violet/15 text-accent-violet'
                    : 'text-studio-300 hover:bg-studio-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-studio-700 px-5 py-4">
          <p className="text-xs text-studio-500">ASSMA Production Studio</p>
          <p className="text-xs text-studio-600">v1.0.0</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-studio-700 bg-studio-800/50 px-4 backdrop-blur-sm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-studio-400 hover:bg-studio-700 hover:text-white lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent-green" />
            <span className="text-sm text-studio-400">API Connected</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
