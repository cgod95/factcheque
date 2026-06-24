import { tierMeta, tierOrder } from '@/lib/meta'
import { ThemeToggle } from './ThemeToggle'
import { Reveal } from './Reveal'
import { BrandMark } from './BrandMark'
import { ArrowRightIcon } from './icons'

const RULES = [
  {
    title: 'Neutrality by construction',
    body: 'Every factual statement is a restatement of an on-record finding by a named source — it cannot appear without one. Nothing here asserts a causal link between a donation and a vote. We co-locate the public record and leave the inference to you.',
  },
  {
    title: 'No suggestion of wrongdoing',
    body: 'Where an individual or company is named in connection with money, we attach the factual caveat that it is a matter of public record and that there is no suggestion of wrongdoing — unless a court or regulator has found otherwise, in which case we cite that finding.',
  },
  {
    title: 'Attribute, don’t allege',
    body: 'Specific named cases are presented as “[Source] identified…”, linked to that source — never restated in our own voice. The investigators who did the work are credited for it.',
  },
  {
    title: 'Date-stamp everything',
    body: 'These bills are live. A single “verified as of” date drives the banner, and every individual claim carries its own “as of” date, so you always know how fresh a fact is.',
  },
]

const GLOSSARY = [
  ['Permissible donor', 'Broadly, a UK-registered elector or a UK-registered company carrying on business in the UK. Only permissible donors may give to political parties.'],
  ['Overseas elector', 'A British citizen living abroad who is registered to vote in the UK — a permissible source of donations (now subject to a proposed £100,000 annual cap).'],
  ['Unincorporated association', 'A group that is itself a permissible donor but need not run permissibility checks on its own donors — a route the regulator has flagged.'],
  ['Revenue test vs profit test', 'Two proposed tests for a company’s “legitimate UK connection”: eligibility by turnover (the bill’s revenue test) versus by UK post-tax profits (the profit test, recommended by the Committee on Standards in Public Life).'],
  ['Ultimate beneficial owner (UBO)', 'The individual who ultimately owns or controls a company — who may differ from the company that formally makes a donation.'],
  ['Fact tier', 'Our label for the kind of authority behind a claim: official record, parliamentary debate, investigative/NGO, or our own neutral framing.'],
]

export function Methodology() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#/"
            className="inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink"
          >
            <BrandMark className="h-7 w-7" />
            Factcheque
          </a>
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
            >
              <ArrowRightIcon className="h-3 w-3 rotate-180" />
              All case files
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Methodology · show your work
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
            How we work
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-soft">
            Factcheque synthesises, visualises and attributes findings that are already public. It is
            not activism and it breaks no new stories. The whole value rests on one thing — that you
            can trust every figure — so here is exactly how it is made.
          </p>
        </Reveal>

        {/* The rules */}
        <section className="mt-14 border-t border-line pt-12">
          <Reveal>
            <h2 className="font-display text-2xl text-ink">The rules we hold to</h2>
          </Reveal>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {RULES.map((r) => (
              <div key={r.title} className="rounded-xl border border-line bg-surface p-5">
                <h3 className="font-display text-lg text-ink">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fact tiers */}
        <section className="mt-14 border-t border-line pt-12">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-2xl text-ink">The four fact tiers</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Every claim carries a colour-coded badge showing the <em>kind</em> of authority behind
              it, so you can weigh it at a glance — a regulator’s record is not the same thing as a
              member’s remark in a debate.
            </p>
          </Reveal>
          <ul className="mt-6 space-y-3">
            {tierOrder.map((tier) => (
              <li
                key={tier}
                className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4"
              >
                <span
                  className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tierMeta[tier].chip}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tierMeta[tier].dot}`} aria-hidden="true" />
                  {tierMeta[tier].label}
                </span>
                <span className="text-[15px] leading-relaxed text-ink-soft">
                  {tierMeta[tier].description}.
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* How the data is gathered */}
        <section className="mt-14 border-t border-line pt-12">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-2xl text-ink">How a case file is built</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              The pipeline is deliberately part-machine, part-human — and the line between them is the
              point.
            </p>
          </Reveal>
          <ol className="mt-6 space-y-4">
            {[
              ['The machine drafts the record', 'A generator pulls the bill from the UK Parliament Bills API — its timeline, stages, sponsors and official documents. This is structured public data, and it is safe to automate.'],
              ['A human does the analysis', 'The money routes, the loophole, the scale figures and the named positions are written and verified by a person, against primary sources. None of it is auto-generated.'],
              ['Every claim is checked', 'Each statement is matched to a named source and given the correct fact tier; where a name meets money, the no-wrongdoing caveat is added.'],
              ['Only then does it publish', 'The “verified as of” date is set to when a human actually checked it. The review step is the neutrality gate — nothing skips it.'],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-4 rounded-xl border border-line bg-surface p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-paper">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* What we don't do */}
        <section className="mt-14 border-t border-line pt-12">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-2xl text-ink">What we deliberately don’t do</h2>
          </Reveal>
          <ul className="mt-6 space-y-2.5">
            {[
              'Assert that any donation caused any vote, or imply it through juxtaposition.',
              'Name a person as having done something wrong without a court or regulator’s finding.',
              'Let a machine write the analysis or the framing — the parts that require judgement stay human.',
              'Present a figure without a source you can click through to.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-open" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* Glossary */}
        <section className="mt-14 border-t border-line pt-12">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-2xl text-ink">Jargon, made legible</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              The rules are written in language designed to be hard to follow. A few terms that recur:
            </p>
          </Reveal>
          <dl className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line">
            {GLOSSARY.map(([term, def]) => (
              <div key={term} className="grid gap-1 bg-surface p-4 sm:grid-cols-[200px_1fr] sm:gap-5">
                <dt className="font-display text-[15px] font-semibold text-ink">{term}</dt>
                <dd className="text-[15px] leading-relaxed text-ink-soft">{def}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Reuse */}
        <section className="mt-14 border-t border-line pt-12">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-2xl text-ink">Take the data</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Every sourced statement in a case file is listed in its <em>Data &amp; sources</em>{' '}
              section and downloadable as CSV or JSON — sources, fact tiers and dates included. Use
              it, check it, build on it.
            </p>
            <a
              href="#/bill/representation-of-the-people-bill-2024-26"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              Open the case file
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </Reveal>
        </section>
      </main>

      <footer className="bg-surface-invert text-on-invert">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <p className="max-w-xl font-display text-xl leading-snug">
            A neutral, public-record map of the money and influence behind UK laws.
          </p>
          <p className="mt-8 text-xs text-on-invert/50">
            Factcheque · all data from public sources · the conclusions are left to you.
          </p>
        </div>
      </footer>
    </div>
  )
}
