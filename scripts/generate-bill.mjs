#!/usr/bin/env node
// @ts-check
/**
 * Factcheque case-file draft generator.
 *
 * Usage:
 *   npm run generate -- <billId>            e.g. npm run generate -- 4080
 *   npm run generate -- "<search term>"     e.g. npm run generate -- "Representation of the People"
 *
 * What it does — and deliberately does NOT do.
 * ---------------------------------------------
 * This is the first, deterministic fetcher described in src/data/ingestion/README.md.
 * It pulls a bill from the free UK Parliament Bills API and writes a DRAFT `Bill`
 * data file (conforming to src/data/types.ts) into src/data/generated/.
 *
 * It fills the parts that are STRUCTURED PUBLIC DATA and safe to automate:
 *   - bill metadata (title, session, current status)
 *   - the full legislative TIMELINE (stages + sitting dates), each with a
 *     factual, Bills-API-sourced `statute`-tier claim.
 *
 * It STUBS the parts that require human judgement and must never be auto-asserted:
 *   - the government rationale, scale figures, money routes, the loophole anatomy,
 *     and the positions of named actors.
 * Those carry `// TODO` markers. The human review step is the neutrality and
 * no-wrongdoing gate — the generator only ever produces a draft.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const API = 'https://bills-api.parliament.uk/api/v1'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Procedural stages that clutter a public-facing timeline. The human can re-add any.
const SKIP_STAGES = new Set([
  'programme motion',
  'money resolution',
  'money (no. 2) resolution',
  'carry-over motion',
  'ways and means resolution',
  'legislative grand committee (england)',
])

const today = new Date()
const RUN_DATE = `${today.getDate()} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`

const q = (v) => JSON.stringify(v ?? '')
const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
const camel = (slug) => slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
const fmtDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function mapKind(desc) {
  const d = desc.toLowerCase()
  if (d.includes('1st reading') || d.includes('reintroduc') || d.includes('introduc')) return 'introduction'
  if (d.includes('committee')) return 'committee'
  if (d.includes('royal assent')) return 'effect'
  return 'reading'
}

async function getJSON(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.json()
}

async function resolveBillId(arg) {
  if (/^\d+$/.test(arg)) return Number(arg)
  const data = await getJSON(`${API}/Bills?SearchTerm=${encodeURIComponent(arg)}&Take=8`)
  const items = data.items || []
  if (!items.length) throw new Error(`No bills found matching "${arg}".`)
  if (items.length > 1) {
    console.log(`\nMultiple bills match "${arg}":`)
    items.forEach((b) => console.log(`  ${b.billId}\t${b.shortTitle} (${b.currentHouse})`))
    console.log(`\nUsing the first match (${items[0].billId}). Re-run with a specific billId to choose another.\n`)
  }
  return items[0].billId
}

// --- TS literal emitters -------------------------------------------------- //

function emitClaim(c, indent) {
  const pad = ' '.repeat(indent)
  const lines = [
    `{`,
    `${pad}  id: ${q(c.id)},`,
    `${pad}  text: ${q(c.text)},`,
    `${pad}  sourceTier: ${q(c.sourceTier)},`,
    `${pad}  sourceName: ${q(c.sourceName)},`,
    `${pad}  sourceUrl: ${q(c.sourceUrl)},`,
    `${pad}  asOf: ${q(c.asOf)},`,
  ]
  if (c.caveat) lines.push(`${pad}  caveat: ${q(c.caveat)},`)
  lines.push(`${pad}}`)
  return lines.join('\n')
}

function emitStage(s, indent) {
  const pad = ' '.repeat(indent)
  return [
    `{`,
    `${pad}  id: ${q(s.id)},`,
    `${pad}  label: ${q(s.label)},`,
    `${pad}  date: ${q(s.date)},`,
    `${pad}  status: ${q(s.status)},`,
    `${pad}  kind: ${q(s.kind)},`,
    `${pad}  summary: ${q(s.summary)}, // TODO: refine this neutral one-liner`,
    `${pad}  claims: [`,
    `${pad}    ${emitClaim(s.claim, indent + 4)},`,
    `${pad}    // TODO: add debate-tier claims (Hansard) for what was argued at this stage.`,
    `${pad}  ],`,
    `${pad}}`,
  ].join('\n')
}

function emitActor(a, indent) {
  const pad = ' '.repeat(indent)
  return [
    `{`,
    `${pad}  id: ${q(a.id)},`,
    `${pad}  name: ${q(a.name)},`,
    `${pad}  affiliation: ${q(a.affiliation)},`,
    `${pad}  position: ${q(a.position)},`,
    `${pad}  stance: ${q(a.stance)},`,
    `${pad}  sourceName: ${q(a.sourceName)},`,
    `${pad}  sourceUrl: ${q(a.sourceUrl)},`,
    `${pad}  sourceTier: ${q(a.sourceTier)},`,
    `${pad}  date: ${q(a.date)},`,
    `${pad}}`,
  ].join('\n')
}

// Publication types worth surfacing as sourcing references; amendment papers and
// other high-churn procedural docs are filtered out.
const DOC_KEEP = /\b(bill|explanatory notes?|impact assessment|research|briefing|memorandum|delegated powers|report|programme)\b/i
const DOC_DROP = /amendment|large print|proceedings|votes and|order of|grouping|selection|chair|\bxml\b/i

// --- Main ----------------------------------------------------------------- //

async function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Usage: npm run generate -- <billId | search term>')
    process.exit(1)
  }

  console.log(`Resolving "${arg}"…`)
  const billId = await resolveBillId(arg)
  console.log(`Fetching bill ${billId} from the UK Parliament Bills API…`)

  const [bill, stagesData] = await Promise.all([
    getJSON(`${API}/Bills/${billId}`),
    getJSON(`${API}/Bills/${billId}/Stages`),
  ])

  // Publications are optional — never let a failure here block generation.
  let publications = []
  try {
    const pubData = await getJSON(`${API}/Bills/${billId}/Publications`)
    publications = pubData.publications || pubData.items || []
  } catch {
    /* ignore — publications are a nice-to-have */
  }

  const billUrl = `https://bills.parliament.uk/bills/${billId}`
  // The Bills API exposes a session id but no session-name lookup, so the human
  // sets the label (e.g. "2024–26"); we surface the id to make that trivial.
  const introducedSessionId = bill.introducedSessionId
  const session =
    introducedSessionId != null
      ? `TODO — set session name (introduced session id ${introducedSessionId})`
      : 'TODO — set the parliamentary session'
  const idSlug = `${slugify(bill.shortTitle)}-${introducedSessionId ?? 'draft'}`

  const status = bill.currentStage
    ? `${bill.currentStage.description} (${bill.currentStage.house})${bill.isAct ? '' : ' — not yet enacted'}`
    : bill.isAct
      ? 'Enacted'
      : 'TODO — set status'

  const rawStages = (stagesData.items || []).filter(
    (s) => !SKIP_STAGES.has(String(s.description || '').toLowerCase()),
  )

  const stages = rawStages.map((s) => {
    const sittings = (s.stageSittings || []).map((x) => x.date).filter(Boolean).sort()
    const first = sittings[0]
    const last = sittings[sittings.length - 1]
    const isCurrent = bill.currentStage && s.description === bill.currentStage.description
    let stStatus = 'upcoming'
    if (isCurrent) stStatus = 'current'
    else if (last && new Date(last) <= today) stStatus = 'past'

    const date = first
      ? sittings.length > 1
        ? `${fmtDate(first)} – ${fmtDate(last)}`
        : fmtDate(first)
      : 'Not yet scheduled'

    let claimText
    if (stStatus === 'current') claimText = `As of ${RUN_DATE}, the bill is at ${s.description} in the ${s.house}.`
    else if (stStatus === 'past' && first)
      claimText =
        sittings.length > 1
          ? `The bill's ${s.description} in the ${s.house} ran from ${fmtDate(first)} to ${fmtDate(last)}.`
          : `The bill completed its ${s.description} in the ${s.house} on ${fmtDate(first)}.`
    else claimText = `${s.description} in the ${s.house} has not yet been scheduled.`

    return {
      id: slugify(s.description),
      label: s.description,
      date,
      status: stStatus,
      kind: mapKind(s.description),
      summary: `${s.description} in the ${s.house}.`,
      claim: {
        id: `${slugify(s.description)}-record`,
        text: claimText,
        sourceTier: 'statute',
        sourceName: 'UK Parliament — Bills API',
        sourceUrl: billUrl,
        asOf: first ? fmtDate(last) : RUN_DATE,
      },
    }
  })

  const skipped = (stagesData.items || []).length - rawStages.length
  const constName = `${camel(slugify(bill.shortTitle))}Draft`

  // Date the bill was introduced (1st reading) — used to date sponsor records.
  const firstReading = rawStages.find((s) => /1st reading/i.test(s.description))
  const introSit = firstReading
    ? (firstReading.stageSittings || []).map((x) => x.date).filter(Boolean).sort()[0]
    : null
  const introducedDate = introSit ? fmtDate(introSit) : RUN_DATE

  // Sponsors → actors (deterministic, factual: who sponsored the bill).
  const sponsors = (bill.sponsors || []).slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  const actors = sponsors.map((sp, i) => {
    const m = sp.member || {}
    const org = sp.organisation
    const isLead = (sp.sortOrder || i + 1) === 1
    const name = m.name ? (m.house === 'Commons' ? `${m.name} MP` : m.name) : org?.name || 'Sponsor'
    return {
      id: `actor-${slugify(name)}`,
      name,
      affiliation: org?.name || m.party || 'TODO — affiliation',
      position: isLead ? 'Introduced the bill as its lead sponsor.' : 'A sponsor of the bill.',
      stance: org ? 'government' : 'briefing',
      sourceName: 'UK Parliament — Bills API (bill sponsors)',
      sourceUrl: m.memberPage || billUrl,
      sourceTier: 'statute',
      date: introducedDate,
    }
  })

  // Key documents → a sourcing reference block in the draft header.
  const seenDocs = new Set()
  const keyDocs = publications
    .map((p) => ({
      type: (p.publicationType && p.publicationType.name) || '',
      title: p.title || '',
      url: ((p.links || [])[0] || {}).url || '',
    }))
    .filter((d) => d.url && !DOC_DROP.test(`${d.title} ${d.type}`) && DOC_KEEP.test(`${d.title} ${d.type}`))
    .filter((d) => {
      // Collapse format variants of the same document (pdf/html/large print).
      const key = d.title.toLowerCase().replace(/\s*-\s*(pdf|html|large print).*$/, '').trim()
      if (seenDocs.has(key)) return false
      seenDocs.add(key)
      return true
    })
    .slice(0, 8)

  const docsComment = keyDocs.length
    ? '\n *\n *  KEY DOCUMENTS (Bills API — authoritative sources for filling the stubs):\n' +
      keyDocs.map((d) => ` *    - ${d.type ? `[${d.type}] ` : ''}${d.title}\n *      ${d.url}`).join('\n')
    : ''

  const actorsLiteral = actors.length
    ? actors.map((a) => emitActor(a, 4)).join(',\n    ') + ','
    : `{
      id: 'actor-placeholder',
      name: 'TODO — actor name',
      affiliation: 'TODO — affiliation',
      position: 'TODO — neutrally-stated, on-record position.',
      stance: 'briefing',
      sourceName: 'TODO — source',
      sourceUrl: ${q(billUrl)},
      sourceTier: 'framing',
      date: ${q(RUN_DATE)},
    },`

  // Stub claim factory (framing tier, clearly TODO).
  const stub = (id, text) => ({
    id,
    text,
    sourceTier: 'framing',
    sourceName: 'TODO — attribute to a named source',
    sourceUrl: billUrl,
    asOf: RUN_DATE,
  })

  const out = `import type { Bill } from '../types'

/*
 * ============================================================================
 *  AUTO-GENERATED DRAFT — DO NOT PUBLISH OR WIRE INTO App.tsx AS-IS.
 * ============================================================================
 *  Generated ${RUN_DATE} from the UK Parliament Bills API.
 *  Source: ${billUrl}
 *  Bill last updated (per API): ${bill.lastUpdate ? bill.lastUpdate.slice(0, 10) : 'n/a'}
 *
 *  WHAT IS REAL: the bill metadata, the \`stages\` timeline, and the sponsor
 *  \`actors\` below are pulled from structured Bills API data and are safe.${skipped ? `\n *  (${skipped} procedural stage(s) were filtered out — re-add if wanted.)` : ''}${docsComment}
 *
 *  WHAT YOU MUST DO BEFORE PUBLISHING (the human review = the neutrality gate):
 *    1. summary               — write a neutral standfirst.
 *    2. governmentRationale   — restate the on-record government justification + source.
 *    3. context               — add sourced scale figures (Electoral Commission etc.).
 *    4. routes                — add the money routes + what the bill does to each.
 *    5. loophole              — build the attributed anatomy (or remove if N/A).
 *    6. actors                — add named on-record positions (Hansard / Votes API).
 *    7. EVERY claim           — verify text + source; set the correct sourceTier.
 *    8. caveats               — add the no-wrongdoing caveat wherever a name meets money.
 *    9. lastVerified          — set to the date a human actually checked it.
 *  Search this file for "TODO" to find every stub.
 * ============================================================================
 */

export const LAST_VERIFIED = ${q(RUN_DATE)} // REVIEW: set only after human verification

export const ${constName}: Bill = {
  id: ${q(idSlug)},
  title: ${q(bill.shortTitle)},
  shortTitle: ${q(bill.shortTitle)},
  session: ${q(session)},
  status: ${q(status)},
  lastVerified: LAST_VERIFIED,
  // TODO: rewrite as a neutral, plain-English standfirst (this is the API summary/long title).
  summary: ${q(bill.summary || bill.longTitle || 'TODO — write a neutral standfirst describing the bill.')},

  // TODO: restate the government's on-record rationale and attribute it.
  governmentRationale: ${emitClaim(stub('gov-rationale', 'TODO — what the government says the bill is for.'), 2)},

  stages: [
    ${stages.map((s) => emitStage(s, 4)).join(',\n    ')},
  ],

  // TODO: add sourced scale figures. Placeholder kept so the file is renderable.
  context: [
    {
      id: 'ctx-placeholder',
      value: '—',
      label: 'TODO — add a sourced scale figure',
      claim: ${emitClaim(stub('ctx-placeholder-claim', 'TODO — a sourced statistic relevant to this bill.'), 6)},
    },
  ],

  // TODO: map the money routes and what this bill does to each (closed/narrowed/open).
  routes: [
    {
      id: 'route-placeholder',
      label: 'TODO — route label',
      from: 'TODO — source',
      to: 'UK political parties',
      status: 'open',
      note: 'TODO — neutral note on what the bill does to this route.',
      claim: ${emitClaim(stub('route-placeholder-claim', 'TODO — sourced claim backing this route.'), 6)},
    },
  ],

  // TODO: build the attributed loophole anatomy, or delete this view for bills with no such hook.
  loophole: {
    intro: ${emitClaim(stub('loophole-intro', 'TODO — framing intro, attributed to an investigator.'), 4)},
    steps: [
      {
        id: 'step-placeholder',
        diagramFocus: 'ubo',
        title: 'TODO — step title',
        body: 'TODO — neutral, structural description of this step.',
        attribution: ${emitClaim(stub('step-placeholder-claim', 'TODO — attributed finding for this step.'), 8)},
      },
    ],
    closingQuestion: 'TODO — the neutral question the bill raises.',
  },

  // Sponsors auto-populated from the Bills API.
  // TODO: add debate positions (Hansard) and how members voted (Votes API),
  // each with the correct source tier; add a no-wrongdoing caveat where needed.
  actors: [
    ${actorsLiteral}
  ],
}
`

  const here = dirname(fileURLToPath(import.meta.url))
  const outDir = join(here, '..', 'src', 'data', 'generated')
  mkdirSync(outDir, { recursive: true })
  const fileName = `${slugify(bill.shortTitle)}.draft.ts`
  const outPath = join(outDir, fileName)
  writeFileSync(outPath, out, 'utf8')

  console.log(`\n✓ Wrote draft: src/data/generated/${fileName}`)
  console.log(`  Bill:    ${bill.shortTitle}`)
  console.log(`  Session: ${session}`)
  console.log(`  Status:  ${status}`)
  console.log(`  Stages:  ${stages.length} populated${skipped ? ` (${skipped} procedural filtered)` : ''}`)
  console.log(`\nNext: open the file, fill every // TODO (esp. routes, loophole, actors),`)
  console.log(`verify each claim against its source, then import it into App.tsx.\n`)
}

main().catch((err) => {
  console.error(`\n✗ Generation failed: ${err.message}\n`)
  process.exit(1)
})
