import { useMemo, useState } from 'react'
import type { Bill, SourceTier } from '@/data/types'
import { collectClaims, type FlatClaim } from '@/lib/claims'
import { tierMeta, tierOrder } from '@/lib/meta'
import { ExternalLinkIcon } from '../icons'

interface DataAppendixProps {
  bill: Bill
}

type Filter = SourceTier | 'all'

function triggerDownload(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function toCSV(rows: FlatClaim[]): string {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const header = ['id', 'section', 'tier', 'statement', 'source', 'sourceUrl', 'asOf', 'caveat']
  const lines = [header.join(',')]
  rows.forEach((r) =>
    lines.push(
      [r.id, r.group, r.tier, r.text, r.sourceName, r.sourceUrl, r.asOf, r.caveat ?? '']
        .map(esc)
        .join(','),
    ),
  )
  return lines.join('\n')
}

export function DataAppendix({ bill }: DataAppendixProps) {
  const all = useMemo(() => collectClaims(bill), [bill])
  const [filter, setFilter] = useState<Filter>('all')

  const rows = filter === 'all' ? all : all.filter((c) => c.tier === filter)
  const base = `factcheque-${bill.id}-sources`

  return (
    <div>
      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} count={all.length}>
            All
          </FilterChip>
          {tierOrder.map((t) => (
            <FilterChip
              key={t}
              active={filter === t}
              onClick={() => setFilter(t)}
              count={all.filter((c) => c.tier === t).length}
              dot={tierMeta[t].dot}
            >
              {tierMeta[t].label}
            </FilterChip>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => triggerDownload(`${base}.csv`, toCSV(rows), 'text/csv')}
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-line-strong hover:text-ink"
          >
            Download CSV
          </button>
          <button
            type="button"
            onClick={() => triggerDownload(`${base}.json`, JSON.stringify(rows, null, 2), 'application/json')}
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-line-strong hover:text-ink"
          >
            Download JSON
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <caption className="sr-only">
            Every sourced statement in this case file, with its fact tier, source and date.
          </caption>
          <thead>
            <tr className="border-b border-line bg-surface text-[11px] uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">Statement</th>
              <th scope="col" className="px-4 py-3 font-semibold">Section</th>
              <th scope="col" className="px-4 py-3 font-semibold">Tier</th>
              <th scope="col" className="px-4 py-3 font-semibold">Source</th>
              <th scope="col" className="px-4 py-3 font-semibold">As of</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line align-top last:border-0 odd:bg-surface/40">
                <td className="max-w-md px-4 py-3 text-[13px] leading-relaxed text-ink-soft">
                  {r.text}
                  {r.caveat && <span className="mt-1 block text-[11px] italic text-muted">{r.caveat}</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{r.group}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${tierMeta[r.tier].chip}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${tierMeta[r.tier].dot}`} aria-hidden="true" />
                    {tierMeta[r.tier].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-[15rem] items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    <span className="truncate">{r.sourceName}</span>
                    <ExternalLinkIcon className="h-3 w-3 shrink-0 opacity-60" />
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{r.asOf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted">
        {rows.length} of {all.length} statements. Every on-screen claim in this case file appears
        here with its source — nothing is asserted without one.
      </p>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  count,
  dot,
  children,
}: {
  active: boolean
  onClick: () => void
  count: number
  dot?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'border-accent bg-accent text-paper'
          : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink'
      }`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-paper/70' : dot}`} aria-hidden="true" />}
      {children}
      <span className={active ? 'text-paper/70' : 'text-muted'}>{count}</span>
    </button>
  )
}
