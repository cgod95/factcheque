import type { SourceTier } from '@/data/types'
import { tierMeta } from '@/lib/meta'
import { ExternalLinkIcon } from './icons'

interface SourceBadgeProps {
  tier: SourceTier
  name: string
  url: string
  asOf: string
  /** The "no suggestion of wrongdoing" caveat, rendered verbatim when present. */
  caveat?: string
  /** Compact variant for dense contexts (e.g. table rows). */
  compact?: boolean
  className?: string
}

/**
 * The single component used everywhere a sourced claim appears. It shows the
 * fact tier, links through to the source, and carries the "as of" date and any
 * no-wrongdoing caveat. If a claim cannot supply these props, it should not be
 * on screen.
 */
export function SourceBadge({
  tier,
  name,
  url,
  asOf,
  caveat,
  compact = false,
  className = '',
}: SourceBadgeProps) {
  const meta = tierMeta[tier]

  return (
    <div className={className}>
      <div
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${
          compact ? 'text-[11px]' : 'text-xs'
        }`}
      >
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium ${meta.chip}`}
          title={meta.description}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
          {meta.label}
        </span>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 font-medium text-accent decoration-accent/30 underline-offset-2 hover:underline"
          aria-label={`Source: ${name} (opens in a new tab)`}
        >
          <span className={compact ? 'max-w-[14rem] truncate' : ''}>{name}</span>
          <ExternalLinkIcon className="h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100" />
        </a>

        <span className="text-muted">· as of {asOf}</span>
      </div>

      {caveat && (
        <p className={`mt-1.5 italic text-muted ${compact ? 'text-[11px]' : 'text-xs'}`}>
          {caveat}
        </p>
      )}
    </div>
  )
}
