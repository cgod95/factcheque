/**
 * Tolerant date-key parser for sorting human "as of" strings such as
 * "May 2026", "2026", "Dec 2023", "Q4 2025" or "second reading, 2026".
 *
 * Returns a comparable number (roughly year * 100 + month). Strings without a
 * recognisable year sort last.
 */
const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

export function dateSortKey(input: string): number {
  const lower = input.toLowerCase()

  const yearMatch = lower.match(/\b(19|20)\d{2}\b/)
  if (!yearMatch) return -Infinity
  const year = Number(yearMatch[0])

  // Quarter, e.g. "q4 2025" → month 12
  const quarter = lower.match(/\bq([1-4])\b/)
  if (quarter) return year * 100 + Number(quarter[1]) * 3

  // Named month, e.g. "dec 2023"
  for (const [name, num] of Object.entries(MONTHS)) {
    if (lower.includes(name)) return year * 100 + num
  }

  return year * 100 // year only — sorts at the start of its year
}
