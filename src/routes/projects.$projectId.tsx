import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, FileAudio, Calendar } from 'lucide-react'
import { mockProjects } from '@/lib/mock-data'
import { ProgressTimeline } from '@/components/ProgressTimeline'
import { AudioPlayer } from '@/components/AudioPlayer'
import { MetricsPanel } from '@/components/MetricsPanel'
import { DownloadPanel } from '@/components/DownloadPanel'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetail,
})

const statusConfig: Record<string, { label: string; color: string }> = {
  uploading: { label: 'Uploading', color: 'bg-accent-amber text-studio-900' },
  processing: { label: 'Processing', color: 'bg-accent-cyan text-studio-900' },
  mixing: { label: 'Mixing', color: 'bg-accent-violet text-white' },
  mastering: { label: 'Mastering', color: 'bg-accent-violet text-white' },
  qc: { label: 'Quality Check', color: 'bg-accent-cyan text-studio-900' },
  complete: { label: 'Complete', color: 'bg-accent-green text-studio-900' },
  failed: { label: 'Failed', color: 'bg-accent-red text-white' },
}

function ProjectDetail() {
  const { projectId } = Route.useParams()
  const project = mockProjects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-studio-400">Project not found</p>
        <Link
          to="/projects"
          className="mt-4 text-sm text-accent-violet hover:text-accent-violet/80"
        >
          ← Back to projects
        </Link>
      </div>
    )
  }

  const status = statusConfig[project.status] ?? statusConfig.processing

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-studio-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-studio-400">
            <span className="flex items-center gap-1">
              <FileAudio className="h-4 w-4" /> {project.style}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      <div className="rounded-xl border border-studio-700 bg-studio-800 p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">Pipeline Progress</h2>
        <div className="overflow-x-auto pb-2">
          <ProgressTimeline steps={project.progress} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-xl border border-studio-700 bg-studio-800 p-6">
          <h2 className="mb-3 text-sm font-semibold text-white">Files</h2>
          <div className="space-y-2">
            {project.vocalFile && (
              <div className="flex items-center gap-3 rounded-lg bg-studio-700/50 px-4 py-3">
                <FileAudio className="h-4 w-4 text-accent-cyan" />
                <span className="text-sm text-studio-200">{project.vocalFile}</span>
                <span className="text-xs text-studio-500 ml-auto">Vocal</span>
              </div>
            )}
            {project.stemFiles?.map((stem) => (
              <div
                key={stem}
                className="flex items-center gap-3 rounded-lg bg-studio-700/50 px-4 py-3"
              >
                <FileAudio className="h-4 w-4 text-accent-violet" />
                <span className="text-sm text-studio-200">{stem}</span>
                <span className="text-xs text-studio-500 ml-auto">Stem</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {project.abVersions && project.abVersions.length > 0 && (
        <AudioPlayer versions={project.abVersions} />
      )}

      {project.metrics && <MetricsPanel metrics={project.metrics} />}

      <DownloadPanel
        projectName={project.name}
        outputUrl={project.outputUrl}
      />
    </div>
  )
}
