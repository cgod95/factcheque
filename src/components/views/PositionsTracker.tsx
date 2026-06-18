import { useMemo, useState } from 'react'
import type { Actor, ActorStance } from '@/data/types'
import { stanceMeta } from '@/lib/meta'
import { dateSortKey } from '@/lib/date'
import { SourceBadge } from '../SourceBadge'
import { SortIcon } from '../icons'

interface PositionsTrackerProps {
  actors: Actor[]
}

type SortKey = 'name' | 'date'
type SortDir = 'asc' | 'desc'
type Filter = ActorStance | 'all'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All positions' },
  { key: 'government', label: 'Government line' },
  { key: 'stronger-safeguards', label: 'Stronger test' },
  { key: 'welcome-with-caveat', label: 'Welcomed, with caveat' },
  { key: 'briefing', label: 'Official briefing' },
]

export function PositionsTracker({ actors }: PositionsTrackerProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const rows = useMemo(() => {
    const filtered = filter === 'all' ? actors : actors.filter((a) => a.stance === filter)
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else cmp = dateSortKey(a.date) - dateSortKey(b.date)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [actors, filter, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (sortKey !== key) return 'none'
    return sortDir === 'asc' ? 'ascending' : 'descending'
  }

  return (
    <div>
      {/* Filter chips */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key
          const count =
            f.key === 'all' ? actors.length : actors.filter((a) => a.stance === f.key).length
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? 'border-accent bg-accent text-paper'
                  : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink'
              }`}
            >
              {f.label}
              <span className={active ? 'ml-1.5 text-paper/70' : 'ml-1.5 text-muted'}>{count}</span>
            </button>
          )
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">
            On-record positions of named actors on the Representation of the People Bill, sortable
            by actor and date and filterable by stance.
          </caption>
          <thead>
            <tr className="border-b border-line bg-surface text-[11px] uppercase tracking-wide text-muted">
              <th scope="col" aria-sort={ariaSort('name')} className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => toggleSort('name')}
                  className="inline-flex items-center gap-1.5 hover:text-ink"
                >
                  Actor
                  <SortIcon className={`h-3 w-3 ${sortKey === 'name' ? 'text-accent' : 'opacity-40'}`} />
                </button>
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Affiliation
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Position (on record)
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Source
              </th>
              <th scope="col" aria-sort={ariaSort('date')} className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => toggleSort('date')}
                  className="inline-flex items-center gap-1.5 hover:text-ink"
                >
                  Date
                  <SortIcon className={`h-3 w-3 ${sortKey === 'date' ? 'text-accent' : 'opacity-40'}`} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((actor) => (
              <tr
                key={actor.id}
                className="border-b border-line last:border-0 align-top odd:bg-surface/40"
              >
                <th scope="row" className="px-4 py-4 font-semibold text-ink">
                  {actor.name}
                </th>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${stanceMeta[actor.stance].chip}`}
                    title={stanceMeta[actor.stance].label}
                  >
                    {actor.affiliation}
                  </span>
                </td>
                <td className="max-w-md px-4 py-4 text-[14px] leading-relaxed text-ink-soft">
                  {actor.position}
                </td>
                <td className="px-4 py-4">
                  <SourceBadge
                    tier={actor.sourceTier}
                    name={actor.sourceName}
                    url={actor.sourceUrl}
                    asOf={actor.date}
                    compact
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-muted">{actor.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted">
        Showing {rows.length} of {actors.length} recorded positions. This table records who said
        what — it draws no inference and asserts no link between any donation and any vote.
      </p>
    </div>
  )
}
