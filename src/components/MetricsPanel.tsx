import { Activity, Volume2, BarChart3, Radio, ShieldCheck } from 'lucide-react'
import type { AudioMetrics } from '@/lib/types'

const qcColors = {
  pass: 'text-accent-green bg-accent-green/15',
  fail: 'text-accent-red bg-accent-red/15',
  pending: 'text-accent-amber bg-accent-amber/15',
}

export function MetricsPanel({ metrics }: { metrics: AudioMetrics }) {
  const cards = [
    {
      label: 'LUFS',
      value: `${metrics.lufs.toFixed(1)} LUFS`,
      icon: Activity,
      detail: 'Integrated loudness',
    },
    {
      label: 'True Peak',
      value: `${metrics.truePeak.toFixed(1)} dBTP`,
      icon: Volume2,
      detail: 'Maximum sample peak',
    },
    {
      label: 'LRA',
      value: `${metrics.lra.toFixed(1)} LU`,
      icon: BarChart3,
      detail: 'Loudness range',
    },
    {
      label: 'Stereo Width',
      value: `${(metrics.stereoWidth * 100).toFixed(0)}%`,
      icon: Radio,
      detail: 'Correlation coefficient',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(({ label, value, icon: Icon, detail }) => (
          <div
            key={label}
            className="rounded-xl border border-studio-700 bg-studio-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-accent-violet" />
              <span className="text-xs font-medium text-studio-400">{label}</span>
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-[11px] text-studio-500 mt-1">{detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-studio-700 bg-studio-800 p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${qcColors[metrics.codecQc]}`}
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Codec QC</p>
            <p className="text-xs text-studio-400 capitalize">{metrics.codecQc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
