import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { UploadDropzone } from '@/components/UploadDropzone'
import { StyleCard } from '@/components/StyleCard'
import { mockStyles } from '@/lib/mock-data'
import type { Style } from '@/lib/types'

export const Route = createFileRoute('/productions/new')({
  component: NewProduction,
})

function NewProduction() {
  const navigate = useNavigate()
  const [vocalFiles, setVocalFiles] = useState<File[]>([])
  const [stemFiles, setStemFiles] = useState<File[]>([])
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null)
  const [projectName, setProjectName] = useState('')
  const [step, setStep] = useState<'upload' | 'style' | 'review'>('upload')

  const canProceedUpload = vocalFiles.length > 0 && stemFiles.length > 0 && projectName.trim()
  const canProceedStyle = !!selectedStyle
  const canSubmit = canProceedUpload && canProceedStyle

  const handleSubmit = () => {
    alert(
      `Production "${projectName}" submitted with style "${selectedStyle?.name}" (mock). Redirecting to projects…`,
    )
    navigate({ to: '/projects' })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-accent-violet" />
          New Production
        </h1>
        <p className="mt-1 text-sm text-studio-400">
          Upload your vocal and stems, choose a style, and let the engine do the rest.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['upload', 'style', 'review'] as const).map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              step === s
                ? 'bg-accent-violet/15 text-accent-violet'
                : 'text-studio-400 hover:text-white'
            }`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              step === s ? 'bg-accent-violet text-white' : 'bg-studio-700 text-studio-400'
            }`}>
              {i + 1}
            </span>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {step === 'upload' && (
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-studio-200">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Summer Vibes EP – Track 3"
              className="w-full rounded-xl border border-studio-600 bg-studio-800 px-4 py-3 text-white placeholder-studio-500 focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet"
            />
          </div>

          <UploadDropzone
            label="Vocal Track (WAV)"
            files={vocalFiles}
            onFilesChange={setVocalFiles}
          />

          <UploadDropzone
            label="Suno Stems (WAV)"
            multiple
            files={stemFiles}
            onFilesChange={setStemFiles}
          />

          <div className="flex justify-end">
            <button
              onClick={() => setStep('style')}
              disabled={!canProceedUpload}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors ${
                canProceedUpload
                  ? 'bg-accent-violet text-white hover:bg-accent-violet/80'
                  : 'bg-studio-700 text-studio-500 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 'style' && (
        <div className="space-y-6">
          <p className="text-sm text-studio-300">
            Choose a production style for your track.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockStyles.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                selected={selectedStyle?.id === style.id}
                onSelect={setSelectedStyle}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('upload')}
              className="rounded-xl border border-studio-600 px-6 py-2.5 text-sm font-medium text-studio-300 hover:bg-studio-700"
            >
              Back
            </button>
            <button
              onClick={() => setStep('review')}
              disabled={!canProceedStyle}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors ${
                canProceedStyle
                  ? 'bg-accent-violet text-white hover:bg-accent-violet/80'
                  : 'bg-studio-700 text-studio-500 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-studio-700 bg-studio-800 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Review</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-studio-400">Project Name</p>
                <p className="text-white font-medium">{projectName}</p>
              </div>
              <div>
                <p className="text-studio-400">Style</p>
                <p className="text-white font-medium">{selectedStyle?.name}</p>
              </div>
              <div>
                <p className="text-studio-400">Vocal</p>
                <p className="text-white font-medium">{vocalFiles[0]?.name}</p>
              </div>
              <div>
                <p className="text-studio-400">Stems</p>
                <p className="text-white font-medium">{stemFiles.length} file(s)</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('style')}
              className="rounded-xl border border-studio-600 px-6 py-2.5 text-sm font-medium text-studio-300 hover:bg-studio-700"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors ${
                canSubmit
                  ? 'bg-accent-green text-studio-900 hover:bg-accent-green/80'
                  : 'bg-studio-700 text-studio-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Start Production
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
