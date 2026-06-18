/**
 * Factcheque data model.
 *
 * The organising principle is **the bill as the unit**. A `Bill` is the spine;
 * every view (timeline, money-flow, loophole explainer, positions tracker) reads
 * generically from a single `Bill` object. Adding a second case file means adding
 * a new data file that conforms to these interfaces — not new components.
 *
 * Every on-screen factual claim is modelled as a `Claim`, which carries its own
 * source, source tier and `asOf` date. This is what makes neutrality and
 * attribution structural rather than editorial discipline: a claim cannot be
 * rendered without its source.
 *
 * These interfaces are also the target shape for a future ingestion layer
 * (UK Parliament Bills API, Electoral Commission data, Companies House). See
 * `./ingestion/README.md`.
 */

/**
 * Fact tier — drives the source-tier badge colour and lets the reader
 * distinguish the *kind* of authority behind a claim at a glance.
 *
 *  - `statute`  Statute or official record (legislation text, Electoral Commission register).
 *  - `debate`   Parliamentary debate (Hansard, a named member's on-record remarks).
 *  - `ngo`      NGO / investigative finding (Transparency International, Democracy for Sale, ERS).
 *  - `framing`  Factcheque's own neutral framing — never a new factual claim, only synthesis.
 */
export type SourceTier = 'statute' | 'debate' | 'ngo' | 'framing'

/** A single sourced claim. Nothing factual is shown to the reader without one. */
export interface Claim {
  id: string
  /** The claim, stated as a restatement of an on-record finding. Never an allegation. */
  text: string
  sourceTier: SourceTier
  sourceName: string
  sourceUrl: string
  /** Human-readable "as of" marker — this bill is live, so every claim is date-stamped. */
  asOf: string
  /**
   * The "no suggestion of wrongdoing" caveat, attached wherever an individual or
   * company is named in connection with money. Rendered verbatim next to the claim.
   */
  caveat?: string
}

/** Where a claim sits in time relative to the present parliamentary moment. */
export type StageStatus = 'past' | 'current' | 'upcoming'

/** The kind of node in the legislative journey — drives the timeline marker. */
export type StageKind =
  | 'trigger'
  | 'introduction'
  | 'reading'
  | 'committee'
  | 'effect'

/** One node in the "how we got here" timeline. */
export interface Stage {
  id: string
  /** Short label for the timeline node, e.g. "Second reading". */
  label: string
  /** Display date for the node, e.g. "Nov 2025". */
  date: string
  status: StageStatus
  kind: StageKind
  /** Factcheque's neutral one-line summary of the node. */
  summary: string
  /** The sourced detail revealed when the node is selected. */
  claims: Claim[]
}

/** An actor's on-record position — neutral, just who said what. */
export type ActorStance =
  | 'government' // the government line
  | 'stronger-safeguards' // argued for a stronger test than the government proposed
  | 'welcome-with-caveat' // welcomed measures but flagged a residual gap
  | 'briefing' // an official/neutral briefing or review, no position taken

export interface Actor {
  id: string
  name: string
  affiliation: string
  /** The position, stated neutrally as a restatement of the actor's on-record words. */
  position: string
  stance: ActorStance
  sourceName: string
  sourceUrl: string
  sourceTier: SourceTier
  date: string
}

/** A route money can take into UK politics, and what this bill does to it. */
export type RouteStatus = 'closed' | 'narrowed' | 'open'

export interface MoneyRoute {
  id: string
  label: string
  /** Source node label for the Sankey, e.g. "Foreign-owned UK company". */
  from: string
  /** Destination node label for the Sankey, e.g. "UK political parties". */
  to: string
  status: RouteStatus
  /** Optional weight for the Sankey link. Only set where a sourced figure exists. */
  amount?: number
  /** Human label for the amount, e.g. "£242m (2001–Q4 2025, cumulative)". */
  amountLabel?: string
  /** Neutral note on what the bill does to this route. */
  note: string
  /** The sourced claim backing the route's status and figure. */
  claim: Claim
}

/** One step in the scrollytelling anatomy of the open route. */
export interface LoopholeStep {
  id: string
  /** Which abstract structural element this step highlights in the diagram. */
  diagramFocus: 'ubo' | 'company' | 'donation' | 'question'
  title: string
  body: string
  /** Attribution claim, where the step restates an investigator's documented finding. */
  attribution?: Claim
}

export interface Loophole {
  /** The framing intro for the explainer. */
  intro: Claim
  steps: LoopholeStep[]
  /** The neutral question the bill raises, on which the explainer ends. */
  closingQuestion: string
}

/** A pointer to a prior case file — a "previous chapter", not built out in v1. */
export interface ChapterLink {
  title: string
  summary: string
  claim: Claim
}

/** A headline scale/context figure for the data layer. */
export interface ContextFigure {
  id: string
  /** Large display value, e.g. "£242m". */
  value: string
  /** Short label, e.g. "company donations, 2001–Q4 2025". */
  label: string
  claim: Claim
}

/** The unit. Everything else hangs off this. */
export interface Bill {
  id: string
  title: string
  shortTitle: string
  /** Parliamentary session, e.g. "2024–26". */
  session: string
  /** Current parliamentary stage, shown in the verified banner. */
  status: string
  /** Single date the whole case file was last checked against sources. */
  lastVerified: string
  /** Factcheque's neutral standfirst describing the bill. */
  summary: string
  /** One-line statement of what the government says the bill is for (sourced). */
  governmentRationale: Claim
  stages: Stage[]
  context: ContextFigure[]
  routes: MoneyRoute[]
  loophole: Loophole
  actors: Actor[]
  previousChapter?: ChapterLink
}
