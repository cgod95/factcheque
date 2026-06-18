import { useRef, useState } from 'react'
import type { Stage } from '@/data/types'
import { ClaimCard } from '../ClaimCard'

interface TimelineProps {
  stages: Stage[]
}

const KIND_LABEL: Record<Stage['kind'], string> = {
  trigger: 'Trigger',
  introduction: 'Announcement',
  reading: 'Debate',
  committee: 'In progress',
  effect: 'Effect',
}

function dotClasses(status: Stage['status'], selected: boolean): string {
  if (status === 'current') {
    return `bg-accent ${selected ? 'ring-4 ring-accent/20' : 'ring-4 ring-accent/10'}`
  }
  if (status === 'upcoming') {
    return `bg-surface border-2 ${selected ? 'border-accent' : 'border-line-strong'}`
  }
  return selected ? 'bg-accent' : 'bg-ink'
}

/**
 * "How we got here" — the legislative journey as a horizontal, scrollable rail.
 * Selecting a node reveals its sourced detail in a stable panel below, so the
 * page doesn't reflow as the reader explores.
 */
export function Timeline({ stages }: TimelineProps) {
  const initial = stages.find((s) => s.status === 'current')?.id ?? stages[0]?.id
  const [selectedId, setSelectedId] = useState(initial)
  const railRef = useRef<HTMLOListElement>(null)

  const selected = stages.find((s) => s.id === selectedId) ?? stages[0]

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = e.key === 'ArrowRight' ? index + 1 : index - 1
    const target = stages[next]
    if (!target) return
    setSelectedId(target.id)
    const buttons = railRef.current?.querySelectorAll<HTMLButtonElement>('button[data-node]')
    buttons?.[next]?.focus()
  }

  return (
    <div>
      {/* Rail */}
      <div className="rail-scroll -mx-1 overflow-x-auto pb-3">
        <ol ref={railRef} className="relative flex min-w-max">
          {/* connecting line through the dot centres */}
          <div
            className="absolute top-[9px] h-px bg-line-strong"
            style={{ left: 'calc(110px / 2)', right: 'calc(110px / 2)' }}
            aria-hidden="true"
          />
          {stages.map((stage, i) => {
            const isSelected = stage.id === selectedId
            return (
              <li key={stage.id} className="relative w-[150px] shrink-0 px-2 sm:w-[170px]">
                <button
                  type="button"
                  data-node
                  onClick={() => setSelectedId(stage.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  aria-current={isSelected ? 'step' : undefined}
                  className="group flex w-full flex-col items-start text-left"
                >
                  <span
                    className={`relative z-10 mb-3 h-[18px] w-[18px] rounded-full transition ${dotClasses(
                      stage.status,
                      isSelected,
                    )}`}
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {stage.date}
                  </span>
                  <span
                    className={`mt-0.5 text-[15px] font-semibold leading-snug ${
                      isSelected ? 'text-accent' : 'text-ink group-hover:text-accent-ink'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted">
                    {stage.status === 'current' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    )}
                    {KIND_LABEL[stage.kind]}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Detail panel */}
      <div className="mt-6 rounded-xl border border-line bg-surface/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-2xl text-ink">{selected.label}</h3>
          <span className="text-sm text-muted">{selected.date}</span>
        </div>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          {selected.summary}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {selected.claims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </div>
    </div>
  )
}
