import { useState } from 'react'
import { deepCaseFiles, monitoring, threads, caseFileTopics } from '@/data/registry'
import { LAST_VERIFIED } from '@/data/representation-of-the-people-bill'
import { tierMeta, tierOrder } from '@/lib/meta'
import { ThemeToggle } from './ThemeToggle'
import { Reveal } from './Reveal'
import { BrandMark } from './BrandMark'
import { HeroFlow } from './HeroFlow'
import { ArrowRightIcon, ExternalLinkIcon } from './icons'

/**
 * The library landing page — the front door. Presents the project, promotes the
 * deep case files, shows the recurring threads, and the monitor's watch list.
 * Reads generically from the registry, so it grows as case files are added.
 */
export function Library() {
  const [topic, setTopic] = useState<string>('all')
  const visibleDeep =
    topic === 'all' ? deepCaseFiles : deepCaseFiles.filter((d) => d.topics.includes(topic))

  return (
    <div className="min-h-screen bg-paper">
      {/* Brand header */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink"
            >
              <BrandMark className="h-7 w-7" />
              Factcheque
            </a>
            <span className="hidden text-xs text-muted sm:inline">
              Money, influence &amp; the making of UK law
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-accent-soft/50 to-paper">
        <HeroFlow className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.10] dark:opacity-[0.18]" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              UK · Money · Influence · Legislation
            </p>
            <h1 className="mt-4 max-w-4xl text-balance font-display text-4xl leading-[1.07] text-ink sm:text-6xl">
              How money and foreign influence move around UK legislation.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft">
              Factcheque turns scattered public records into clear, neutral case files — who funds,
              shapes and benefits from each bill, with the conclusions left to you.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Public record', 'Neutral by construction', 'No allegations'].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Case files (deep) */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <Reveal className="mb-8 max-w-2xl">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-accent">
            <span>Case files</span>
            <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
          </div>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Investigated in depth</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            Each case file maps the money and influence around one bill across four views —
            backward, sideways and forward.
          </p>
        </Reveal>

        <div className="mb-6 flex flex-wrap gap-2">
          {['all', ...caseFileTopics].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                topic === t
                  ? 'border-accent bg-accent text-paper'
                  : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {visibleDeep.map(({ bill, topics, blurb }) => (
            <Reveal key={bill.id}>
              <a
                href={`#/bill/${bill.id}`}
                className="group block h-full rounded-xl border border-line bg-surface p-6 transition hover:border-line-strong hover:shadow-[0_2px_14px_rgba(0,0,0,0.06)]"
              >
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {topics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-ink"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-2xl text-ink group-hover:text-accent-ink">
                  {bill.title}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                  Session {bill.session} · {bill.status}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Open case file
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The beat (threads) */}
      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal className="mb-8 max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-accent">
              <span>The beat</span>
              <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
            </div>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">The threads we follow</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
              Structural routes that recur across bills. Built once, they connect every case file.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {threads.map((t) => (
              <div key={t.name} className="rounded-xl border border-line bg-surface p-5">
                <h3 className="font-display text-lg text-ink">{t.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* On the monitor (stubs) */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <Reveal className="mb-8 max-w-2xl">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-accent">
            <span>On the monitor</span>
            <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
          </div>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Also before Parliament</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            A monitor scans every UK bill via the Parliament API and surfaces ones touching money,
            donations or public spending. These are tracked — not yet given a deep case file.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {monitoring.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-line bg-surface/60 p-5 transition hover:border-line-strong"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Monitoring
                </span>
                {s.topics.map((t) => (
                  <span key={t} className="text-[11px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="text-[15px] font-semibold leading-snug text-ink group-hover:text-accent-ink">
                {s.title}
              </h3>
              <p className="mt-1 text-xs text-muted">
                {s.status} · updated {s.updated}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
                View on Parliament
                <ExternalLinkIcon className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Watch list generated with{' '}
          <code className="rounded bg-line/60 px-1 py-0.5">npm run generate</code> from the UK
          Parliament Bills API.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-surface-invert text-on-invert">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <h2 className="max-w-2xl font-display text-2xl">
            A neutral, public-record map of the money and influence behind UK laws.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-on-invert/70">
            Every claim is a restatement of an on-record finding by a named source. Nothing here
            asserts a causal link between a donation and a vote; named cases are attributed to the
            investigators who documented them.
          </p>

          <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-wide text-on-invert/50">
            The four fact tiers
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {tierOrder.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${tierMeta[t].dot}`}
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium">{tierMeta[t].label}</span>
                  <span className="text-on-invert/60"> — {tierMeta[t].description}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-10 border-t border-on-invert/15 pt-6 text-xs text-on-invert/50">
            Factcheque · case files verified as of {LAST_VERIFIED}. All data from public sources.
          </p>
        </div>
      </footer>
    </div>
  )
}
