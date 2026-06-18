# Factcheque

**An interactive case file mapping money, foreign influence, and UK legislation.**

Factcheque takes a single piece of legislation as the unit and lets money and
influence radiate outward from it — backward (how it got here: triggers, debate,
the reports that shaped it), sideways (who argued what), and forward (what it does,
and what it leaves open). It is **synthesis + visualisation + attribution** of
already-public findings: not activism, not original reporting.

**v1** is one fully-realised case file: the **Representation of the People Bill
(2024–26)**, the live UK bill reforming political-donation rules.

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # type-check + production build → dist/
npm run preview  # preview the build
```

Stack: React 19 + Vite + TypeScript, Tailwind CSS v4, `d3-sankey` for the money-flow
diagram. No backend — all content is typed local data.

## Deploy

`npm run build` emits a fully static site to `dist/`. The build uses a relative base
(`base: './'`) and **hash routing**, so there are *no path-based deep links* — any
static host serving `index.html` at the root works with **no rewrite rules**.

- **Vercel / Netlify:** point at the repo (or drag `dist/` onto Netlify). Framework
  preset: Vite. Build `npm run build`, output `dist`. Done.
- **GitHub Pages:** push `dist/` to a `gh-pages` branch (or use an Actions workflow).
  The relative base means it works from `user.github.io/<repo>/` unchanged.

After deploy, two one-line polish items (see the note in `index.html`): set `og:url`
to the live URL, and rasterise `public/og-image.svg` to a 1200×630 PNG for the best
social-card support across all platforms.

## The four views

All four are views *of the bill* and share one underlying `Bill` object.

1. **How we got here** — the legislative journey as a horizontal timeline (trigger →
   announcement → second reading → current stage → effect). Each node expands to its
   sourced detail.
2. **Money flows** — a Sankey of the routes money can take into UK parties, colour-coded
   by whether the bill **closes**, **narrows**, or leaves each route **open**.
3. **The open loophole** — a scrollytelling anatomy of the foreign-owned-UK-company
   route, framed entirely as Democracy for Sale documented it.
4. **Positions** — a sortable, filterable register of named actors' on-record positions.

## Editorial rules (these govern every line of content)

These are enforced *structurally*, not just by discipline — the data model makes it
hard to break them:

1. **Neutrality by construction.** Every factual statement is a `Claim`: a restatement
   of an on-record finding by a named source. A claim cannot render without its source.
   Nothing asserts a causal link between a donation and a vote.
2. **No suggestion of wrongdoing.** Wherever an individual or company is named in
   connection with money, a `caveat` field carries the "matter of public record / no
   suggestion of wrongdoing" note — unless a court or regulator has found otherwise.
3. **Attribute, don't allege.** Specific named-individual cases are presented as
   *"[Source] identified…"* and linked, never restated in Factcheque's voice.
4. **Date-stamp everything.** A single `LAST_VERIFIED` constant drives the banner, and
   every `Claim` carries its own `asOf`. The bill is live.
5. **Distinguish fact tiers.** Four tiers — `statute` (official record), `debate`
   (Hansard), `ngo` (investigative finding), `framing` (Factcheque's own synthesis) —
   each shown by a colour-coded `<SourceBadge>`.
6. **No defamation exposure.** Where a claim would require asserting that a named person
   did something wrong, it is not made; a `// REVIEW:` comment is left instead.

Open `src/data/representation-of-the-people-bill.ts` and search for `// REVIEW:` to see
the time-sensitive facts flagged for re-confirmation against primary sources.

## Architecture

```
src/
  data/
    types.ts                              # the data model — the contract
    representation-of-the-people-bill.ts  # v1 content (the only content file)
    ingestion/README.md                   # design stub for a future API-fed layer
  components/
    SourceBadge.tsx     # used everywhere a claim appears
    ClaimCard.tsx       # a claim + its mandatory source badge
    VerifiedBanner.tsx  # the site-wide "verified as of" notice
    CaseFile.tsx        # the layout — reads generically from a Bill
    views/              # the four interactive views
  lib/                  # tier/status metadata, date sorting
```

The case file reads **generically from a `Bill`**. No view knows anything about this
particular bill; they take `stages`, `routes`, `loophole`, `actors`.

### Adding a second case file

1. Create `src/data/<your-bill>.ts` exporting a `Bill` that conforms to `types.ts`,
   following the editorial rules above (correct `sourceTier`, `sourceUrl`, `sourceName`,
   `asOf` on every claim; `caveat` wherever money meets a name).
2. Pass it to `<CaseFile bill={yourBill} />` in `App.tsx` (or add a route — the
   component is route-agnostic).

That's the whole change. No new components, no edits to the views.

### Generating a draft from a real bill

```bash
npm run generate -- 4080                       # by bill id
npm run generate -- "Representation of the People"   # by search term
```

This pulls a bill from the UK Parliament Bills API and writes a **draft** `Bill`
to `src/data/generated/<bill>.draft.ts`. It auto-fills the deterministic spine —
metadata, the full timeline (each stage with a Bills-API-sourced claim), sponsor
`actors`, and a key-documents reference block — and leaves the analytical layers
(rationale, scale figures, money routes, the loophole, debate positions) as
clearly-marked `// TODO` stubs.

This is human-in-the-loop **by design**: the generator drafts only what is
structured public record; a person writes the neutral analysis, verifies every
claim, and adds the no-wrongdoing caveats before the draft is renamed off
`.draft` and wired into `App.tsx`. That review step *is* the neutrality gate.

## Future live layer

The first fetcher (Bills API) is built — see above and
[`src/data/ingestion/README.md`](src/data/ingestion/README.md), which describes how
the Divisions/Votes API, Hansard, the Electoral Commission, and Companies House would
populate the same interfaces on a nightly schedule, with the human review step as the
neutrality and no-wrongdoing gate.
