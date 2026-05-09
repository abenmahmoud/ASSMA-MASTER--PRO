import { Download, FileAudio, FileArchive } from 'lucide-react'

interface DownloadPanelProps {
  projectName: string
  outputUrl?: string
}

export function DownloadPanel({ projectName, outputUrl }: DownloadPanelProps) {
  const downloads = [
    {
      label: 'Master WAV',
      format: 'WAV 24-bit / 48kHz',
      icon: FileAudio,
      available: !!outputUrl,
    },
    {
      label: 'Master MP3',
      format: 'MP3 320kbps',
      icon: FileAudio,
      available: !!outputUrl,
    },
    {
      label: 'Stem Package',
      format: 'ZIP Archive',
      icon: FileArchive,
      available: !!outputUrl,
    },
  ]

  return (
    <div className="rounded-xl border border-studio-700 bg-studio-800 p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">Downloads</h3>
      <div className="space-y-2">
        {downloads.map(({ label, format, icon: Icon, available }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg bg-studio-700/50 px-4 py-3"
          >
            <Icon className="h-5 w-5 text-accent-cyan shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-studio-500">{format}</p>
            </div>
            <button
              disabled={!available}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                available
                  ? 'bg-accent-violet text-white hover:bg-accent-violet/80'
                  : 'bg-studio-600 text-studio-500 cursor-not-allowed'
              }`}
              onClick={() => {
                if (available) {
                  alert(`Download ${label} for "${projectName}" (mock)`)
                }
              }}
            >
              <Download className="h-3.5 w-3.5" />
              {available ? 'Download' : 'Pending'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
