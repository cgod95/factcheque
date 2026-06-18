import type { Bill } from './types'

/**
 * Factcheque v1 case file: the Representation of the People Bill (2024–26).
 *
 * EDITORIAL RULES OBSERVED IN THIS FILE
 * -------------------------------------
 *  1. Every `Claim` is a restatement of an on-record finding by a named source.
 *     No claim asserts a causal link between a donation and a vote.
 *  2. Wherever an individual or company is named in connection with money, the
 *     `caveat` field carries the "no suggestion of wrongdoing / matter of public
 *     record" note, unless a court or regulator has made a contrary finding.
 *  3. Specific named-individual cases are attributed to their investigator
 *     ("Democracy for Sale identified…"), never restated in Factcheque's voice.
 *  4. Everything is date-stamped. The bill is live; time-sensitive facts cite the
 *     source they were verified against and the date (asOf / lastVerified).
 *
 * VERIFICATION NOTE (16 June 2026)
 * --------------------------------
 *  Every claim in this file has been checked against a primary or named source
 *  (no `// REVIEW:` flags remain). Key points confirmed in this pass:
 *    - Chronology: Rycroft Review published 25 March 2026 (AFTER second reading);
 *      the £100k overseas cap and crypto-donation ban are the government's response
 *      to it, not original provisions. (Bills API; ITV; Byline Times.)
 *    - Nathan Gill: sentenced 21 Nov 2025, Old Bailey, 8 counts of bribery. (BBC.)
 *    - Reform donor: Christopher Harborne, ~£12m, per Electoral Commission records.
 *      (British Brief; matter of public record, no suggestion of wrongdoing.)
 *    - Profit vs revenue test: CSPL "Regulating Election Finance" (7 Jul 2021) and
 *      the Electoral Commission back a profit test; named MPs reframed to their
 *      actual Hansard contributions (2 Mar 2026); committee amendments by Yuan Yang.
 *  The bill is broad (it also lowers the voting age to 16 and reforms registration);
 *  this case file treats only its political-donation provisions.
 */

/**
 * Single source of truth for the date the whole case file was last checked.
 * Drives the site-wide verified banner.
 */
export const LAST_VERIFIED = '16 June 2026'

const NO_WRONGDOING =
  'A matter of public record. There is no suggestion of wrongdoing by any donor or company named here; no court or regulator has made a contrary finding.'

