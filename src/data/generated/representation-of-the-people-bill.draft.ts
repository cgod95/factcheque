import type { Bill } from '../types'

/*
 * ============================================================================
 *  AUTO-GENERATED DRAFT — DO NOT PUBLISH OR WIRE INTO App.tsx AS-IS.
 * ============================================================================
 *  Generated 17 Jun 2026 from the UK Parliament Bills API.
 *  Source: https://bills.parliament.uk/bills/4080
 *  Bill last updated (per API): 2026-06-16
 *
 *  WHAT IS REAL: the bill metadata, the `stages` timeline, and the sponsor
 *  `actors` below are pulled from structured Bills API data and are safe.
 *  (3 procedural stage(s) were filtered out — re-add if wanted.)
 *
 *  KEY DOCUMENTS (Bills API — authoritative sources for filling the stubs):
 *    - [Bill] Bill 004 2026-27 (reintroduced at Report Stage) - pdf
 *      https://publications.parliament.uk/pa/bills/cbill/59-02/0004/260004.pdf
 *    - [Explanatory Notes] Bill 004 EN 2026-27 - pdf
 *      https://publications.parliament.uk/pa/bills/cbill/59-02/0004/en/260004en.pdf
 *    - [Impact Assessments] Impact assessment from the Ministry of Housing, Communities & Local Government
 *      https://publications.parliament.uk/pa/bills/cbill/59-02/0004/RoPB_updated_IA.pdf
 *    - [Delegated Powers Memorandum] Memorandum from the Ministry of Housing, Communities and Local Government to the Delegated Powers and Regulatory Reform Committee
 *      https://publications.parliament.uk/pa/bills/cbill/59-02/0004/Re_introduction_ROP_Memo.pdf
 *    - [Human rights memorandum] ECHR Memorandum For the Bill as Introduced In the House of Commons
 *      https://publications.parliament.uk/pa/bills/cbill/59-02/0004/Re_intorduction_ROP_ECHR_memo.pdf
 *    - [Bill] Bill 418 2024-26 (as amended in Committee)
 *      https://publications.parliament.uk/pa/bills/cbill/59-01/0418/240418.pdf
 *    - [Press notices] Representation of the People Bill: call for evidence
 *      https://www.parliament.uk/business/news/2026/march-2026/representation-of-the-people-bill-call-for-evidence/
 *    - [Briefing papers] Representation of the People Bill 2024-26
 *      https://commonslibrary.parliament.uk/research-briefings/cbp-10506/
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

export const LAST_VERIFIED = "17 Jun 2026" // REVIEW: set only after human verification

export const representationOfThePeopleBillDraft: Bill = {
  id: "representation-of-the-people-bill-39",
  title: "Representation of the People Bill",
  shortTitle: "Representation of the People Bill",
  session: "TODO — set session name (introduced session id 39)",
  status: "Report stage (Commons) — not yet enacted",
  lastVerified: LAST_VERIFIED,
  // TODO: rewrite as a neutral, plain-English standfirst (this is the API summary/long title).
  summary: "A Bill to make provision extending the right to vote to 16 and 17 year olds; to make provision about the registration of voters; to make provision about the administration and conduct of elections, referendums and recall petitions; to make provision about election agents’ addresses; to make provision about political expenditure and political donations; to make provision about information to be included in electronic campaigning material; to make provision about offences and civil sanctions in connection with elections, referendums and recall petitions and with donations and expenditure for political purposes; to make provision about the disclosure of information by the Electoral Commission; to make provision about the disqualification of offenders for holding elective offices, and their sentencing, where offences are aggravated by hostility towards persons involved in elections, referendums or recall petitions or holders of such offices; and for connected purposes.",

  // TODO: restate the government's on-record rationale and attribute it.
  governmentRationale: {
    id: "gov-rationale",
    text: "TODO — what the government says the bill is for.",
    sourceTier: "framing",
    sourceName: "TODO — attribute to a named source",
    sourceUrl: "https://bills.parliament.uk/bills/4080",
    asOf: "17 Jun 2026",
  },

  stages: [
    {
      id: "1st-reading",
      label: "1st reading",
      date: "12 Feb 2026",
      status: "past",
      kind: "introduction",
      summary: "1st reading in the Commons.", // TODO: refine this neutral one-liner
      claims: [
        {
          id: "1st-reading-record",
          text: "The bill completed its 1st reading in the Commons on 12 Feb 2026.",
          sourceTier: "statute",
          sourceName: "UK Parliament — Bills API",
          sourceUrl: "https://bills.parliament.uk/bills/4080",
          asOf: "12 Feb 2026",
        },
        // TODO: add debate-tier claims (Hansard) for what was argued at this stage.
      ],
    },
    {
      id: "2nd-reading",
      label: "2nd reading",
      date: "2 Mar 2026",
      status: "past",
      kind: "reading",
      summary: "2nd reading in the Commons.", // TODO: refine this neutral one-liner
      claims: [
        {
          id: "2nd-reading-record",
          text: "The bill completed its 2nd reading in the Commons on 2 Mar 2026.",
          sourceTier: "statute",
          sourceName: "UK Parliament — Bills API",
          sourceUrl: "https://bills.parliament.uk/bills/4080",
          asOf: "2 Mar 2026",
        },
        // TODO: add debate-tier claims (Hansard) for what was argued at this stage.
      ],
    },
    {
      id: "committee-stage",
      label: "Committee stage",
      date: "18 Mar 2026 – 16 Apr 2026",
      status: "past",
      kind: "committee",
      summary: "Committee stage in the Commons.", // TODO: refine this neutral one-liner
      claims: [
        {
          id: "committee-stage-record",
          text: "The bill's Committee stage in the Commons ran from 18 Mar 2026 to 16 Apr 2026.",
          sourceTier: "statute",
          sourceName: "UK Parliament — Bills API",
          sourceUrl: "https://bills.parliament.uk/bills/4080",
          asOf: "16 Apr 2026",
        },
        // TODO: add debate-tier claims (Hansard) for what was argued at this stage.
      ],
    },
    {
      id: "bill-reintroduced",
      label: "Bill reintroduced",
      date: "14 May 2026",
      status: "past",
      kind: "introduction",
      summary: "Bill reintroduced in the Commons.", // TODO: refine this neutral one-liner
      claims: [
        {
          id: "bill-reintroduced-record",
          text: "The bill completed its Bill reintroduced in the Commons on 14 May 2026.",
          sourceTier: "statute",
          sourceName: "UK Parliament — Bills API",
          sourceUrl: "https://bills.parliament.uk/bills/4080",
          asOf: "14 May 2026",
        },
        // TODO: add debate-tier claims (Hansard) for what was argued at this stage.
      ],
    },
    {
      id: "report-stage",
      label: "Report stage",
      date: "Not yet scheduled",
      status: "current",
      kind: "reading",
      summary: "Report stage in the Commons.", // TODO: refine this neutral one-liner
      claims: [
        {
          id: "report-stage-record",
          text: "As of 17 Jun 2026, the bill is at Report stage in the Commons.",
          sourceTier: "statute",
          sourceName: "UK Parliament — Bills API",
          sourceUrl: "https://bills.parliament.uk/bills/4080",
          asOf: "17 Jun 2026",
        },
        // TODO: add debate-tier claims (Hansard) for what was argued at this stage.
      ],
    },
  ],

  // TODO: add sourced scale figures. Placeholder kept so the file is renderable.
  context: [
    {
      id: 'ctx-placeholder',
      value: '—',
      label: 'TODO — add a sourced scale figure',
      claim: {
        id: "ctx-placeholder-claim",
        text: "TODO — a sourced statistic relevant to this bill.",
        sourceTier: "framing",
        sourceName: "TODO — attribute to a named source",
        sourceUrl: "https://bills.parliament.uk/bills/4080",
        asOf: "17 Jun 2026",
      },
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
      claim: {
        id: "route-placeholder-claim",
        text: "TODO — sourced claim backing this route.",
        sourceTier: "framing",
        sourceName: "TODO — attribute to a named source",
        sourceUrl: "https://bills.parliament.uk/bills/4080",
        asOf: "17 Jun 2026",
      },
    },
  ],

  // TODO: build the attributed loophole anatomy, or delete this view for bills with no such hook.
  loophole: {
    intro: {
      id: "loophole-intro",
      text: "TODO — framing intro, attributed to an investigator.",
      sourceTier: "framing",
      sourceName: "TODO — attribute to a named source",
      sourceUrl: "https://bills.parliament.uk/bills/4080",
      asOf: "17 Jun 2026",
    },
    steps: [
      {
        id: 'step-placeholder',
        diagramFocus: 'ubo',
        title: 'TODO — step title',
        body: 'TODO — neutral, structural description of this step.',
        attribution: {
          id: "step-placeholder-claim",
          text: "TODO — attributed finding for this step.",
          sourceTier: "framing",
          sourceName: "TODO — attribute to a named source",
          sourceUrl: "https://bills.parliament.uk/bills/4080",
          asOf: "17 Jun 2026",
        },
      },
    ],
    closingQuestion: 'TODO — the neutral question the bill raises.',
  },

  // Sponsors auto-populated from the Bills API.
  // TODO: add debate positions (Hansard) and how members voted (Votes API),
  // each with the correct source tier; add a no-wrongdoing caveat where needed.
  actors: [
    {
      id: "actor-steve-reed-mp",
      name: "Steve Reed MP",
      affiliation: "Ministry of Housing, Communities and Local Government",
      position: "Introduced the bill as its lead sponsor.",
      stance: "government",
      sourceName: "UK Parliament — Bills API (bill sponsors)",
      sourceUrl: "https://members.parliament.uk/member/4268/contact",
      sourceTier: "statute",
      date: "12 Feb 2026",
    },
  ],
}
