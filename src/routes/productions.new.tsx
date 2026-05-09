import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { UploadDropzone } from '@/components/UploadDropzone'
import { StyleCard } from '@/components/StyleCard'
import { assmaApi } from '@/lib/api'
import { adaptStyle } from '@/lib/adapters'
import type { Style } from '@/lib/types'

export const Route = createFileRoute('/productions/new')({
  component: NewProduction,
})

function NewProduction() {
  const [songName, setSongName] = useState('')
  const [vocalFiles, setVocalFiles] = useState<File[]>([])
  const [stemFiles, setStemFiles] = useState<File[]>([])
  const [styles, setStyles] = useState<Style[]>([])
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null)
  const [loadingStyles, setLoadingStyles] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await assmaApi.listStyles()
        const adapted = data.map(adaptStyle)
        setStyles(adapted)
        setSelectedStyle(adapted[0] ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger les styles')
      } finally {
        setLoadingStyles(false)
      }
    }

    load()
  }, [])

  async function handleSubmit() {
    setError(null)
    setMessage(null)

    if (!songName.trim()) {
      setError('Entre un nom de chanson.')
      return
    }

    if (!selectedStyle) {
      setError('Choisis un style.')
      return
    }

    if (vocalFiles.length !== 1) {
      setError('Upload exactement une voix lead WAV.')
      return
    }

    if (stemFiles.length === 0) {
      setError('Upload au moins un stem Suno WAV.')
      return
    }

    setSubmitting(true)

    try {
      setMessage('Création projet...')
      const project = await assmaApi.createProject({
        name: songName.trim(),
        style_id: selectedStyle.id,
      })

      setMessage('Upload voix...')
      await assmaApi.uploadVoice(project.id, vocalFiles[0])

      setMessage('Upload stems...')
      await assmaApi.uploadStems(project.id, stemFiles)

      setMessage('Création job production...')
      await assmaApi.startProduction(project.id)

      setMessage('Projet créé. Redirection...')
      window.location.href = `/projects/${project.id}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur API')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit =
    songName.trim() &&
    selectedStyle &&
    vocalFiles.length === 1 &&
    stemFiles.length > 0 &&
    !submitting

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Sparkles className="h-8 w-8 text-accent-violet" />
          New Production
        </h1>
        <p className="mt-2 text-studio-400">
          Upload voix + stems, choisis un style, puis crée un job VPS.
        </p>
      </div>

      <div className="rounded-2xl border border-studio-700 bg-studio-800/80 p-6">
        <label className="mb-2 block text-sm font-medium text-studio-300">
          Nom de chanson
        </label>
        <input
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          placeholder="ex: nouveau_single_assma"
          className="w-full rounded-xl border border-studio-600 bg-studio-900 px-4 py-3 text-white placeholder-studio-500 focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UploadDropzone
          label="Voix ASSMA dry / lead"
          accept=".wav"
          multiple={false}
          files={vocalFiles}
          onFilesChange={setVocalFiles}
        />

        <UploadDropzone
          label="Stems Suno"
          accept=".wav"
          multiple
          files={stemFiles}
          onFilesChange={setStemFiles}
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Style de production</h2>

        {loadingStyles && (
          <div className="rounded-xl border border-studio-700 bg-studio-800 p-6 text-studio-300">
            Chargement des styles...
          </div>
        )}

        {!loadingStyles && styles.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {styles.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                selected={selectedStyle?.id === style.id}
                onSelect={setSelectedStyle}
              />
            ))}
          </div>
        )}
      </section>

      {message && (
        <div className="rounded-xl border border-accent-cyan/40 bg-accent-cyan/10 p-4 text-accent-cyan">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-accent-red/40 bg-accent-red/10 p-4 text-accent-red">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-violet px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-violet/20 transition-colors hover:bg-accent-violet/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Création...' : 'Créer production'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