// --- Source shorthands (kept here so a URL change is a one-line edit) -------
const SRC = {
  commonsCompanyDonations: {
    name: 'House of Commons Library — “Company donations in UK politics” (CBP-10599)',
    url: 'https://commonslibrary.parliament.uk/research-briefings/cbp-10599/',
  },
  commonsForeignDonations: {
    name: 'House of Commons Library — “Foreign political donations in the UK”',
    url: 'https://commonslibrary.parliament.uk/foreign-political-donations-in-the-uk/',
  },
  commonsProgress: {
    name: 'House of Commons Library — “Representation of the People Bill: progress of the bill” (CBP-10876)',
    url: 'https://commonslibrary.parliament.uk/research-briefings/cbp-10876/',
  },
  billsApi: {
    name: 'UK Parliament — Representation of the People Bill (Bill 4080)',
    url: 'https://bills.parliament.uk/bills/4080',
  },
  parallel: {
    name: 'ParallelParliament — Representation of the People Bill 2024-26 (stages & amendments)',
    url: 'https://www.parallelparliament.co.uk/bills/2024-26/representationofthepeople',
  },
  pbs: {
    name: 'PBS News',
    url: 'https://www.pbs.org/newshour/world/uk-bans-crypto-donations-to-political-parties-in-bid-to-curb-foreign-influence',
  },
  itv: {
    name: 'ITV News — PM announces pause on crypto donations (25 Mar 2026)',
    url: 'https://www.itv.com/news/2026-03-25/government-will-pause-crypto-donations-to-stop-foreign-interference-in-elections',
  },
  ers: {
    name: 'Electoral Reform Society',
    url: 'https://electoral-reform.org.uk/government-to-cap-overseas-donations-and-stop-crypto-donations/',
  },
  ersLoophole: {
    name: 'Electoral Reform Society — “A dangerous loophole in our political financing rules”',
    url: 'https://electoral-reform.org.uk/there-is-a-dangerous-loophole-in-our-political-financing-rules/',
  },
  tiuk: {
    name: 'Transparency International UK — response to the Rycroft Review',
    url: 'https://www.transparency.org.uk/news/rycroft-review-government-right-act-fast-cap-all-political-donations-needed',
  },
  ecRycroft: {
    name: 'Electoral Commission — Rycroft Review response',
    url: 'https://www.electoralcommission.org.uk/media-centre/electoral-commission-rycroft-review-response',
  },
  dfs: {
    name: 'Democracy for Sale',
    url: 'https://democracyforsale.substack.com/p/revealed-how-foreign-billionaires-funding-british-politics-musk-trump',
  },
  spotlight: {
    name: 'Spotlight on Corruption',
    url: 'https://www.spotlightcorruption.org/foreign-donors-political-finance/',
  },
  gill: {
    name: 'BBC News — “Former Welsh Reform leader jailed for pro-Russia bribery” (21 Nov 2025)',
    url: 'https://www.bbc.co.uk/news/articles/c5yd878ejqko',
  },
  byline: {
    name: 'Byline Times — government to ban crypto donations (25 Mar 2026)',
    url: 'https://bylinetimes.com/2026/03/25/blow-to-nigel-farage-after-government-bans-crypto-donations-in-urgent-crackdown-on-foreign-political-interference/',
  },
  britBrief: {
    name: 'British Brief — Reform UK offshore-linked donations (citing Electoral Commission records)',
    url: 'https://britbrief.co.uk/politics/donations/reform-uk-got-15m-from-offshore-linked-donors-in-2025.html',
  },
  hansard2R: {
    name: 'Hansard (via TheyWorkForYou) — Representation of the People Bill, second-reading debate (2 Mar 2026)',
    url: 'https://www.theyworkforyou.com/debates/?id=2026-03-02f.624.0',
  },
  ecBriefing: {
    name: 'Electoral Commission — parliamentary briefing on the bill (Part 4: control of political donations)',
    url: 'https://www.electoralcommission.org.uk/news-and-views/our-work-uk-parliament/parliamentary-briefings/parliamentary-briefing-representation-people-bill-part-4-campaigns-and-political-expenditure-control',
  },
} as const

