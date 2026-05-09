import { useState } from 'react'
import { Play, Pause, SkipBack, Volume2 } from 'lucide-react'
import type { ABVersion } from '@/lib/types'

interface AudioPlayerProps {
  versions: ABVersion[]
  onSelectVersion?: (id: string) => void
}

export function AudioPlayer({ versions, onSelectVersion }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [activeVersion, setActiveVersion] = useState(
    versions.find((v) => v.isSelected)?.id ?? versions[0]?.id,
  )
  const [progress, setProgress] = useState(35)

  const handleVersionClick = (id: string) => {
    setActiveVersion(id)
    onSelectVersion?.(id)
  }

  return (
    <div className="rounded-xl border border-studio-700 bg-studio-800 p-5">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-white">A/B Comparison</h3>
      </div>

      <div className="mb-4 flex gap-2">
        {versions.map((v) => (
          <button
            key={v.id}
            onClick={() => handleVersionClick(v.id)}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              activeVersion === v.id
                ? 'border-accent-violet bg-accent-violet/15 text-accent-violet'
                : 'border-studio-600 bg-studio-700 text-studio-300 hover:border-studio-500'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-studio-400 hover:bg-studio-700 hover:text-white">
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-violet text-white hover:bg-accent-violet/80 transition-colors"
        >
          {playing ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" />
          )}
        </button>
        <div className="flex-1">
          <div
            className="group relative h-2 w-full cursor-pointer rounded-full bg-studio-700"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setProgress(((e.clientX - rect.left) / rect.width) * 100)
            }}
          >
            <div
              className="h-full rounded-full bg-accent-violet transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-studio-500">
            <span>1:12</span>
            <span>3:28</span>
          </div>
        </div>
        <Volume2 className="h-4 w-4 text-studio-400" />
      </div>
    </div>
  )
}
