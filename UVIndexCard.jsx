import { getUVCategory, uvColorClass } from '../lib/uv'

export default function UVIndexCard({ uv, max, maxHour, loading }) {
  const category = getUVCategory(uv)
  const colorClass = uvColorClass(uv)

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="card-title" style={{ justifyContent: 'center' }}>
        ☀️ UV Index
      </div>

      {loading ? (
        <p className="text-soft">Finding your local UV level…</p>
      ) : (
        <>
          <div className={`big-number ${colorClass}`} style={{ fontSize: 56 }}>
            {uv}
          </div>
          <div className={`big-number ${colorClass}`} style={{ fontSize: 20, letterSpacing: '0.04em' }}>
            {category.label.toUpperCase()}
          </div>

          <div className="row-between mt-16" style={{ textAlign: 'left' }}>
            <div>
              <div className="text-faint" style={{ fontSize: 12, fontWeight: 700 }}>
                TODAY'S MAX
              </div>
              <div style={{ fontWeight: 800 }}>{max ?? '—'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-faint" style={{ fontSize: 12, fontWeight: 700 }}>
                PEAK AROUND
              </div>
              <div style={{ fontWeight: 800 }}>
                {maxHour !== null && maxHour !== undefined ? formatHour(maxHour) : '—'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function formatHour(hour) {
  const h = hour % 24
  const period = h < 12 ? 'AM' : 'PM'
  const display = h % 12 === 0 ? 12 : h % 12
  return `${display} ${period}`
}