export const representationOfThePeopleBill: Bill = {
  id: 'representation-of-the-people-bill-2024-26',
  title: 'Representation of the People Bill',
  shortTitle: 'Representation of the People Bill',
  session: '2024–26',
  // Verified against the UK Parliament Bills API (bills.parliament.uk/bills/4080):
  // introduced 12 Feb 2026, 2R 2 Mar, committee 18 Mar–16 Apr, reintroduced 14 May,
  // now at report stage with no further sitting scheduled (API last update 16 Jun 2026).
  // Re-run `npm run generate -- 4080` to refresh if the stage moves.
  status: 'Report stage (Commons) — no further stage currently scheduled',
  lastVerified: LAST_VERIFIED,
  summary:
    'A live UK bill with several strands; this case file follows only its political-donation provisions. On donations the government frames the bill as a response to the risk of illicit and foreign money entering British politics: it tightens checks on company and association donors, and — following the Rycroft Review — adds a cap on donations from overseas voters and a ban on cryptocurrency donations. Debate has centred on whether the test for a company’s “legitimate UK connection” (the bill uses a revenue test) is strong enough to close the route investigators have documented.',

  governmentRationale: {
    id: 'gov-rationale',
    text: 'At second reading the Secretary of State justified the donation reforms on the grounds that illicit finance damages trust in politics, stating that the government wants stronger checks on significant donations, more transparency from donors, and to ensure that only companies with a legitimate UK connection can donate.',
    sourceTier: 'debate',
    sourceName: SRC.commonsCompanyDonations.name,
    sourceUrl: SRC.commonsCompanyDonations.url,
    asOf: '2 March 2026', // second reading
  },

  // ----------------------------------------------------------------------- //
  //  TIMELINE — how we got here                                             //
  // ----------------------------------------------------------------------- //
  stages: [
    {
      id: 'trigger',
      label: 'Why now',
      date: 'Nov 2025',
      status: 'past',
      kind: 'trigger',
      summary:
        'Concern about foreign money in UK politics intensified after a bribery conviction touching a political party, which prompted an official review.',
      claims: [
        {
          id: 'trigger-gill',
          text: 'On 21 November 2025, Nathan Gill — former leader of Reform UK in Wales — was sentenced at the Old Bailey to ten and a half years after pleading guilty to eight counts of bribery, for taking payments to make pro-Russia statements as an MEP. His was reported as the first such conviction of a British politician and prompted scrutiny of foreign financial influence.',
          sourceTier: 'statute',
          sourceName: SRC.gill.name,
          sourceUrl: SRC.gill.url,
          asOf: '21 November 2025',
        },
        {
          id: 'trigger-reform-donation',
          text: 'In the same period, Electoral Commission records showed Reform UK had received around £12 million from Thailand-based British businessman Christopher Harborne — including a single £9 million donation reported as the largest by a living person to a UK party. Around 80% of the £18.6m the party received in 2025 came from donors with offshore connections.',
          sourceTier: 'statute',
          sourceName: SRC.britBrief.name,
          sourceUrl: SRC.britBrief.url,
          asOf: '2025',
          caveat: NO_WRONGDOING,
        },
      ],
    },
    {
      id: 'introduction',
      label: 'Introduced',
      date: '12 Feb 2026',
      status: 'past',
      kind: 'introduction',
      summary:
        'The Representation of the People Bill was introduced in the Commons. Its donation strand tightens checks on company and unincorporated-association donors.',
      claims: [
        {
          id: 'intro-date',
          text: 'The Representation of the People Bill was introduced in the House of Commons on 12 February 2026.',
          sourceTier: 'statute',
          sourceName: SRC.billsApi.name,
          sourceUrl: SRC.billsApi.url,
          asOf: '12 February 2026',
        },
        {
          id: 'intro-ua',
          text: 'On donations, the bill implements Committee on Standards in Public Life recommendations on unincorporated associations, requiring them to conduct the same checks on donations as political parties.',
          sourceTier: 'statute',
          sourceName: SRC.commonsCompanyDonations.name,
          sourceUrl: SRC.commonsCompanyDonations.url,
          asOf: 'February 2026',
        },
      ],
    },
    {
      id: 'second-reading',
      label: 'Second reading',
      date: '2 Mar 2026',
      status: 'past',
      kind: 'reading',
      summary:
        'The Commons debated the bill. On donations, the dispute was the test for a company’s eligibility to donate: the government’s revenue test versus a stronger profit test.',
      claims: [
        {
          id: 'reading-date',
          text: 'The bill received its second reading on 2 March 2026.',
          sourceTier: 'statute',
          sourceName: SRC.billsApi.name,
          sourceUrl: SRC.billsApi.url,
          asOf: '2 March 2026',
        },
        {
          id: 'reading-test',
          text: 'The bill uses a “revenue test” for company-donor eligibility. The Committee on Standards in Public Life and the Electoral Commission have argued a “profit test” — capping donations at UK post-tax profits over the preceding two years — would better guard against foreign money; the Commission called the revenue test “deeply flawed”.',
          sourceTier: 'statute',
          sourceName: SRC.ecBriefing.name,
          sourceUrl: SRC.ecBriefing.url,
          asOf: '2026',
        },
        {
          id: 'reading-mps',
          text: 'In the second-reading debate, MPs including Valerie Vaz (Lab) and Lisa Smart (Lib Dem, Hazel Grove) argued that company donations should be based on a company’s profits rather than its revenue.',
          sourceTier: 'debate',
          sourceName: SRC.hansard2R.name,
          sourceUrl: SRC.hansard2R.url,
          asOf: '2 March 2026',
        },
      ],
    },
    {
      id: 'rycroft',
      label: 'Rycroft Review',
      date: '25 Mar 2026',
      status: 'past',
      kind: 'introduction',
      summary:
        'An independent review into foreign financial influence reported. The government responded by adding a £100k overseas-donor cap and a cryptocurrency-donation ban.',
      claims: [
        {
          id: 'rycroft-publication',
          text: 'The Rycroft Review — the independent review into countering foreign financial influence and interference in UK politics, led by former senior civil servant Philip Rycroft — was published on 25 March 2026 and made recommendations including amendments to the bill.',
          sourceTier: 'statute',
          sourceName: SRC.itv.name,
          sourceUrl: SRC.itv.url,
          asOf: '25 March 2026',
        },
        {
          id: 'rycroft-response',
          text: 'In response, the government indicated it would take forward two of the review’s recommendations: a £100,000 annual cap on political donations from overseas electors, and a ban on cryptocurrency donations to political parties.',
          sourceTier: 'statute',
          sourceName: `${SRC.itv.name} · ${SRC.ers.name}`,
          sourceUrl: SRC.ers.url,
          asOf: '25 March 2026',
        },
        {
          id: 'rycroft-profit',
          text: 'On company donations, Rycroft expressed a preference for tying donations to profit rather than revenue, recommending that corporate donations be capped at roughly two years’ post-tax profits to reduce the risk of foreign interests donating via the company route.',
          sourceTier: 'ngo',
          sourceName: SRC.commonsCompanyDonations.name,
          sourceUrl: SRC.commonsCompanyDonations.url,
          asOf: '25 March 2026',
        },
      ],
    },
    {
      id: 'current',
      label: 'Committee & report',
      date: 'Mar–May 2026',
      status: 'current',
      kind: 'committee',
      summary:
        'The bill went through committee (nine sittings) and reached report stage. Amendments to swap the revenue test for a profit test were tabled. No further stage is currently scheduled.',
      claims: [
        {
          id: 'current-committee',
          text: 'Committee stage ran over nine sittings from 18 March to 16 April 2026; the bill was reintroduced at report stage on 14 May 2026.',
          sourceTier: 'statute',
          sourceName: SRC.parallel.name,
          sourceUrl: SRC.parallel.url,
          asOf: '14 May 2026',
        },
        {
          id: 'current-amendments',
          text: 'At committee, amendments tabled by Yuan Yang MP proposed changing the eligibility test in Clause 60 from “revenue” to “profit”.',
          sourceTier: 'statute',
          sourceName: SRC.parallel.name,
          sourceUrl: SRC.parallel.url,
          asOf: 'April 2026',
        },
        {
          id: 'current-status',
          // Most time-sensitive node on the page. Confirmed against the Bills API on the
          // lastVerified date; re-run `npm run generate -- 4080` to refresh if it moves.
          text: 'As of 16 June 2026 the bill is at report stage in the Commons with no further stage currently scheduled; its provisions remain subject to amendment.',
          sourceTier: 'framing',
          sourceName: 'Factcheque — status note, confirmed against the UK Parliament Bills API',
          sourceUrl: SRC.billsApi.url,
          asOf: '16 June 2026',
        },
      ],
    },
    {
      id: 'effect',
      label: 'What it would change',
      date: 'If enacted',
      status: 'upcoming',
      kind: 'effect',
      summary:
        'If enacted with the government’s response, the donation strand closes one route, narrows several others, and leaves the central question — how to test a company’s UK connection — unresolved.',
      claims: [
        {
          id: 'effect-closes',
          text: 'It would close the cryptocurrency route by banning crypto donations, and narrow the overseas-voter route with a £100,000 annual cap.',
          sourceTier: 'statute',
          sourceName: `${SRC.itv.name} · ${SRC.ers.name}`,
          sourceUrl: SRC.ers.url,
          asOf: 'March 2026',
        },
        {
          id: 'effect-company',
          text: 'It would tighten company and unincorporated-association donations, requiring a “legitimate UK connection”; whether the revenue test in the bill is sufficient, or a profit test is needed, was the central point of debate.',
          sourceTier: 'debate',
          sourceName: SRC.commonsCompanyDonations.name,
          sourceUrl: SRC.commonsCompanyDonations.url,
          asOf: 'May 2026',
        },
      ],
    },
  ],

  // ----------------------------------------------------------------------- //
  //  CONTEXT — scale figures for the data layer                             //
  // ----------------------------------------------------------------------- //
  context: [
    {
      id: 'ctx-242m',
      value: '£242m',
      label: 'company donations to parties, 2001–Q4 2025 (cumulative)',
      claim: {
        id: 'ctx-242m-claim',
        text: 'Electoral Commission records show that companies donated £242 million to political parties between 2001 and Q4 2025.',
        sourceTier: 'statute',
        sourceName: SRC.commonsCompanyDonations.name,
        sourceUrl: SRC.commonsCompanyDonations.url,
        asOf: 'Q4 2025',
      },
    },
    {
      id: 'ctx-41m',
      value: '£41m',
      label: 'from 18 donations of £1m+ in the year before the 2024 election — about 32% of the total',
      claim: {
        id: 'ctx-41m-claim',
        text: 'In the year before the 2024 general election, parties received 18 separate donations of £1 million or more, totalling almost £41 million — about 32% of total party donations in that period — with nearly a third coming from just nine sources.',
        sourceTier: 'ngo',
        sourceName: SRC.ers.name,
        sourceUrl: SRC.ers.url,
        asOf: '2024',
      },
    },
    {
      id: 'ctx-6m',
      value: '£6m+',
      label: 'in donations from UK companies owned by people who do not appear eligible to vote (as identified by Democracy for Sale)',
      claim: {
        id: 'ctx-6m-claim',
        text: 'A Democracy for Sale investigation identified more than £6 million in political donations from UK-registered companies owned by individuals who do not appear eligible to vote in Britain.',
        sourceTier: 'ngo',
        sourceName: SRC.dfs.name,
        sourceUrl: SRC.dfs.url,
        asOf: '2025',
        caveat: NO_WRONGDOING,
      },
    },
  ],

  // ----------------------------------------------------------------------- //
  //  MONEY ROUTES — the Sankey                                              //
  // ----------------------------------------------------------------------- //
  // Note on encoding: the diagram encodes which ROUTE money takes and what the
  // bill (with the government's Rycroft response) DOES to it (colour = status).
  // Link widths are uniform and illustrative — the sourced figures have different
  // bases (cumulative vs since-2010 vs a single investigation) and are not directly
  // comparable, so they are shown as annotations rather than as widths.
  routes: [
    {
      id: 'route-crypto',
      label: 'Cryptocurrency',
      from: 'Cryptocurrency',
      to: 'UK political parties',
      status: 'closed',
      amountLabel: 'banned (Rycroft response, Mar 2026)',
      note: 'Closed: following the Rycroft Review, the government moved to ban cryptocurrency donations to political parties.',
      claim: {
        id: 'route-crypto-claim',
        text: 'After the Rycroft Review, the government announced a ban on cryptocurrency donations to political parties.',
        sourceTier: 'statute',
        sourceName: SRC.itv.name,
        sourceUrl: SRC.itv.url,
        asOf: '25 March 2026',
      },
    },
    {
      id: 'route-overseas',
      label: 'Overseas voters',
      from: 'Overseas voters',
      to: 'UK political parties',
      status: 'narrowed',
      amountLabel: 'new £100k annual cap (Rycroft response)',
      note: 'Narrowed: a £100,000 annual cap on donations by overseas electors, taken forward by the government in response to the Rycroft Review.',
      claim: {
        id: 'route-overseas-claim',
        text: 'The government indicated it would take forward Rycroft’s recommendation of a £100,000 annual cap on political donations from overseas electors.',
        sourceTier: 'statute',
        sourceName: SRC.ers.name,
        sourceUrl: SRC.ers.url,
        asOf: '25 March 2026',
      },
    },
    {
      id: 'route-uk-company',
      label: 'UK-registered companies',
      from: 'UK-registered companies',
      to: 'UK political parties',
      status: 'narrowed',
      amount: 242,
      amountLabel: '£242m, 2001–Q4 2025 (cumulative)',
      note: 'Narrowed: stronger checks and a “legitimate UK connection” requirement for company donors. The strength of the test — revenue (in the bill) vs profit (Rycroft / committee amendments) — was the central debate.',
      claim: {
        id: 'route-uk-company-claim',
        text: 'Electoral Commission records show companies donated £242 million to parties between 2001 and Q4 2025; the bill introduces a “legitimate UK connection” test for company donors, using company revenue.',
        sourceTier: 'statute',
        sourceName: SRC.commonsCompanyDonations.name,
        sourceUrl: SRC.commonsCompanyDonations.url,
        asOf: 'Q4 2025',
      },
    },
    {
      id: 'route-ua',
      label: 'Unincorporated associations',
      from: 'Unincorporated associations',
      to: 'UK political parties',
      status: 'narrowed',
      amount: 38.6,
      amountLabel: '£38.6m via UAs since 2010 (Spotlight on Corruption)',
      note: 'Narrowed: the bill requires unincorporated associations to run the same donation checks as political parties (a CSPL recommendation). The Electoral Commission has previously noted UAs need not run permissibility checks on their own donors.',
      claim: {
        id: 'route-ua-claim',
        text: 'Spotlight on Corruption reported that £38.6 million entered UK politics via unincorporated associations since 2010; the Electoral Commission has stated such associations could legitimately donate using funds from impermissible overseas sources, as they need not run permissibility checks on their own donors. The bill requires UAs to run the same checks as parties.',
        sourceTier: 'ngo',
        sourceName: `${SRC.spotlight.name} · ${SRC.commonsForeignDonations.name}`,
        sourceUrl: SRC.spotlight.url,
        asOf: '2024',
      },
    },
    {
      id: 'route-foreign-owned',
      label: 'Foreign-owned UK company',
      from: 'Foreign-owned UK company',
      to: 'UK political parties',
      status: 'open',
      amountLabel: '£6m+ identified by Democracy for Sale',
      note: 'Left open, depending on the test adopted: a UK-registered company carrying on business in the UK can be a permissible donor even where its owner could not give directly. Whether the bill’s revenue test closes this — or Rycroft’s profit test is needed — is the unresolved question.',
      claim: {
        id: 'route-foreign-owned-claim',
        text: 'Democracy for Sale identified more than £6 million in donations from UK-registered companies owned by people who do not appear eligible to vote, and noted that, without rule changes, a foreign national could legally donate via the UK turnover of companies they control.',
        sourceTier: 'ngo',
        sourceName: SRC.dfs.name,
        sourceUrl: SRC.dfs.url,
        asOf: '2025',
        caveat: NO_WRONGDOING,
      },
    },
  ],

  // ----------------------------------------------------------------------- //
  //  LOOPHOLE EXPLAINER — the foreign-owned-company route                   //
  // ----------------------------------------------------------------------- //
  loophole: {
    intro: {
      id: 'loophole-intro',
      text: 'A Democracy for Sale investigation identified more than £6 million in political donations from UK-registered companies owned by individuals who do not appear eligible to vote in Britain, and noted that — without rule changes — a foreign national could legally donate via the UK turnover of companies they control. The anatomy below describes that route in the abstract; the specific cases and figures are Democracy for Sale’s documented findings.',
      sourceTier: 'ngo',
      sourceName: SRC.dfs.name,
      sourceUrl: SRC.dfs.url,
      asOf: '2025',
      caveat: NO_WRONGDOING,
    },
    steps: [
      {
        id: 'step-ubo',
        diagramFocus: 'ubo',
        title: 'The owner',
        body: 'An individual who is not eligible to vote in the UK — for example, a foreign national living abroad — is not a “permissible donor” and cannot give to a UK party in their own name.',
        attribution: {
          id: 'step-ubo-claim',
          text: 'Permissible donors are, broadly, UK-registered electors and UK-registered companies carrying on business in the UK; individuals not on a UK electoral register are not permissible donors.',
          sourceTier: 'statute',
          sourceName: SRC.commonsForeignDonations.name,
          sourceUrl: SRC.commonsForeignDonations.url,
          asOf: '2024',
        },
      },
      {
        id: 'step-company',
        diagramFocus: 'company',
        title: 'The vehicle',
        body: 'That same person may, however, control a company that is registered in the UK and carrying on business here. Such a company is itself a permissible donor — the eligibility attaches to the company, not to who owns it.',
        attribution: {
          id: 'step-company-claim',
          text: 'A company registered in the UK and carrying on business in the UK is a permissible donor under existing rules, irrespective of the nationality or residence of its ultimate owner.',
          sourceTier: 'statute',
          sourceName: SRC.commonsCompanyDonations.name,
          sourceUrl: SRC.commonsCompanyDonations.url,
          asOf: '2025',
        },
      },
      {
        id: 'step-donation',
        diagramFocus: 'donation',
        title: 'The donation',
        body: 'The company can then donate to a party as a permissible UK source. The money is the company’s — but the route lets funds connected to an owner who could not give directly reach a party lawfully.',
        attribution: {
          id: 'step-donation-claim',
          text: 'Democracy for Sale reported that, without rule changes, a foreign national could legally donate via the UK turnover of companies they control.',
          sourceTier: 'ngo',
          sourceName: SRC.dfs.name,
          sourceUrl: SRC.dfs.url,
          asOf: '2025',
          caveat: NO_WRONGDOING,
        },
      },
      {
        id: 'step-scale',
        diagramFocus: 'donation',
        title: 'What was identified',
        body: 'Reviewing donation records, Democracy for Sale identified more than £6 million given through this route by UK companies owned by people who do not appear eligible to vote. These are Democracy for Sale’s findings, presented here as reported.',
        attribution: {
          id: 'step-scale-claim',
          text: 'Democracy for Sale identified more than £6 million in political donations from UK-registered companies owned by individuals who do not appear eligible to vote in Britain.',
          sourceTier: 'ngo',
          sourceName: SRC.dfs.name,
          sourceUrl: SRC.dfs.url,
          asOf: '2025',
          caveat: NO_WRONGDOING,
        },
      },
      {
        id: 'step-question',
        diagramFocus: 'question',
        title: 'The open question',
        body: 'The bill tests a company’s “legitimate UK connection” by revenue. The Rycroft Review preferred profit — recommending corporate donations be capped at about two years’ post-tax profits — and amendments at committee sought to swap “revenue” for “profit” in Clause 60. Which test best distinguishes a genuine UK business from a conduit is the question Parliament must settle.',
        attribution: {
          id: 'step-question-claim',
          text: 'The Rycroft Review expressed a preference for tying donations to profit rather than revenue; at committee, amendments tabled by Yuan Yang MP sought to change the Clause 60 test from “revenue” to “profit”.',
          sourceTier: 'statute',
          sourceName: `${SRC.commonsCompanyDonations.name} · ${SRC.parallel.name}`,
          sourceUrl: SRC.parallel.url,
          asOf: 'April 2026',
        },
      },
    ],
    closingQuestion:
      'Does a revenue test — eligibility based on UK turnover — adequately distinguish a genuine UK business from a vehicle for overseas money, or is Rycroft’s profit test the firmer line? The bill’s drafting leaves the answer to Parliament.',
  },

  // ----------------------------------------------------------------------- //
  //  POSITIONS TRACKER — who said what                                      //
  // ----------------------------------------------------------------------- //
  actors: [
    {
      id: 'actor-government',
      name: 'UK Government',
      affiliation: 'HM Government',
      position:
        'Justified the donation reforms on the grounds that illicit finance damages trust in politics; wants stronger checks on significant donations, more transparency from donors, and to ensure only companies with a legitimate UK connection can donate. After Rycroft, moved to add a £100k overseas-donor cap and a crypto-donation ban.',
      stance: 'government',
      sourceName: SRC.commonsCompanyDonations.name,
      sourceUrl: SRC.commonsCompanyDonations.url,
      sourceTier: 'debate',
      date: 'March 2026',
    },
    {
      id: 'actor-steve-reed',
      name: 'Steve Reed MP',
      affiliation: 'Communities Secretary (Government)',
      position:
        'Announcing the response to the Rycroft Review, told the Commons he was “not prepared to allow any window of opportunity in which malign actors based overseas can funnel dark money into our politics”, and that the overseas-donation cap would apply retrospectively from that date.',
      stance: 'government',
      sourceName: SRC.byline.name,
      sourceUrl: SRC.byline.url,
      sourceTier: 'debate',
      date: '25 March 2026',
    },
    {
      id: 'actor-rycroft',
      name: 'Philip Rycroft',
      affiliation: 'Independent review (former senior civil servant)',
      position:
        'Led the independent review into countering foreign financial influence and interference in UK politics (published 25 March 2026). Preferred tying corporate donations to profit, recommending a cap at about two years’ post-tax profits to reduce the risk of donations via the company route.',
      stance: 'briefing',
      sourceName: SRC.itv.name,
      sourceUrl: SRC.itv.url,
      sourceTier: 'statute',
      date: '25 March 2026',
    },
    {
      id: 'actor-yuan-yang',
      name: 'Yuan Yang MP',
      affiliation: 'Labour',
      position:
        'Tabled committee amendments to change the eligibility test in Clause 60 from “revenue” to “profit”, aligning the bill with the profit test.',
      stance: 'stronger-safeguards',
      sourceName: SRC.parallel.name,
      sourceUrl: SRC.parallel.url,
      sourceTier: 'statute',
      date: 'April 2026',
    },
    {
      id: 'actor-western',
      name: 'Matt Western MP',
      affiliation: 'Labour',
      position:
        'As chair of the Joint Committee on the National Security Strategy, raised concerns that cryptocurrency could enable foreign donations and that campaign spending outside election periods lacks scrutiny.',
      stance: 'stronger-safeguards',
      sourceName: SRC.hansard2R.name,
      sourceUrl: SRC.hansard2R.url,
      sourceTier: 'debate',
      date: '2 March 2026',
    },
    {
      id: 'actor-vaz',
      name: 'Valerie Vaz MP',
      affiliation: 'Labour',
      position:
        'Argued in the second-reading debate that company donations should be based on a company’s profits, not just on its revenue.',
      stance: 'stronger-safeguards',
      sourceName: SRC.hansard2R.name,
      sourceUrl: SRC.hansard2R.url,
      sourceTier: 'debate',
      date: '2 March 2026',
    },
    {
      id: 'actor-smart',
      name: 'Lisa Smart MP',
      affiliation: 'Liberal Democrat',
      position:
        'The Member for Hazel Grove argued that company donations should be based on a company’s profits, not just on its revenue.',
      stance: 'stronger-safeguards',
      sourceName: SRC.hansard2R.name,
      sourceUrl: SRC.hansard2R.url,
      sourceTier: 'debate',
      date: '2 March 2026',
    },
    {
      id: 'actor-maguire',
      name: 'Helen Maguire MP',
      affiliation: 'Liberal Democrat',
      position:
        'Liberal Democrat spokesperson listed among those backing amendments to base company-donation eligibility on profit rather than revenue.',
      stance: 'stronger-safeguards',
      sourceName: SRC.parallel.name,
      sourceUrl: SRC.parallel.url,
      sourceTier: 'statute',
      date: 'April 2026',
    },
    {
      id: 'actor-tiuk',
      name: 'Transparency International UK',
      affiliation: 'Anti-corruption NGO',
      position:
        'Responding to the Rycroft Review, said the government was right to act fast but argued a cap on all political donations is needed; warned that without one, the outsized influence of mega-donors remains.',
      stance: 'welcome-with-caveat',
      sourceName: SRC.tiuk.name,
      sourceUrl: SRC.tiuk.url,
      sourceTier: 'ngo',
      date: 'March 2026',
    },
    {
      id: 'actor-ers',
      name: 'Electoral Reform Society',
      affiliation: 'Electoral-reform NGO',
      position:
        'Welcomed the overseas-donation cap and the crypto-donation ban, noting that 18 donations of £1m+ accounted for about 32% of party donations in the year before the 2024 election.',
      stance: 'welcome-with-caveat',
      sourceName: SRC.ers.name,
      sourceUrl: SRC.ers.url,
      sourceTier: 'ngo',
      date: 'March 2026',
    },
    {
      id: 'actor-cspl',
      name: 'Committee on Standards in Public Life',
      affiliation: 'Independent advisory body',
      position:
        'In its report “Regulating Election Finance” (7 July 2021), recommended that company donations not exceed UK net profits after tax over the preceding two years, and that unincorporated associations run the same donation checks as parties — the basis for the profit-test argument.',
      stance: 'briefing',
      sourceName: SRC.commonsCompanyDonations.name,
      sourceUrl: SRC.commonsCompanyDonations.url,
      sourceTier: 'statute',
      date: 'July 2021',
    },
    {
      id: 'actor-ec',
      name: 'Electoral Commission',
      affiliation: 'Independent regulator',
      position:
        'Records that companies donated £242m to parties (2001–Q4 2025); has stated unincorporated associations could legitimately donate using funds from impermissible overseas sources, as they need not run permissibility checks on their own donors; issued a response to the Rycroft Review.',
      stance: 'briefing',
      sourceName: SRC.ecRycroft.name,
      sourceUrl: SRC.ecRycroft.url,
      sourceTier: 'statute',
      date: 'March 2026',
    },
  ],

  // ----------------------------------------------------------------------- //
  //  PREVIOUS CHAPTER — backstory pointer (not built out in v1)             //
  // ----------------------------------------------------------------------- //
  previousChapter: {
    title: 'Elections Act 2022',
    summary:
      'The 2022 Act removed the 15-year limit on overseas voting, meaning British citizens abroad remain a “permissible source” of donations indefinitely — the aperture this bill’s £100k cap partly closes.',
    claim: {
      id: 'prev-elections-act',
      text: 'In a December 2023 Lords debate, Lord Khan warned that removing the 15-year overseas-voting limit could let foreign money enter British democracy.',
      sourceTier: 'debate',
      sourceName: SRC.commonsForeignDonations.name,
      sourceUrl: SRC.commonsForeignDonations.url,
      asOf: 'December 2023',
    },
  },
}
