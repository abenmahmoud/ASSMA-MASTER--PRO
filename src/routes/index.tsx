import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Disc3,
  FolderOpen,
  Music,
  Clock,
  TrendingUp,
  PlusCircle,
  Activity,
} from 'lucide-react'
import { mockProjects } from '@/lib/mock-data'
import { ProjectCard } from '@/components/ProjectCard'

export const Route = createFileRoute('/')({
  component: DashboardHome,
})

function DashboardHome() {
  const recentProjects = mockProjects.slice(0, 3)
  const completedCount = mockProjects.filter((p) => p.status === 'complete').length
  const activeCount = mockProjects.filter(
    (p) => !['complete', 'failed'].includes(p.status),
  ).length
  const failedCount = mockProjects.filter((p) => p.status === 'failed').length

  const stats = [
    {
      label: 'Total Projects',
      value: mockProjects.length,
      icon: FolderOpen,
      color: 'text-accent-violet',
      bg: 'bg-accent-violet/15',
    },
    {
      label: 'Active',
      value: activeCount,
      icon: Activity,
      color: 'text-accent-cyan',
      bg: 'bg-accent-cyan/15',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: TrendingUp,
      color: 'text-accent-green',
      bg: 'bg-accent-green/15',
    },
    {
      label: 'Failed',
      value: failedCount,
      icon: Clock,
      color: 'text-accent-red',
      bg: 'bg-accent-red/15',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Disc3 className="h-7 w-7 text-accent-violet" />
            ASSMA Production Studio
          </h1>
          <p className="mt-1 text-sm text-studio-400">
            AI-powered music production pipeline
          </p>
        </div>
        <Link
          to="/productions/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent-violet px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-violet/80 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Production
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-studio-700 bg-studio-800 p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-studio-400">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Music className="h-5 w-5 text-accent-violet" />
            Recent Projects
          </h2>
          <Link
            to="/projects"
            className="text-sm text-accent-violet hover:text-accent-violet/80 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
