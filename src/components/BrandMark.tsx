/**
 * The Factcheque mark: two sources converging into one — the money-flow motif
 * that runs through the product (Sankey, network, favicon). Theme-aware via
 * tokens, so it adapts in light and dark.
 */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 9 C 16 9, 14 16, 24 16"
        stroke="var(--color-ink-soft)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 23 C 16 23, 14 16, 24 16"
        stroke="var(--color-accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="7" cy="9" r="3" fill="var(--color-ink)" />
      <circle cx="7" cy="23" r="3" fill="var(--color-accent)" />
      <circle cx="24" cy="16" r="3.4" fill="var(--color-ink)" />
    </svg>
  )
}
