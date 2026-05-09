import { createFileRoute, Link } from '@tanstack/react-router'
import { FolderOpen, PlusCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { mockProjects } from '@/lib/mock-data'
import { ProjectCard } from '@/components/ProjectCard'
import type { ProjectStatus } from '@/lib/types'

export const Route = createFileRoute('/projects/')({
  component: ProjectList,
})

const statusFilters: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'processing' },
  { label: 'Mastering', value: 'mastering' },
  { label: 'Complete', value: 'complete' },
  { label: 'Failed', value: 'failed' },
]

function ProjectList() {
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = mockProjects.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FolderOpen className="h-7 w-7 text-accent-violet" />
          Projects
        </h1>
        <Link
          to="/productions/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent-violet px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-violet/80 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Production
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-500" />
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-studio-600 bg-studio-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-studio-500 focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
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
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="h-12 w-12 text-studio-600 mb-4" />
          <p className="text-studio-400">No projects found</p>
          <p className="text-sm text-studio-500">Try changing the filter or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
