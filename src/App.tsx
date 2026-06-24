import { useEffect } from 'react'
import { useHashRoute } from './lib/router'
import { Library } from './components/Library'
import { CaseFile } from './components/CaseFile'
import { Methodology } from './components/Methodology'
import { deepCaseFiles } from './data/registry'

/**
 * Route between the library landing page (`/`) and a deep case file
 * (`/bill/<id>`). The case file reads generically from a `Bill`, so a second
 * bill is a new registry entry — not new components.
 */
export default function App() {
  const route = useHashRoute()

  // Start each route at the top. `instant` overrides the global smooth-scroll CSS
  // so a route change jumps rather than animating from deep in the previous page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route])

  if (route === '/methodology') return <Methodology />

  const billMatch = route.match(/^\/bill\/(.+)$/)
  if (billMatch) {
    const entry = deepCaseFiles.find((d) => d.bill.id === billMatch[1])
    if (entry) return <CaseFile bill={entry.bill} />
  }

  return <Library />
}
