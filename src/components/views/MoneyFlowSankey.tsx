import { useMemo, useState } from 'react'
import {
  sankey,
  sankeyLinkHorizontal,
  sankeyJustify,
  type SankeyNodeMinimal,
  type SankeyLinkMinimal,
} from 'd3-sankey'
import type { MoneyRoute, RouteStatus } from '@/data/types'
import { routeStatusMeta, routeStatusOrder } from '@/lib/meta'
import { ClaimCard } from '../ClaimCard'

interface MoneyFlowSankeyProps {
  routes: MoneyRoute[]
}

interface SNode extends SankeyNodeMinimal<SNode, SLink> {
  id: string
  name: string
}
interface SLink extends SankeyLinkMinimal<SNode, SLink> {
  source: string | number | SNode
  target: string | number | SNode
  value: number
  status: RouteStatus
  routeId: string
}

type Phase = 'before' | 'after'

const WIDTH = 900
const HEIGHT = 470
const M = { top: 26, right: 158, bottom: 26, left: 170 }

/** Wrap a label into at most two lines without breaking words. */
function wrapLabel(text: string, maxChars = 20): string[] {
  if (text.length <= maxChars) return [text]
  const words = text.split(' ')
  const lines: string[] = ['', '']
  let i = 0
  for (const w of words) {
    if (i === 0 && (lines[0] + ' ' + w).trim().length > maxChars) i = 1
    lines[i] = (lines[i] + ' ' + w).trim()
  }
  return lines.filter(Boolean)
}

