import { getUVCategory } from '../lib/uv'

const CATEGORY_COLOR = {
  low: '#45b98c',
  moderate: '#f5a623',
  high: '#ff7a59',
  veryhigh: '#e8543a',
  extreme: '#b53a5b',
}

export default function HourlyUVChart({ hourly = [], loading }) {
  if (loading || !hourly.length) {
    return (
      <div className="card">
        <div className="card-title">📈 Hourly Forecast</div>
        <p className="text-soft">Loading today's UV curve…</p>
      </div>
    )
  }

  const maxUV = Math.max(...hourly.map((h) => h.uv), 1)
  const chartHeight = 120
  const barWidth = 100 / hourly.length
  const peak = hourly.reduce((a, b) => (b.uv > a.uv ? b : a), hourly[0])

  return (
    <div className="card">
      <div className="card-title">📈 Hourly Forecast</div>
      <svg viewBox={`0 0 100 ${chartHeight + 24}`} width="100%" height="150" preserveAspectRatio="none">
        {hourly.map((h, i) => {
          const barHeight = (h.uv / maxUV) * chartHeight
          const x = i * barWidth
          const isPeak = h.hour === peak.hour
          const color = CATEGORY_COLOR[getUVCategory(h.uv).key]
          return (
            <g key={h.hour}>
              <rect
                x={x + barWidth * 0.15}
                y={chartHeight - barHeight}
                width={barWidth * 0.7}
                height={Math.max(barHeight, 2)}
                rx={1.5}
                fill={color}
                opacity={isPeak ? 1 : 0.75}
              />
              {isPeak && (
                <text
                  x={x + barWidth * 0.5}
                  y={chartHeight - barHeight - 4}
                  fontSize="6"
                  textAnchor="middle"
                  fill="#1f3a4d"
                  fontWeight="700"
                >
                  {h.uv}
                </text>
              )}
              <text
                x={x + barWidth * 0.5}
                y={chartHeight + 14}
                fontSize="5.5"
                textAnchor="middle"
                fill="#93aebb"
              >
                {formatHourShort(h.hour)}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="card-sub mt-8">
        Peak UV around <strong>{formatHourShort(peak.hour)}</strong> — that's the best time to plan
        shade breaks.
      </p>
    </div>
  )
}

function formatHourShort(hour) {
  const h = hour % 24
  if (h === 0) return '12a'
  if (h === 12) return '12p'
  return h < 12 ? `${h}a` : `${h - 12}p`
}
