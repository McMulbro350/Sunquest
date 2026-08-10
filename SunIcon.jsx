export function SunGraphic({ size = 96, spin = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ animation: spin ? 'sunspin 24s linear infinite' : 'none' }}
      aria-hidden="true"
    >
      <style>{`@keyframes sunspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <g stroke="#FFE9AE" strokeWidth="6" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const x1 = 50 + Math.cos(angle) * 38
          const y1 = 50 + Math.sin(angle) * 38
          const x2 = 50 + Math.cos(angle) * 48
          const y2 = 50 + Math.sin(angle) * 48
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </g>
      <circle cx="50" cy="50" r="28" fill="#FFCE54" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#F5A623" strokeWidth="2" opacity="0.4" />
    </svg>
  )
}

export function WaveDivider({ color = '#FFFFFF', flip = false }) {
  return (
    <svg
      className="wave-decoration"
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
      aria-hidden="true"
    >
      <path
        d="M0 20 C 50 40, 100 0, 150 20 C 200 40, 250 0, 300 20 C 350 40, 380 10, 400 20 L400 40 L0 40 Z"
        fill={color}
      />
    </svg>
  )
}

export function CloudShape({ size = 40, color = '#FFFFFF', opacity = 0.85 }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 60 36" aria-hidden="true">
      <g fill={color} opacity={opacity}>
        <ellipse cx="18" cy="22" rx="14" ry="10" />
        <ellipse cx="34" cy="16" rx="16" ry="13" />
        <ellipse cx="48" cy="24" rx="11" ry="8" />
        <rect x="10" y="20" width="42" height="12" rx="6" />
      </g>
    </svg>
  )
}
