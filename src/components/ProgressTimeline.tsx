import { Check, Loader2, AlertCircle, Circle } from 'lucide-react'
import type { ProgressStep } from '@/lib/types'

export function ProgressTimeline({ steps }: { steps: ProgressStep[] }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                step.status === 'complete'
                  ? 'border-accent-green bg-accent-green/20'
                  : step.status === 'active'
                    ? 'border-accent-violet bg-accent-violet/20'
                    : step.status === 'failed'
                      ? 'border-accent-red bg-accent-red/20'
                      : 'border-studio-600 bg-studio-800'
              }`}
            >
              {step.status === 'complete' && (
                <Check className="h-4 w-4 text-accent-green" />
              )}
              {step.status === 'active' && (
                <Loader2 className="h-4 w-4 animate-spin text-accent-violet" />
              )}
              {step.status === 'failed' && (
                <AlertCircle className="h-4 w-4 text-accent-red" />
              )}
              {step.status === 'pending' && (
                <Circle className="h-3 w-3 text-studio-500" />
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium whitespace-nowrap ${
                step.status === 'complete'
                  ? 'text-accent-green'
                  : step.status === 'active'
                    ? 'text-accent-violet'
                    : step.status === 'failed'
                      ? 'text-accent-red'
                      : 'text-studio-500'
              }`}
            >
              {step.label}
            </span>
            {step.timestamp && (
              <span className="text-[10px] text-studio-500">
                {new Date(step.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`mx-1 h-0.5 w-8 sm:w-12 lg:w-16 ${
                step.status === 'complete' ? 'bg-accent-green' : 'bg-studio-600'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
