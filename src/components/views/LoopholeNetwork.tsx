import { useState } from 'react'

const COMPANIES = [
  { id: 'a', label: 'UK company A', y: 64 },
  { id: 'b', label: 'UK company B', y: 150 },
  { id: 'c', label: 'UK company C', y: 236 },
]

const OWNER = { x: 96, y: 150 }
const COMPANY_X = 360
const PARTY = { x: 612, y: 150 }

/**
 * The route, generalised: one ineligible owner controls several UK-registered
 * companies, each a permissible donor — so funds reach a party by a lawful route.
 * Abstract and illustrative; the documented cases are Democracy for Sale's.
 */
export function LoopholeNetwork() {
  const [hover, setHover] = useState<string | null>(null)

  const edgeActive = (companyId: string) => hover === null || hover === companyId

  return (
    <figure className="rounded-xl border border-line bg-surface p-4 sm:p-6">
      <figcaption className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
        The route, generalised — hover a company to trace its path
      </figcaption>
      <div className="rail-scroll overflow-x-auto">
        <svg
          viewBox="0 0 708 300"
          className="w-full min-w-[520px]"
          role="img"
          aria-label="Network diagram: one ineligible owner controls three UK-registered companies, each of which can donate to a UK party as a permissible source."
        >
          {/* Edges: owner → companies (control), companies → party (donation) */}
          <g fill="none" strokeLinecap="round">
            {COMPANIES.map((c) => {
              const on = edgeActive(c.id)
              return (
                <g key={c.id}>
                  <path
                    d={`M${OWNER.x + 64} ${OWNER.y} C 240 ${OWNER.y}, 230 ${c.y}, ${COMPANY_X - 4} ${c.y}`}
                    stroke="var(--color-line-strong)"
                    strokeWidth={2}
                    strokeOpacity={on ? 1 : 0.25}
                    className="transition-opacity duration-200"
                  />
                  <path
                    d={`M${COMPANY_X + 120} ${c.y} C 520 ${c.y}, 500 ${PARTY.y}, ${PARTY.x - 4} ${PARTY.y}`}
                    stroke="var(--color-open)"
                    strokeWidth={on ? 3 : 2}
                    strokeOpacity={on ? 0.9 : 0.2}
                    className="transition-all duration-200"
                  />
                </g>
              )
            })}
          </g>

          {/* Owner */}
          <g>
            <rect x={OWNER.x - 8} y={OWNER.y - 30} width={128} height={60} rx={10} fill="var(--color-surface)" stroke="var(--color-line-strong)" strokeWidth={1.5} />
            <text x={OWNER.x + 56} y={OWNER.y - 6} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-ink">Owner</text>
            <text x={OWNER.x + 56} y={OWNER.y + 13} textAnchor="middle" fontSize={11} className="fill-muted">not eligible to vote</text>
          </g>

          {/* Companies */}
          {COMPANIES.map((c) => {
            const on = edgeActive(c.id)
            return (
              <g
                key={c.id}
                onMouseEnter={() => setHover(c.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                <rect
                  x={COMPANY_X}
                  y={c.y - 22}
                  width={120}
                  height={44}
                  rx={9}
                  fill={hover === c.id ? 'var(--color-accent-soft)' : 'var(--color-surface)'}
                  stroke={hover === c.id ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                  strokeWidth={hover === c.id ? 2 : 1.5}
                  opacity={on ? 1 : 0.4}
                  className="transition-all duration-200"
                />
                <text x={COMPANY_X + 60} y={c.y - 2} textAnchor="middle" fontSize={12.5} fontWeight={600} className="fill-ink" opacity={on ? 1 : 0.5}>
                  {c.label}
                </text>
                <text x={COMPANY_X + 60} y={c.y + 14} textAnchor="middle" fontSize={10.5} className="fill-muted" opacity={on ? 1 : 0.5}>
                  permissible donor
                </text>
              </g>
            )
          })}

          {/* Party */}
          <g>
            <rect x={PARTY.x} y={PARTY.y - 30} width={88} height={60} rx={10} fill="var(--color-ink)" />
            <text x={PARTY.x + 44} y={PARTY.y - 4} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-paper">UK party</text>
            <text x={PARTY.x + 44} y={PARTY.y + 14} textAnchor="middle" fontSize={10} className="fill-paper" opacity={0.7}>receives</text>
          </g>
        </svg>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Companies are illustrative. The point of structure: eligibility attaches to the company, not
        its owner — so one person who could not donate directly may do so through several companies
        they control. The documented cases and the £6m+ figure are Democracy for Sale’s.
      </p>
    </figure>
  )
}
