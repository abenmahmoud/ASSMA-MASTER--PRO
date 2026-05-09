import { Link } from '@tanstack/react-router'
import { Clock, ChevronRight, Music } from 'lucide-react'
import type { Project } from '@/lib/types'

const statusConfig: Record<string, { label: string; color: string }> = {
  uploading: { label: 'Uploading', color: 'bg-accent-amber text-studio-900' },
  processing: { label: 'Processing', color: 'bg-accent-cyan text-studio-900' },
  mixing: { label: 'Mixing', color: 'bg-accent-violet text-white' },
  mastering: { label: 'Mastering', color: 'bg-accent-violet text-white' },
  qc: { label: 'Quality Check', color: 'bg-accent-cyan text-studio-900' },
  complete: { label: 'Complete', color: 'bg-accent-green text-studio-900' },
  failed: { label: 'Failed', color: 'bg-accent-red text-white' },
}

export function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status] ?? statusConfig.processing
  const completedSteps = project.progress.filter((s) => s.status === 'complete').length
  const totalSteps = project.progress.length
  const progressPercent = (completedSteps / totalSteps) * 100

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group block rounded-xl border border-studio-700 bg-studio-800 p-5 transition-all hover:border-accent-violet/40 hover:shadow-lg hover:shadow-accent-violet/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-studio-700">
            <Music className="h-5 w-5 text-accent-violet" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-accent-violet transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-studio-400">{project.style}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-studio-400 mb-1.5">
          <span>Progress</span>
          <span>{completedSteps}/{totalSteps} steps</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-studio-700">
          <div
            className="h-full rounded-full bg-accent-violet transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-studio-500">
          <Clock className="h-3.5 w-3.5" />
          {new Date(project.updatedAt).toLocaleDateString()}
        </div>
        <ChevronRight className="h-4 w-4 text-studio-500 group-hover:text-accent-violet transition-colors" />
      </div>
    </Link>
  )
}
