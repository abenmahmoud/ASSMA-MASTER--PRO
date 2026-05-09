import { Music, Check } from 'lucide-react'
import type { Style } from '@/lib/types'

interface StyleCardProps {
  style: Style
  selected?: boolean
  onSelect?: (style: Style) => void
}

export function StyleCard({ style, selected = false, onSelect }: StyleCardProps) {
  return (
    <button
      onClick={() => onSelect?.(style)}
      className={`relative w-full rounded-xl border p-5 text-left transition-all ${
        selected
          ? 'border-accent-violet bg-accent-violet/10 shadow-lg shadow-accent-violet/10'
          : 'border-studio-700 bg-studio-800 hover:border-studio-500'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent-violet">
          <Check className="h-3.5 w-3.5 text-white" />
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            selected ? 'bg-accent-violet/20' : 'bg-studio-700'
          }`}
        >
          <Music className={`h-5 w-5 ${selected ? 'text-accent-violet' : 'text-studio-400'}`} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{style.name}</h3>
          <p className="text-xs text-studio-400">{style.genre}</p>
        </div>
      </div>
      <p className="text-sm text-studio-300 mb-3">{style.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {style.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-studio-700 px-2 py-0.5 text-xs text-studio-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
