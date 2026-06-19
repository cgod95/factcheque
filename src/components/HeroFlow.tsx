const SOURCES = [120, 220, 330, 440, 540]
const TARGET = { x: 1080, y: 330 }
const START_X = 60

/**
 * A faint, decorative money-flow that draws itself in behind the hero — several
 * sources converging into one. Purely ornamental (aria-hidden); it sits at low
 * opacity behind the text and reduces to a static drawing when motion is off.
 */
export function HeroFlow({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 640"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <g>
        {SOURCES.map((y, i) => (
          <path
            key={i}
            pathLength={1}
            d={`M${START_X} ${y} C 500 ${y}, 640 ${TARGET.y}, ${TARGET.x} ${TARGET.y}`}
            stroke="var(--color-accent)"
            strokeWidth={2}
            className="flow-draw"
            style={{ animationDelay: `${i * 180}ms` }}
          />
        ))}
      </g>
      {SOURCES.map((y, i) => (
        <circle key={`s-${i}`} cx={START_X} cy={y} r={5} fill="var(--color-accent)" />
      ))}
      <circle cx={TARGET.x} cy={TARGET.y} r={9} fill="var(--color-ink)" />
    </svg>
  )
}
