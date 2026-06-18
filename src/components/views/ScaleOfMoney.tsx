import { useEffect, useRef, useState } from 'react'
import type { Claim } from '@/data/types'
import { SourceBadge } from '../SourceBadge'

interface ScaleOfMoneyProps {
  /** Share (0–100) of party donations from the largest gifts. */
  pct: number
  /** Number of £1m+ donations behind that share. */
  donationCount: number
  /** Human total, e.g. "£41m". */
  totalLabel: string
  /** Number of sources behind ~a third of it. */
  sourceCount: number
  claim: Claim
}

/**
 * A 10×10 waffle: each cell is 1% of party donations in the year before the 2024
 * election. The highlighted cells are the share that came from a handful of very
 * large gifts — turning a dry percentage into something you can see.
 */
export function ScaleOfMoney({
  pct,
  donationCount,
  totalLabel,
  sourceCount,
  claim,
}: ScaleOfMoneyProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const cells = Array.from({ length: 100 }, (_, i) => i < pct)

  return (
    <div
      ref={ref}
      className="grid gap-6 rounded-xl border border-line bg-surface p-5 sm:p-6 md:grid-cols-[auto_1fr] md:items-center"
    >
      {/* Waffle */}
      <div
        className="grid w-[220px] shrink-0 grid-cols-10 gap-1"
        role="img"
        aria-label={`Waffle chart: about ${pct} of every 100 pounds of party donations came from ${donationCount} gifts of £1m or more.`}
      >
        {cells.map((on, i) => (
          <span
            key={i}
            className={`aspect-square rounded-[2px] transition-colors duration-500 ${
              on && shown ? 'bg-accent' : 'bg-line'
            }`}
            style={{ transitionDelay: on ? `${Math.min(i, pct) * 12}ms` : '0ms' }}
          />
        ))}
      </div>

      {/* Readout */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Concentration of party funding · year before the 2024 election
        </p>
        <p className="mt-2 font-display text-4xl leading-none text-ink">
          ≈{pct}%
          <span className="ml-2 align-middle text-base font-sans font-normal text-ink-soft">
            of donations
          </span>
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          came from just <span className="font-semibold text-ink">{donationCount} gifts</span> of £1
          million or more — about <span className="font-semibold text-ink">{totalLabel}</span> — with
          nearly a third of that traced to{' '}
          <span className="font-semibold text-ink">{sourceCount} sources</span>.
        </p>
        <SourceBadge
          tier={claim.sourceTier}
          name={claim.sourceName}
          url={claim.sourceUrl}
          asOf={claim.asOf}
          caveat={claim.caveat}
          className="mt-4"
        />
      </div>
    </div>
  )
}
