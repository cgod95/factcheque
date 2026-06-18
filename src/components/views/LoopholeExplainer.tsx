import { useEffect, useRef, useState } from 'react'
import type { Loophole, LoopholeStep } from '@/data/types'
import { ClaimCard } from '../ClaimCard'
import { SourceBadge } from '../SourceBadge'

interface LoopholeExplainerProps {
  loophole: Loophole
}

type Focus = LoopholeStep['diagramFocus']

/** Vertical anatomy diagram. Highlights the element the active step describes. */
function LoopholeDiagram({ focus }: { focus: Focus }) {
  const boxes: { key: Exclude<Focus, 'question'>; title: string; sub: string; y: number }[] = [
    { key: 'ubo', title: 'The owner', sub: 'Not eligible to vote — cannot donate personally', y: 16 },
    { key: 'company', title: 'UK-registered company', sub: 'Carrying on business in the UK = permissible donor', y: 178 },
    { key: 'donation', title: 'Donation to a UK party', sub: 'Accepted as a permissible UK source', y: 372 },
  ]

  function boxStyle(key: Focus) {
    const active = focus === key
    return {
      fill: active ? 'var(--color-accent-soft)' : 'var(--color-surface)',
      stroke: active ? 'var(--color-accent)' : 'var(--color-line-strong)',
      strokeWidth: active ? 2 : 1,
    }
  }

  const gateActive = focus === 'question'

  return (
    <svg viewBox="0 0 300 480" className="mx-auto block max-h-[42vh] w-full lg:max-h-none" role="img" aria-label="Diagram: an ineligible owner controls a UK-registered company, which is a permissible donor and can give to a party. A gate on the donation marks the disputed eligibility test.">
      {/* connectors */}
      <g stroke="var(--color-line-strong)" strokeWidth="1.5" fill="none">
        <path d="M150 120 L150 174" markerEnd="url(#arrow)" />
        <path d="M150 282 L150 368" markerEnd="url(#arrow)" />
      </g>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--color-line-strong)" />
        </marker>
      </defs>

      {boxes.map((b) => {
        const st = boxStyle(b.key)
        const active = focus === b.key
        return (
          <g key={b.key}>
            <rect x="20" y={b.y} width="260" height="104" rx="10" {...st} className="transition-all duration-300" />
            <text x="150" y={b.y + 40} textAnchor="middle" fontSize="15" fontWeight={700} className={active ? 'fill-accent-ink' : 'fill-ink'}>
              {b.title}
            </text>
            <foreignObject x="34" y={b.y + 52} width="232" height="44">
              <div
                style={{ fontSize: '11.5px', lineHeight: 1.3, textAlign: 'center' }}
                className="text-muted"
              >
                {b.sub}
              </div>
            </foreignObject>
          </g>
        )
      })}

      {/* eligibility gate on the donation arrow */}
      <g className="transition-all duration-300">
        <rect
          x="46"
          y="300"
          width="208"
          height="50"
          rx="8"
          fill={gateActive ? 'var(--color-narrowed-soft)' : 'transparent'}
          stroke={gateActive ? 'var(--color-narrowed)' : 'var(--color-line)'}
          strokeWidth={gateActive ? 2 : 1}
          strokeDasharray={gateActive ? '0' : '4 4'}
        />
        <text x="150" y="320" textAnchor="middle" fontSize="11.5" fontWeight={700} className={gateActive ? 'fill-narrowed' : 'fill-muted'}>
          “Legitimate UK connection”
        </text>
        <text x="150" y="337" textAnchor="middle" fontSize="11" className={gateActive ? 'fill-narrowed' : 'fill-muted'}>
          revenue test vs profit test?
        </text>
      </g>
    </svg>
  )
}

export function LoopholeExplainer({ loophole }: LoopholeExplainerProps) {
  const { intro, steps, closingQuestion } = loophole
  const [activeIdx, setActiveIdx] = useState(0)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx)
            if (!Number.isNaN(idx)) setActiveIdx(idx)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [steps.length])

  const focus = steps[activeIdx]?.diagramFocus ?? 'ubo'

  return (
    <div>
      {/* Framing intro — attributed up front */}
      <div className="mb-10 max-w-3xl rounded-xl border border-tier-ngo/25 bg-tier-ngo/5 p-5 sm:p-6">
        <p className="text-[15px] leading-relaxed text-ink-soft">{intro.text}</p>
        <SourceBadge
          tier={intro.sourceTier}
          name={intro.sourceName}
          url={intro.sourceUrl}
          asOf={intro.asOf}
          caveat={intro.caveat}
          className="mt-3"
        />
      </div>

      {/* Block flow on mobile (so the sticky box pins against the tall shared
          container) and a 2-column grid on desktop (self-start lets the box pin
          within the tall row area without stretching). */}
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
        {/* Sticky diagram — direct child so its containing block is tall */}
        <div className="sticky top-14 z-10 mb-8 self-start rounded-xl border border-line bg-paper/85 p-4 backdrop-blur-sm sm:p-6 lg:top-20 lg:mb-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            The route, in the abstract
          </p>
          <LoopholeDiagram focus={focus} />
        </div>

        {/* Steps */}
        <ol className="relative">
          {steps.map((step, i) => {
            const active = i === activeIdx
            return (
              <li
                key={step.id}
                data-idx={i}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                className="min-h-[58vh] border-l-2 pl-6 transition-colors first:pt-2"
                style={{
                  borderColor: active ? 'var(--color-accent)' : 'var(--color-line)',
                }}
              >
                <div className={`py-8 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-45'}`}>
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                        active ? 'bg-accent text-paper' : 'bg-line text-ink-soft'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                  </div>
                  <p className="text-[16px] leading-relaxed text-ink-soft">{step.body}</p>
                  {step.attribution && <ClaimCard claim={step.attribution} className="mt-4" />}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Closing question */}
      <div className="mt-10 max-w-3xl border-t-2 border-line pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          The neutral question the bill raises
        </p>
        <p className="mt-2 font-display text-2xl leading-snug text-ink">{closingQuestion}</p>
      </div>
    </div>
  )
}
