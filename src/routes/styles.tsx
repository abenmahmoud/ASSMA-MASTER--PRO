import { createFileRoute } from '@tanstack/react-router'
import { Music, Search } from 'lucide-react'
import { useState } from 'react'
import { mockStyles } from '@/lib/mock-data'
import { StyleCard } from '@/components/StyleCard'

export const Route = createFileRoute('/styles')({
  component: StyleLibrary,
})

function StyleLibrary() {
  const [search, setSearch] = useState('')

  const genres = [...new Set(mockStyles.map((s) => s.genre))]
  const [activeGenre, setActiveGenre] = useState<string | 'all'>('all')

  const filtered = mockStyles.filter((s) => {
    if (activeGenre !== 'all' && s.genre !== activeGenre) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Music className="h-7 w-7 text-accent-violet" />
          Style Library
        </h1>
        <p className="mt-1 text-sm text-studio-400">
          Browse production styles for your tracks.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-500" />
          <input
            type="text"
            placeholder="Search styles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-studio-600 bg-studio-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-studio-500 focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((style) => (
          <StyleCard key={style.id} style={style} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Music className="h-12 w-12 text-studio-600 mb-4" />
          <p className="text-studio-400">No styles found</p>
        </div>
      )}
    </div>
  )
}
