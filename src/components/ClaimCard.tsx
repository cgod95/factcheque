import type { Claim } from '@/data/types'
import { SourceBadge } from './SourceBadge'

interface ClaimCardProps {
  claim: Claim
  /** Render without the bordered card chrome (for inline use). */
  bare?: boolean
  className?: string
}

/**
 * A claim plus its mandatory source badge. The standard way to put any factual
 * statement on screen.
 */
export function ClaimCard({ claim, bare = false, className = '' }: ClaimCardProps) {
  const body = (
    <>
      <p className="text-[15px] leading-relaxed text-ink-soft">{claim.text}</p>
      <SourceBadge
        tier={claim.sourceTier}
        name={claim.sourceName}
        url={claim.sourceUrl}
        asOf={claim.asOf}
        caveat={claim.caveat}
        className="mt-3"
      />
    </>
  )

  if (bare) return <div className={className}>{body}</div>

  return (
    <div
      className={`rounded-lg border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${className}`}
    >
      {body}
    </div>
  )
}
