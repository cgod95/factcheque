import { useEffect, useMemo, useRef, useState } from 'react'
import type { Bill } from '@/data/types'
import { tierMeta, tierOrder } from '@/lib/meta'
import { VerifiedBanner } from './VerifiedBanner'
import { ClaimCard } from './ClaimCard'
import { SourceBadge } from './SourceBadge'
import { Timeline } from './views/Timeline'
import { MoneyFlowSankey } from './views/MoneyFlowSankey'
import { ScaleOfMoney } from './views/ScaleOfMoney'
import { LoopholeExplainer } from './views/LoopholeExplainer'
import { LoopholeNetwork } from './views/LoopholeNetwork'
import { PositionsTracker } from './views/PositionsTracker'
import { DataAppendix } from './views/DataAppendix'
import { ThemeToggle } from './ThemeToggle'
import { Reveal } from './Reveal'
import { BrandMark } from './BrandMark'
import { ArrowRightIcon } from './icons'

const NAV = [
  { id: 'how-we-got-here', label: 'How we got here' },
  { id: 'money-flows', label: 'Money flows' },
  { id: 'the-open-loophole', label: 'The open loophole' },
  { id: 'positions', label: 'Positions' },
  { id: 'data-sources', label: 'Data & sources' },
] as const

interface SectionProps {
  id: string
  index: number
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}

