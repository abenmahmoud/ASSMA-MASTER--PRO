export type ProjectStatus = 'uploading' | 'processing' | 'mixing' | 'mastering' | 'qc' | 'complete' | 'failed'

export interface Project {
  id: string
  name: string
  style: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  vocalFile?: string
  stemFiles?: string[]
  metrics?: AudioMetrics
  outputUrl?: string
  abVersions?: ABVersion[]
  progress: ProgressStep[]
}

export interface AudioMetrics {
  lufs: number
  truePeak: number
  lra: number
  stereoWidth: number
  codecQc: 'pass' | 'fail' | 'pending'
}

export interface ABVersion {
  id: string
  label: string
  url: string
  isSelected: boolean
}

export interface ProgressStep {
  id: string
  label: string
  status: 'pending' | 'active' | 'complete' | 'failed'
  timestamp?: string
}

export interface Style {
  id: string
  name: string
  description: string
  genre: string
  tags: string[]
  previewUrl?: string
  imageUrl?: string
}

export interface AppSettings {
  apiBaseUrl: string
}
