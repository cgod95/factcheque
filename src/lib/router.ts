import { useEffect, useState } from 'react'

/**
 * Minimal dependency-free hash router. We use the hash (not the path) so the site
 * deploys to any static host without server rewrites, and so deep links survive a
 * refresh. Routes: `/` (library) and `/bill/<id>` (a case file).
 *
 * Note: in-page section anchors must NOT change the hash (they call
 * scrollIntoView instead) — the hash belongs to the router.
 */
function currentRoute(): string {
  return window.location.hash.replace(/^#/, '') || '/'
}

export function useHashRoute(): string {
  const [route, setRoute] = useState(currentRoute)
  useEffect(() => {
    const onChange = () => setRoute(currentRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
