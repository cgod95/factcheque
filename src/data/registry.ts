import type { Bill } from './types'
import { representationOfThePeopleBill } from './representation-of-the-people-bill'

/**
 * The library registry. Two tiers:
 *  - `deepCaseFiles`: fully-investigated, hand-built case files (route into the app).
 *  - `monitoring`: bills the nightly monitor surfaces but that have no deep dive yet
 *    (link out to Parliament). Real, current bills only — no stale padding.
 *
 * Adding a deep case file = a new `Bill` data file + one entry here.
 */

export interface DeepEntry {
  tier: 'deep'
  bill: Bill
  topics: string[]
  blurb: string
}

export interface StubEntry {
  tier: 'stub'
  id: string // UK Parliament bill id
  title: string
  status: string
  updated: string
  topics: string[]
  url: string
}

export interface Thread {
  name: string
  blurb: string
}

export const deepCaseFiles: DeepEntry[] = [
  {
    tier: 'deep',
    bill: representationOfThePeopleBill,
    topics: ['Political finance', 'Foreign influence'],
    blurb:
      'How money and foreign influence shape the UK’s political-donation rules — the routes the bill closes, narrows, and leaves open.',
  },
]

/**
 * Recurring structural routes that cut across bills — built once, they connect
 * every case file. Drawn from the case files' own content.
 */
export const threads: Thread[] = [
  { name: 'Foreign influence', blurb: 'Routes by which overseas money can reach UK parties.' },
  { name: 'Company donations', blurb: 'The £242m companies have given since 2001 — and the test for who counts as a UK donor.' },
  { name: 'Unincorporated associations', blurb: 'The donor type that need not check where its own money comes from.' },
  { name: 'Overseas donors', blurb: 'British citizens abroad as a permissible — now capped — source.' },
  { name: 'Cryptocurrency', blurb: 'The donation channel the bill moves to ban.' },
]

/**
 * "Also before Parliament" — surfaced by the monitor (UK Parliament Bills API),
 * verified current (lastUpdate within the last few months), not yet deep-dived.
 */
export const monitoring: StubEntry[] = [
  {
    tier: 'stub',
    id: '3951',
    title: 'Food Products (Market Regulation and Public Procurement) Bill',
    status: '2nd reading (Commons)',
    updated: 'May 2026',
    topics: ['Public procurement'],
    url: 'https://bills.parliament.uk/bills/3951',
  },
]

export const caseFileTopics = Array.from(new Set(deepCaseFiles.flatMap((d) => d.topics)))
