import { createFileRoute } from '@tanstack/react-router'
import { Music, Search, RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { StyleCard } from '@/components/StyleCard'
import { assmaApi } from '@/lib/api'
import { adaptStyle } from '@/lib/adapters'
import type { Style } from '@/lib/types'

export const Route = createFileRoute('/styles')({
  component: StyleLibrary,
})

function StyleLibrary() {
  const [styles, setStyles] = useState<Style[]>([])
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadStyles() {
    setLoading(true)
    setError(null)

    try {
      const data = await assmaApi.listStyles()
      setStyles(data.map(adaptStyle))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStyles()
  }, [])

  const genres = useMemo(
    () => [...new Set(styles.map((s) => s.genre).filter(Boolean))],
    [styles],
  )

  const filtered = styles.filter((s) => {
    if (activeGenre !== 'all' && s.genre !== activeGenre) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
            <Music className="h-8 w-8 text-accent-violet" />
            Style Library
          </h1>
          <p className="mt-2 text-studio-400">
            Styles chargés depuis l’API VPS ASSMA.
          </p>
        </div>

        <button
          onClick={loadStyles}
          className="inline-flex items-center gap-2 rounded-xl border border-studio-600 px-4 py-2 text-sm font-medium text-studio-200 hover:bg-studio-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-500" />
        <input
          type="text"
          placeholder="Search styles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-studio-600 bg-studio-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-studio-500 focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveGenre('all')}
          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeGenre === 'all'
              ? 'bg-accent-violet/15 text-accent-violet'
              : 'text-studio-400 hover:bg-studio-700 hover:text-white'
          }`}
        >
          All
        </button>

        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeGenre === genre
                ? 'bg-accent-violet/15 text-accent-violet'
                : 'text-studio-400 hover:bg-studio-700 hover:text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {loading && (
        <div className="rounded-xl border border-studio-700 bg-studio-800 p-6 text-studio-300">
          Chargement des styles...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-accent-red/40 bg-accent-red/10 p-6 text-accent-red">
          API error: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((style) => (
            <StyleCard key={style.id} style={style} />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-studio-700 bg-studio-800 p-6 text-center">
          <p className="text-studio-400">No styles found</p>
        </div>
      )}
    </div>
  )
}
