import { getExposureStage } from '../lib/uv'

const TONE_COLOR = {
  good: '#45b98c',
  neutral: '#f5a623',
  warn: '#ff7a59',
  danger: '#e8543a',
}

// Text-only representation kept for accessibility / screen readers,
// echoing the block-meter idea from the brief (e.g. 🟦🟦🟦⬜⬜).
function blockMeter(fraction) {
  const filled = Math.min(5, Math.round(fraction * 5))
  return '🟦'.repeat(filled) + '⬜'.repeat(5 - filled)
}

export default function ExposureMeter({ fraction = 0 }) {
  const clamped = Math.min(1.15, fraction)
  const pct = Math.min(100, Math.round(clamped * 100))
  const stage = getExposureStage(fraction)
  const color = TONE_COLOR[stage.tone]

  return (
    <div className="card text-center">
      <div className="card-title" style={{ justifyContent: 'center' }}>
        ☀️ UV Exposure
      </div>

      <div className="exposure-gauge" role="img" aria-label={`${blockMeter(fraction)} ${stage.label}`}>
        <div className="exposure-fill" style={{ height: `${pct}%`, background: color }}>
          <svg className="exposure-wave" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path
              d="M0 10 C 12.5 18, 37.5 2, 50 10 C 62.5 18, 87.5 2, 100 10 L100 20 L0 20 Z"
              fill={color}
              opacity="0.9"
            />
          </svg>
        </div>
        <div className="exposure-readout">
          <span style={{ fontSize: 22 }}>{pct}%</span>
        </div>
      </div>

      <p className="mt-12" style={{ fontWeight: 800, color }}>
        {stage.label}
      </p>
      <p className="text-faint" style={{ fontSize: 12 }} aria-hidden="true">
        {blockMeter(fraction)}
      </p>
    </div>
  )
}
