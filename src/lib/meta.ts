import type { SourceTier, RouteStatus, ActorStance } from '@/data/types'

/**
 * Static class-name lookups for source tiers and route status.
 *
 * These must be written as literal strings (not interpolated) so Tailwind's
 * scanner can see them and generate the utilities. Colours come from the tokens
 * defined in `index.css` under `@theme`.
 */

export interface TierMeta {
  /** Short label shown on the badge. */
  label: string
  /** Longer description for tooltips / legends. */
  description: string
  dot: string
  chip: string
  text: string
}

export const tierMeta: Record<SourceTier, TierMeta> = {
  statute: {
    label: 'Official record',
    description: 'Statute, regulator record or court finding',
    dot: 'bg-tier-statute',
    chip: 'bg-tier-statute/10 text-tier-statute border-tier-statute/25',
    text: 'text-tier-statute',
  },
  debate: {
    label: 'Parliamentary debate',
    description: 'Hansard — a named member’s on-record words',
    dot: 'bg-tier-debate',
    chip: 'bg-tier-debate/10 text-tier-debate border-tier-debate/25',
    text: 'text-tier-debate',
  },
  ngo: {
    label: 'Investigative / NGO',
    description: 'A named NGO or investigative finding',
    dot: 'bg-tier-ngo',
    chip: 'bg-tier-ngo/10 text-tier-ngo border-tier-ngo/25',
    text: 'text-tier-ngo',
  },
  framing: {
    label: 'Factcheque framing',
    description: 'Factcheque’s own neutral synthesis — not a new factual claim',
    dot: 'bg-tier-framing',
    chip: 'bg-tier-framing/10 text-tier-framing border-tier-framing/30',
    text: 'text-tier-framing',
  },
}

export const tierOrder: SourceTier[] = ['statute', 'debate', 'ngo', 'framing']

export interface RouteStatusMeta {
  label: string
  short: string
  stroke: string // hex for SVG fill/stroke
  chip: string
  text: string
  dot: string
}

export const routeStatusMeta: Record<RouteStatus, RouteStatusMeta> = {
  closed: {
    label: 'Closed by this bill',
    short: 'Closed',
    stroke: 'var(--color-closed)',
    chip: 'bg-closed-soft text-closed border-closed/30',
    text: 'text-closed',
    dot: 'bg-closed',
  },
  narrowed: {
    label: 'Narrowed by this bill',
    short: 'Narrowed',
    stroke: 'var(--color-narrowed)',
    chip: 'bg-narrowed-soft text-narrowed border-narrowed/30',
    text: 'text-narrowed',
    dot: 'bg-narrowed',
  },
  open: {
    label: 'Left open',
    short: 'Open',
    stroke: 'var(--color-open)',
    chip: 'bg-open-soft text-open border-open/30',
    text: 'text-open',
    dot: 'bg-open',
  },
}

export const routeStatusOrder: RouteStatus[] = ['closed', 'narrowed', 'open']

export const stanceMeta: Record<ActorStance, { label: string; chip: string }> = {
  government: {
    label: 'Government line',
    chip: 'bg-accent-soft text-accent-ink border-accent/25',
  },
  'stronger-safeguards': {
    label: 'Argued for a stronger test',
    chip: 'bg-tier-debate/10 text-tier-debate border-tier-debate/25',
  },
  'welcome-with-caveat': {
    label: 'Welcomed, with a caveat',
    chip: 'bg-tier-ngo/10 text-tier-ngo border-tier-ngo/25',
  },
  briefing: {
    label: 'Official briefing / review',
    chip: 'bg-tier-statute/10 text-tier-statute border-tier-statute/25',
  },
}
