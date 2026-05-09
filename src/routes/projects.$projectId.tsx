import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar, FileAudio, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ProgressTimeline } from '@/components/ProgressTimeline'
import { MetricsPanel } from '@/components/MetricsPanel'
import { assmaApi } from '@/lib/api'
import { adaptProject } from '@/lib/adapters'
import type { Project } from '@/lib/types'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetail,
})

const statusConfig: Record<string, { label: string; color: string }> = {
  created: { label: 'Created', color: 'bg-studio-600 text-white' },
  ready: { label: 'Ready', color: 'bg-accent-green text-studio-900' },
  uploading: { label: 'Uploading', color: 'bg-accent-amber text-studio-900' },
  processing: { label: 'Processing', color: 'bg-accent-cyan text-studio-900' },
  vocal: { label: 'Vocal', color: 'bg-accent-violet text-white' },
  harmonies: { label: 'Harmonies', color: 'bg-accent-violet text-white' },
  instruments: { label: 'Instruments', color: 'bg-accent-violet text-white' },
  premix: { label: 'Premix', color: 'bg-accent-violet text-white' },
  mastering: { label: 'Mastering', color: 'bg-accent-violet text-white' },
  label_qc: { label: 'Label QC', color: 'bg-accent-cyan text-studio-900' },
  qc: { label: 'Quality Check', color: 'bg-accent-cyan text-studio-900' },
  complete: { label: 'Complete', color: 'bg-accent-green text-studio-900' },
  failed: { label: 'Failed', color: 'bg-accent-red text-white' },
}

function ProjectDetail() {
  const { projectId } = Route.useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [files, setFiles] = useState<{ name: string; url: string; size_bytes?: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadProject() {
    setLoading(true)
    setError(null)

    try {
      const data = await assmaApi.getProject(projectId)
      setProject(adaptProject(data))

      const fileData = await assmaApi.listFiles(projectId)
      setFiles(fileData.files || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="rounded-xl border border-studio-700 bg-studio-800 p-6 text-studio-300">
        Chargement projet...
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <p className="text-accent-red">Project not found or API error: {error}</p>
        <Link to="/projects" className="text-accent-violet hover:underline">
          ← Back to projects
        </Link>
      </div>
    )
  }

  const status = statusConfig[project.status] ?? statusConfig.processing

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/projects"
          className="mb-4 inline-flex items-center gap-2 text-sm text-studio-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-studio-400">
              <span>{project.style}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>

            <button
              onClick={loadProject}
              className="rounded-xl border border-studio-600 p-2 text-studio-300 hover:bg-studio-800 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-studio-700 bg-studio-800/80 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Pipeline Progress</h2>
        <ProgressTimeline steps={project.progress} />
      </section>

      <section className="rounded-2xl border border-studio-700 bg-studio-800/80 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Uploaded Files</h2>

        <div className="space-y-2">
          {project.vocalFile && (
            <div className="flex items-center gap-3 rounded-lg bg-studio-900 px-4 py-3">
              <FileAudio className="h-5 w-5 text-accent-violet" />
              <span className="text-white">{project.vocalFile}</span>
              <span className="text-xs text-studio-500">Vocal</span>
            </div>
          )}

          {project.stemFiles?.map((stem) => (
            <div key={stem} className="flex items-center gap-3 rounded-lg bg-studio-900 px-4 py-3">
              <FileAudio className="h-5 w-5 text-accent-cyan" />
              <span className="text-white">{stem}</span>
              <span className="text-xs text-studio-500">Stem</span>
            </div>
          ))}

          {!project.vocalFile && (!project.stemFiles || project.stemFiles.length === 0) && (
            <p className="text-studio-400">Aucun fichier listé dans le projet.</p>
          )}
        </div>
      </section>

      {project.metrics && <MetricsPanel metrics={project.metrics} />}

      <section className="rounded-2xl border border-studio-700 bg-studio-800/80 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Downloads</h2>

        {files.length === 0 ? (
          <p className="text-studio-400">
            Aucun master disponible pour l’instant. Le vrai moteur audio sera branché en Phase 2.
          </p>
        ) : (
          <div className="grid gap-3">
            {files.map((file) => (
              <a
                key={file.name}
                href={assmaApi.downloadUrl(projectId, file.name)}
                className="flex items-center justify-between rounded-lg bg-studio-900 px-4 py-3 hover:bg-studio-700"
              >
                <span className="text-white">{file.name}</span>
                <span className="text-sm text-studio-400">
                  {file.size_bytes ? `${(file.size_bytes / 1024 / 1024).toFixed(1)} MB` : 'download'}
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
