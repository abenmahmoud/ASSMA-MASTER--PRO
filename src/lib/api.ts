const DEFAULT_API_BASE_URL = 'http://localhost:9000'

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem('assma_api_url')
    if (saved && saved.trim()) {
      return saved.replace(/\/+$/, '')
    }
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined
  return (envUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, '')
}

export type ProjectStatus =
  | 'created'
  | 'uploading'
  | 'ready'
  | 'processing'
  | 'vocal'
  | 'harmonies'
  | 'instruments'
  | 'premix'
  | 'mastering'
  | 'label_qc'
  | 'complete'
  | 'failed'

export type AssmaStyle = {
  id: string
  name: string
  description?: string
  genre?: string
  tags?: string[]
  icon?: string
}

export type AssmaProject = {
  id: string
  name: string
  slug?: string
  style_id?: string
  status: ProjectStatus
  created_at?: string
  updated_at?: string
  metrics?: Record<string, unknown>
  final_master_url?: string
}

export type AssmaJob = {
  id: string
  project_id: string
  status: ProjectStatus
  progress_percent: number
  current_stage?: string
  error_message?: string
  created_at?: string
  updated_at?: string
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${path}`

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`ASSMA API ${res.status}: ${text || res.statusText}`)
  }

  return res.json() as Promise<T>
}

export const assmaApi = {
  health: () =>
    apiFetch<{ ok: boolean; version: string; root?: string }>('/api/health'),

  listStyles: () =>
    apiFetch<AssmaStyle[]>('/api/styles'),

  getStyle: (styleId: string) =>
    apiFetch<AssmaStyle>(`/api/styles/${encodeURIComponent(styleId)}`),

  listProjects: () =>
    apiFetch<AssmaProject[]>('/api/projects'),

  getProject: (projectId: string) =>
    apiFetch<AssmaProject>(`/api/projects/${encodeURIComponent(projectId)}`),

  createProject: (data: { name: string; style_id: string }) =>
    apiFetch<AssmaProject>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  uploadVoice: (projectId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)

    return apiFetch<{ ok: boolean; filename: string }>(
      `/api/projects/${encodeURIComponent(projectId)}/upload/voice`,
      {
        method: 'POST',
        body: form,
      },
    )
  },

  uploadStems: (projectId: string, files: File[]) => {
    const form = new FormData()
    for (const file of files) {
      form.append('files', file)
    }

    return apiFetch<{ ok: boolean; files: string[] }>(
      `/api/projects/${encodeURIComponent(projectId)}/upload/stems`,
      {
        method: 'POST',
        body: form,
      },
    )
  },

  startProduction: (projectId: string) =>
    apiFetch<AssmaJob>(
      `/api/projects/${encodeURIComponent(projectId)}/produce`,
      {
        method: 'POST',
      },
    ),

  getJob: (jobId: string) =>
    apiFetch<AssmaJob>(`/api/jobs/${encodeURIComponent(jobId)}`),

  listFiles: (projectId: string) =>
    apiFetch<{ files: { name: string; url: string; size_bytes?: number }[] }>(
      `/api/projects/${encodeURIComponent(projectId)}/files`,
    ),

  downloadUrl: (projectId: string, filename: string) =>
    `${getApiBaseUrl()}/api/projects/${encodeURIComponent(
      projectId,
    )}/download/${encodeURIComponent(filename)}`,
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  return apiFetch<T>(endpoint, options)
}
