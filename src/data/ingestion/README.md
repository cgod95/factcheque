# Ingestion layer

v1 ships all content as hand-curated, typed data in
`src/data/representation-of-the-people-bill.ts`, conforming to the interfaces in
`src/data/types.ts`. This file documents how a later phase would **auto-populate
those same interfaces** from public APIs on a schedule, without changing any
component.

> **Status — the first fetcher is built.** `npm run generate -- <billId|search>`
> (see `scripts/generate-bill.mjs`) pulls a bill from the UK Parliament Bills API
> and writes a **draft** `Bill` to `src/data/generated/<bill>.draft.ts`. It
> auto-fills the deterministic spine — metadata, the full timeline (each stage with
> a Bills-API-sourced claim), sponsor `actors`, and a key-documents reference block
> — and stubs the analytical layers (rationale, context, money routes, loophole,
> debate positions) with `// TODO` markers for the human review step. The remaining
> sources below are not yet wired in.

The seam is deliberate: every view reads from a `Bill` object. An ingestion run's
only job is to emit a valid `Bill` (or a patch to one) as JSON. Nothing downstream
needs to know whether that JSON was typed by hand or fetched overnight.

> **Editorial gate.** Automated ingestion may populate *records* (stages, dates,
> amounts, division results) but must never auto-generate a `framing`-tier claim or
> drop a `caveat`. Any newly-ingested NGO/investigative finding stays in a review
> queue until a human attaches the correct tier and, where an individual or company
> is named, the no-wrongdoing caveat. Neutrality is enforced at the human step.

## Target shape

Each fetcher produces fragments that map onto `types.ts`:

| Interface field            | Source                                   |
| -------------------------- | ---------------------------------------- |
| `Bill.status`, `Bill.stages` | UK Parliament **Bills API**            |
| `Stage` (reading/committee), division context | UK Parliament **Divisions / Votes API** |
| `MoneyRoute.amount`, `ContextFigure` | **Electoral Commission** donation data |
| Loophole UBO → company tracing | **Companies House API**                |
| `Actor.position`, `Claim` (debate tier) | **Hansard API** (member contributions) |

## Proposed sources

### 1. UK Parliament — Bills API ✅ implemented (`npm run generate`)
- Base: `https://bills-api.parliament.uk/api/v1`
- Populates: `Bill.title`, `Bill.status`, the `Stage[]` timeline
  (`/Bills/{billId}/Stages`, each stage with a `statute`-tier claim), sponsor
  `actors` (`/Bills/{billId}` → `sponsors`), and a key-documents reference block
  (`/Bills/{billId}/Publications`). `Bill.session` is left as a TODO (the API
  exposes a session id but no name lookup).
- Cadence: nightly. Cheap to diff — only update when a new stage appears or the
  current stage changes.

### 2. UK Parliament — Divisions / Votes API
- Commons: `https://commonsvotes-api.parliament.uk` · Lords: `https://lordsvotes-api.parliament.uk`
- Populates: division results attached to reading/committee `Stage`s, and the
  `debate`-tier evidence behind `Actor` positions (how named members voted).

### 3. Hansard API
- Base: `https://hansard-api.parliament.uk`
- Populates: `debate`-tier `Claim`s — the exact on-record words behind each
  `Actor.position`, with a deep link to the contribution. Replaces hand-quoting.

### 4. Electoral Commission — donation data
- Public donation/loan search + bulk CSV export.
- Populates: `ContextFigure` totals and `MoneyRoute.amount` / `amountLabel`. Note:
  EC categories don't map 1:1 to our `from` nodes, so a mapping table lives beside
  the fetcher and is the reviewed artefact.

### 5. Companies House API
- Base: `https://api.company-information.service.gov.uk` (free API key)
- Powers the loophole explainer's UBO → UK-company tracing via the
  persons-with-significant-control (PSC) endpoints. **Output is evidence for a human
  reviewer, never an auto-published named allegation** (see editorial gate above).

## Proposed mechanism

```
GitHub Action (nightly cron)
  → run fetchers (per source above)
  → assemble a candidate Bill JSON in src/data/generated/<bill-id>.json
  → diff against committed data; if changed:
      → open a PR with the diff (human review = the neutrality + caveat gate)
  → on merge, the app imports the JSON exactly where it imports the .ts today
```

Implementation notes for whoever picks this up:
- Keep fetchers pure: `fetch → normalise → emit fragment`. No rendering concerns.
- Validate every emitted `Bill` against `types.ts` (e.g. a `zod` schema mirroring the
  interfaces) before it can open a PR.
- Preserve `lastVerified` semantics: set it to the ingestion run date only after a
  human approves the PR, so the banner never claims freshness no one checked.
