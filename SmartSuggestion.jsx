import { getUVCategory } from '../lib/uv'

export default function SmartSuggestion({ uv }) {
  const category = getUVCategory(uv)
  const isStrong = uv >= 8

  return (
    <div className="card" style={{ background: isStrong ? '#fdeceb' : 'var(--sky-pale)' }}>
      <div className="row-between">
        <span className="text-faint" style={{ fontSize: 12, fontWeight: 700 }}>
          CURRENT UV
        </span>
        <span className={`chip ${isStrong ? 'chip-warn' : 'chip-good'}`}>
          {uv} — {category.label.toUpperCase()}
        </span>
      </div>
      <p className="mt-8" style={{ fontWeight: 700, fontSize: 14 }}>
        SunQuest suggestion
      </p>
      <p className="card-sub mt-4">
        {isStrong
          ? 'UV radiation is very strong right now. If possible, consider going outside later when UV levels are lower.'
          : 'UV exposure is lower right now, but sun protection can still be useful during extended outdoor time.'}
      </p>
    </div>
  )
}
