import { createFileRoute, Link } from '@tanstack/react-router'
import { FolderOpen, PlusCircle, Search, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import { assmaApi } from '@/lib/api'
import { adaptProject } from '@/lib/adapters'
import type { Project, ProjectStatus } from '@/lib/types'

export const Route = createFileRoute('/projects/')({
  component: ProjectList,
})

const statusFilters: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Ready', value: 'ready' },
  { label: 'Processing', value: 'processing' },
  { label: 'Mastering', value: 'mastering' },
  { label: 'Complete', value: 'complete' },
  { label: 'Failed', value: 'failed' },
]

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadProjects() {
    setLoading(true)
    setError(null)

    try {
      const data = await assmaApi.listProjects()
      setProjects(data.map(adaptProject))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const filtered = projects.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
            <FolderOpen className="h-8 w-8 text-accent-violet" />
            Projects
          </h1>
          <p className="mt-2 text-studio-400">
            Projets chargés depuis le VPS.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadProjects}
            className="inline-flex items-center gap-2 rounded-xl border border-studio-600 px-4 py-2 text-sm font-medium text-studio-200 hover:bg-studio-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <Link
            to="/productions/new"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent-violet/20 transition-colors hover:bg-accent-violet/90"
          >
            <PlusCircle className="h-4 w-4" />
            New Production
          </Link>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-500" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-studio-600 bg-studio-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-studio-500 focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === value
                ? 'bg-accent-violet/15 text-accent-violet'
                : 'text-studio-400 hover:bg-studio-700 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="rounded-xl border border-studio-700 bg-studio-800 p-6 text-studio-300">
          Chargement des projets...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-accent-red/40 bg-accent-red/10 p-6 text-accent-red">
          API error: {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 ? (
        <div className="rounded-xl border border-studio-700 bg-studio-800 p-8 text-center">
          <p className="text-studio-400">No projects found</p>
          <p className="mt-2 text-sm text-studio-500">
            Crée une nouvelle production pour tester l’API.
          </p>
        </div>
      ) : null}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
