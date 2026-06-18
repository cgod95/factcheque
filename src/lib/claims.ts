import type { Bill, SourceTier } from '@/data/types'

/** A claim flattened out of the bill, tagged with the view it appears in. */
export interface FlatClaim {
  id: string
  text: string
  tier: SourceTier
  sourceName: string
  sourceUrl: string
  asOf: string
  caveat?: string
  group: string
}

/**
 * Every sourced statement in a case file, in one list — the basis for the data
 * appendix and its CSV/JSON export. Mirrors the order claims appear on the page.
 */
export function collectClaims(bill: Bill): FlatClaim[] {
  const out: FlatClaim[] = []
  const push = (
    c: { id: string; text: string; sourceTier: SourceTier; sourceName: string; sourceUrl: string; asOf: string; caveat?: string },
    group: string,
  ) =>
    out.push({
      id: c.id,
      text: c.text,
      tier: c.sourceTier,
      sourceName: c.sourceName,
      sourceUrl: c.sourceUrl,
      asOf: c.asOf,
      caveat: c.caveat,
      group,
    })

  push(bill.governmentRationale, 'Bill')
  bill.stages.forEach((s) => s.claims.forEach((c) => push(c, 'Timeline')))
  bill.context.forEach((f) => push(f.claim, 'Scale figures'))
  bill.routes.forEach((r) => push(r.claim, 'Money routes'))
  push(bill.loophole.intro, 'Loophole')
  bill.loophole.steps.forEach((s) => s.attribution && push(s.attribution, 'Loophole'))
  bill.actors.forEach((a) =>
    out.push({
      id: a.id,
      text: a.position,
      tier: a.sourceTier,
      sourceName: a.sourceName,
      sourceUrl: a.sourceUrl,
      asOf: a.date,
      group: 'Positions',
    }),
  )
  if (bill.previousChapter) push(bill.previousChapter.claim, 'Previous chapter')

  return out
}
