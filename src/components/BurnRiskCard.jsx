import { estimateBurnRiskMinutes, formatMinutes, getSkinType } from '../lib/uv'

export default function BurnRiskCard({ uv, skinTypeId }) {
  const minutes = estimateBurnRiskMinutes(uv, skinTypeId)
  const skin = getSkinType(skinTypeId)

  return (
    <div className="card">
      <div className="card-title">🩹 Estimated Burn Risk</div>
      <p className="card-sub">
        For <strong>{skin.name}</strong> skin at the current UV level:
      </p>
      <div className="big-number uv-high" style={{ fontSize: 34, marginTop: 8 }}>
        {formatMinutes(minutes)}
      </div>
      <p className="card-sub mt-8">until visible sunburn risk rises — a rough estimate, not a countdown to a "safe" limit.</p>

      <div
        className="mt-12"
        style={{ background: '#fff1e6', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}
      >
        <strong style={{ fontSize: 13 }}>Important:</strong>
        <p className="card-sub mt-4" style={{ margin: 0 }}>
          This is only a rough educational estimate. Skin damage begins before visible sunburn, and
          individual sensitivity varies significantly.
        </p>
      </div>
    </div>
  )
}
