import type { AssmaProject, AssmaStyle } from './api'
import type { Project, ProjectStatus, ProgressStep, Style } from './types'

const stageOrder = [
  'upload',
  'vocal',
  'harmonies',
  'instruments',
  'premix',
  'mastering',
  'label_qc',
  'delivery',
]

const statusToActiveStage: Record<string, string> = {
  created: 'upload',
  ready: 'upload',
  uploading: 'upload',
  processing: 'vocal',
  vocal: 'vocal',
  harmonies: 'harmonies',
  instruments: 'instruments',
  premix: 'premix',
  mixing: 'premix',
  mastering: 'mastering',
  label_qc: 'label_qc',
  qc: 'label_qc',
  complete: 'delivery',
  failed: 'delivery',
}

export function adaptStyle(style: AssmaStyle): Style {
  return {
    id: style.id,
    name: style.name,
    description: style.description || '',
    genre: style.genre || 'ASSMA',
    tags: style.tags || [],
  }
}

export function buildProgress(status: string): ProgressStep[] {
  const activeStage = statusToActiveStage[status] || 'upload'
  const activeIndex = stageOrder.indexOf(activeStage)

  return [
    { id: 'upload', label: 'Upload' },
    { id: 'vocal', label: 'Vocal Chain' },
    { id: 'harmonies', label: 'Harmonies' },
    { id: 'instruments', label: 'Stems / Buses' },
    { id: 'premix', label: 'Premix' },
    { id: 'mastering', label: 'Mastering' },
    { id: 'label_qc', label: 'Label QC' },
    { id: 'delivery', label: 'Delivery' },
  ].map((step, index) => {
    if (status === 'failed') {
      return {
        ...step,
        status:
          index < activeIndex
            ? 'complete'
            : index === activeIndex
              ? 'failed'
              : 'pending',
      } as ProgressStep
    }

    if (status === 'complete') {
      return { ...step, status: 'complete' } as ProgressStep
    }

    return {
      ...step,
      status:
        index < activeIndex
          ? 'complete'
          : index === activeIndex
            ? 'active'
            : 'pending',
    } as ProgressStep
  })
}

export function adaptProject(project: AssmaProject): Project {
  return {
    id: project.id,
    name: project.name,
    style: project.style_id || 'unknown',
    status: (project.status || 'created') as ProjectStatus,
    createdAt: project.created_at || new Date().toISOString(),
    updatedAt: project.updated_at || project.created_at || new Date().toISOString(),
    vocalFile: (project as any).vocalFile,
    stemFiles: (project as any).stemFiles || [],
    metrics: project.metrics
      ? {
          lufs: Number((project.metrics as any).lufs ?? -14),
          truePeak: Number((project.metrics as any).truePeak ?? -1),
          lra: Number((project.metrics as any).lra ?? 6),
          stereoWidth: Number((project.metrics as any).stereoWidth ?? 0.8),
          codecQc: ((project.metrics as any).codecQc ?? 'pending') as
            | 'pass'
            | 'fail'
            | 'pending',
        }
      : undefined,
    outputUrl: project.final_master_url,
    progress: buildProgress(project.status || 'created'),
  }
}