/** A short figure for an on-chart annotation, e.g. "£242m" or "banned". */
function chartFigure(label?: string): string | null {
  if (!label) return null
  const money = label.match(/£[\d.,]+\s?[a-z+]*/i)
  if (money) return money[0].trim()
  return label.split(/[\s(,]/)[0]
}

export function MoneyFlowSankey({ routes }: MoneyFlowSankeyProps) {
  const [phase, setPhase] = useState<Phase>('after')
  // Default selection to the route the bill leaves open — the editorial hook.
  const [activeId, setActiveId] = useState<string>(
    routes.find((r) => r.status === 'open')?.id ?? routes[0].id,
  )

  const { nodes, links } = useMemo(() => {
    const nodeNames = new Set<string>()
    routes.forEach((r) => {
      nodeNames.add(r.from)
      nodeNames.add(r.to)
    })
    const nodeList: SNode[] = Array.from(nodeNames).map((name) => ({ id: name, name }))

    // Uniform link value: the diagram encodes ROUTE and STATUS, not magnitude.
    const linkList: SLink[] = routes.map((r) => ({
      source: r.from,
      target: r.to,
      value: 1,
      status: r.status,
      routeId: r.id,
    }))

    const generator = sankey<SNode, SLink>()
      .nodeId((d) => d.id)
      .nodeWidth(13)
      .nodePadding(24)
      .nodeAlign(sankeyJustify)
      .extent([
        [M.left, M.top],
        [WIDTH - M.right, HEIGHT - M.bottom],
      ])

    return generator({
      nodes: nodeList.map((d) => ({ ...d })),
      links: linkList.map((d) => ({ ...d })),
    })
  }, [routes])

  const activeRoute = routes.find((r) => r.id === activeId)!
  const linkPath = sankeyLinkHorizontal<SNode, SLink>()

  // Under current law, every route is open; the bill applies the status colours.
  const colourFor = (status: RouteStatus) =>
    phase === 'before' ? routeStatusMeta.open.stroke : routeStatusMeta[status].stroke
  const displayStatus: RouteStatus = phase === 'before' ? 'open' : activeRoute.status

  return (
    <div>
      {/* Phase toggle */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div
          className="inline-flex rounded-full border border-line bg-surface p-0.5 text-xs font-medium"
          role="group"
          aria-label="Show routes before or after the bill"
        >
          {(
            [
              ['before', 'Current law'],
              ['after', 'After the bill'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPhase(value)}
              aria-pressed={phase === value}
              className={`rounded-full px-3 py-1.5 transition ${
                phase === value ? 'bg-accent text-paper' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">
          {phase === 'before'
            ? 'Every route is currently open.'
            : 'Watch which routes the bill closes, narrows, or leaves open.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        {/* Diagram */}
        <figure className="min-w-0">
          {/* On narrow screens the chart scrolls horizontally so labels stay legible. */}
          <div className="rail-scroll -mx-1 overflow-x-auto px-1">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="w-full min-w-[620px]"
              role="img"
              aria-label="Sankey diagram of routes money can take into UK political parties, colour-coded by whether the bill closes, narrows, or leaves each route open."
            >
              {/* Links */}
              <g fill="none">
                {links.map((link) => {
                  const isActive = link.routeId === activeId
                  const route = routes.find((r) => r.id === link.routeId)!
                  const closedNow = phase === 'after' && link.status === 'closed'
                  return (
                    <path
                      key={link.routeId}
                      d={linkPath(link) ?? undefined}
                      stroke={colourFor(link.status)}
                      strokeWidth={Math.max(14, link.width ?? 14)}
                      strokeOpacity={isActive ? 0.9 : 0.32}
                      strokeDasharray={closedNow ? '2 13' : undefined}
                      className="cursor-pointer transition-[stroke,stroke-opacity,stroke-dasharray] duration-500 focus:outline-none"
                      tabIndex={0}
                      role="button"
                      aria-pressed={isActive}
                      aria-label={`${route.from} to ${route.to}. ${routeStatusMeta[link.status].label}. ${route.note}`}
                      onClick={() => setActiveId(link.routeId)}
                      onMouseEnter={() => setActiveId(link.routeId)}
                      onFocus={() => setActiveId(link.routeId)}
                    />
                  )
                })}
              </g>

              {/* Figure annotations near each link's source end */}
              <g>
                {links.map((link) => {
                  const route = routes.find((r) => r.id === link.routeId)!
                  const fig = chartFigure(route.amountLabel)
                  if (!fig) return null
                  const src = link.source as SNode
                  const tgt = link.target as SNode
                  const t = 0.3
                  const x = (src.x1 ?? 0) + ((tgt.x0 ?? 0) - (src.x1 ?? 0)) * t
                  const y = (link.y0 ?? 0) + ((link.y1 ?? 0) - (link.y0 ?? 0)) * t
                  const isActive = link.routeId === activeId
                  const w = fig.length * 6.6 + 12
                  return (
                    <g key={link.routeId} className="pointer-events-none">
                      <rect
                        x={x - w / 2}
                        y={y - 9}
                        width={w}
                        height={18}
                        rx={9}
                        fill="var(--color-surface)"
                        opacity={isActive ? 0.96 : 0.85}
                      />
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight={isActive ? 700 : 600}
                        className="fill-ink-soft"
                      >
                        {fig}
                      </text>
                    </g>
                  )
                })}
              </g>

              {/* Nodes */}
              <g>
                {nodes.map((node) => {
                  const x0 = node.x0 ?? 0
                  const x1 = node.x1 ?? 0
                  const y0 = node.y0 ?? 0
                  const y1 = node.y1 ?? 0
                  const isSink = x0 > WIDTH / 2
                  const lines = wrapLabel(node.name, isSink ? 16 : 19)
                  const labelX = isSink ? x1 + 10 : x0 - 10
                  const cy = (y0 + y1) / 2
                  return (
                    <g key={node.id}>
                      <rect
                        x={x0}
                        y={y0}
                        width={x1 - x0}
                        height={Math.max(2, y1 - y0)}
                        rx={2}
                        fill={isSink ? 'var(--color-ink)' : 'var(--color-ink-soft)'}
                      />
                      <text
                        x={labelX}
                        y={cy}
                        textAnchor={isSink ? 'start' : 'end'}
                        dominantBaseline="middle"
                        className="fill-ink"
                        fontSize={13}
                        fontWeight={isSink ? 700 : 600}
                      >
                        {lines.map((ln, i) => (
                          <tspan
                            key={i}
                            x={labelX}
                            dy={i === 0 ? `${-(lines.length - 1) * 0.6}em` : '1.2em'}
                          >
                            {ln}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  )
                })}
              </g>
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3">
            {routeStatusOrder.map((s) => (
              <span key={s} className="inline-flex items-center gap-2 text-xs text-ink-soft">
                <span className={`h-2.5 w-4 rounded-sm ${routeStatusMeta[s].dot}`} aria-hidden="true" />
                {routeStatusMeta[s].label}
              </span>
            ))}
          </div>
          <figcaption className="mt-3 text-xs leading-relaxed text-muted">
            Toggle <span className="font-medium text-ink-soft">Current law / After the bill</span> to
            see what changes. Colour shows the bill’s effect on each route; the figures on each link
            are the best available sourced statistic, with differing bases (cumulative totals, a
            since-2010 total, a single investigation) — so they are not directly comparable, and link
            widths are kept uniform rather than to scale. Hover, tap or focus a route for detail.
          </figcaption>
        </figure>

        {/* Detail panel */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${routeStatusMeta[displayStatus].chip}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${routeStatusMeta[displayStatus].dot}`}
                  aria-hidden="true"
                />
                {phase === 'before' ? 'Open under current law' : routeStatusMeta[displayStatus].label}
              </span>
            </div>

            <h3 className="mt-3 font-display text-xl text-ink">
              {activeRoute.from}
              <span className="px-1.5 text-muted">→</span>
              {activeRoute.to}
            </h3>

            {activeRoute.amountLabel && (
              <p className="mt-1 text-sm font-medium text-ink-soft">{activeRoute.amountLabel}</p>
            )}

            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{activeRoute.note}</p>

            <ClaimCard claim={activeRoute.claim} className="mt-4" />
          </div>

          {/* Quick route switcher (also a keyboard-friendly fallback) */}
          <div className="mt-3 flex flex-wrap gap-2">
            {routes.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveId(r.id)}
                aria-pressed={r.id === activeId}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  r.id === activeId
                    ? routeStatusMeta[phase === 'before' ? 'open' : r.status].chip
                    : 'border-line bg-surface text-muted hover:text-ink'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