function Section({ id, index, eyebrow, title, description, children }: SectionProps) {
  return (
    <section id={id} className="anchor-offset border-t border-line py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mb-8 max-w-3xl">
          <header>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-accent">
              <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
              <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
              <span>{eyebrow}</span>
            </div>
            <h2 className="mt-3 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-pretty text-[16px] leading-relaxed text-ink-soft">{description}</p>
          </header>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

export function CaseFile({ bill }: { bill: Bill }) {
  const [active, setActive] = useState<string>(NAV[0].id)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Scrollspy: highlight the nav item for the section nearest the top.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    )
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    observerRef.current = observer
    return () => observer.disconnect()
  }, [])

  // Collect the unique source index for the footer.
  const sources = useMemo(() => {
    const map = new Map<string, string>() // url -> name
    const add = (name: string, url: string) => {
      if (!map.has(url)) map.set(url, name)
    }
    add(bill.governmentRationale.sourceName, bill.governmentRationale.sourceUrl)
    bill.stages.forEach((s) => s.claims.forEach((c) => add(c.sourceName, c.sourceUrl)))
    bill.context.forEach((c) => add(c.claim.sourceName, c.claim.sourceUrl))
    bill.routes.forEach((r) => add(r.claim.sourceName, r.claim.sourceUrl))
    add(bill.loophole.intro.sourceName, bill.loophole.intro.sourceUrl)
    bill.loophole.steps.forEach((s) => s.attribution && add(s.attribution.sourceName, s.attribution.sourceUrl))
    bill.actors.forEach((a) => add(a.sourceName, a.sourceUrl))
    if (bill.previousChapter) add(bill.previousChapter.claim.sourceName, bill.previousChapter.claim.sourceUrl)
    return Array.from(map, ([url, name]) => ({ url, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [bill])

  return (
    <div className="min-h-screen bg-paper">
      <VerifiedBanner lastVerified={bill.lastVerified} status={bill.status} />

      {/* Brand header */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink hover:text-accent-ink"
            >
              <BrandMark className="h-7 w-7" />
              Factcheque
            </a>
            <span className="hidden text-xs text-muted sm:inline">
              Money, influence &amp; the making of UK law
            </span>
          </div>
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

      {/* Masthead */}
      <div className="border-b border-line bg-gradient-to-b from-accent-soft/50 to-paper">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              UK Parliament · Session {bill.session}
            </p>
            <h1 className="mt-3 max-w-4xl text-balance font-display text-4xl leading-[1.08] text-ink sm:text-6xl">
              {bill.title}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft">
              {bill.summary}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            {/* Government rationale */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                What the government says it is for
              </p>
              <ClaimCard claim={bill.governmentRationale} />
            </div>

            {/* Context figures */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                The scale, in three figures
              </p>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {bill.context.map((fig) => (
                  <div key={fig.id} className="rounded-lg border border-line bg-surface p-4">
                    <div className="font-display text-3xl text-ink">{fig.value}</div>
                    <p className="mt-1 text-xs leading-snug text-ink-soft">{fig.label}</p>
                    <SourceBadge
                      tier={fig.claim.sourceTier}
                      name={fig.claim.sourceName}
                      url={fig.claim.sourceUrl}
                      asOf={fig.claim.asOf}
                      caveat={fig.claim.caveat}
                      compact
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky section nav */}
      <nav
        aria-label="Case file sections"
        className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
          {NAV.map((item, i) => {
            const isActive = active === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={(e) => {
                  // Scroll in-page without touching the URL hash, which the router
                  // owns (hash anchors here would otherwise be read as a route).
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView()
                }}
                className={`relative whitespace-nowrap px-3 py-3.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-muted hover:text-ink'
                }`}
              >
                <span className="mr-1.5 text-xs tabular-nums opacity-60">{i + 1}</span>
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />
                )}
              </a>
            )
          })}
        </div>
      </nav>

      <main>
        <Section
          id="how-we-got-here"
          index={1}
          eyebrow="Timeline"
          title="How we got here"
          description="The legislative journey, backward from the present: the trigger events, the announcement, the debate, and what the bill changes. Select a node for the sourced detail."
        >
          {bill.previousChapter && (
            <div className="mb-8 flex flex-col gap-3 rounded-xl border border-line bg-surface/60 p-5 sm:flex-row sm:items-start sm:gap-5">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                <ArrowRightIcon className="h-3 w-3 rotate-180" />
                Previous chapter
              </span>
              <div>
                <h3 className="font-display text-lg text-ink">{bill.previousChapter.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {bill.previousChapter.summary}
                </p>
                <SourceBadge
                  tier={bill.previousChapter.claim.sourceTier}
                  name={bill.previousChapter.claim.sourceName}
                  url={bill.previousChapter.claim.sourceUrl}
                  asOf={bill.previousChapter.claim.asOf}
                  className="mt-2"
                />
              </div>
            </div>
          )}
          <Timeline stages={bill.stages} />
        </Section>

        <Section
          id="money-flows"
          index={2}
          eyebrow="Money flow"
          title="The routes money takes — and what the bill does to each"
          description="Four routes carry money toward UK parties. This bill closes one, narrows several, and leaves one open depending on the test Parliament adopts."
        >
          <MoneyFlowSankey routes={bill.routes} />
          {(() => {
            const fig = bill.context.find((c) => c.id === 'ctx-41m')
            return fig ? (
              <div className="mt-10">
                <ScaleOfMoney
                  pct={32}
                  donationCount={18}
                  totalLabel="£41m"
                  sourceCount={9}
                  claim={fig.claim}
                />
              </div>
            ) : null
          })()}
        </Section>

        <Section
          id="the-open-loophole"
          index={3}
          eyebrow="Explainer"
          title="The route the bill leaves open"
          description="An anatomy of the foreign-owned-UK-company route, presented as Democracy for Sale documented it. The structure is shown in the abstract; the specific findings are attributed."
        >
          <LoopholeExplainer loophole={bill.loophole} />
          <div className="mt-10">
            <LoopholeNetwork />
          </div>
        </Section>

        <Section
          id="positions"
          index={4}
          eyebrow="On the record"
          title="Who said what"
          description="A neutral register of named actors' on-record positions on the bill. Sort by actor or date; filter by stance. It records positions only — it draws no inference."
        >
          <PositionsTracker actors={bill.actors} />
        </Section>

        <Section
          id="data-sources"
          index={5}
          eyebrow="Methods"
          title="Data & sources"
          description="Every sourced statement in this case file, in one table — filter by fact tier, and download the lot as CSV or JSON. Nothing on the page is asserted without a source."
        >
          <DataAppendix bill={bill} />
        </Section>
      </main>

      {/* Footer: methodology, tier legend, source index */}
      <footer className="bg-surface-invert text-on-invert">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-display text-2xl">How to read this case file</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-on-invert/70">
                Factcheque synthesises, visualises and attributes already-public findings. It is
                not activism and breaks no new stories. Every claim is a restatement of an
                on-record finding by a named source; nothing here asserts a causal link between a
                donation and a vote, and named cases are attributed to the investigators who
                documented them.
              </p>

              <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-wide text-on-invert/50">
                The four fact tiers
              </h3>
              <ul className="mt-3 space-y-2">
                {tierOrder.map((tier) => (
                  <li key={tier} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${tierMeta[tier].dot}`}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="font-medium">{tierMeta[tier].label}</span>
                      <span className="text-on-invert/60"> — {tierMeta[tier].description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-on-invert/50">
                Source index ({sources.length})
              </h3>
              <ul className="mt-3 space-y-2.5">
                {sources.map((s) => (
                  <li key={s.url} className="text-sm leading-snug">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-invert/80 underline decoration-on-invert/30 underline-offset-2 hover:text-on-invert hover:decoration-on-invert"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-on-invert/15 pt-6 text-xs text-on-invert/50">
            <p>
              Factcheque · Case file 01 · {bill.title} ({bill.session}). Verified as of{' '}
              {bill.lastVerified}. This bill is live; claims are date-stamped and should be
              re-checked against the primary sources before reuse.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
