import { SKIN_TYPES } from '../lib/uv'
import { SunGraphic } from './SunIcon'

export default function SkinTypeSelector({ selected, onSelect, mode = 'settings' }) {
  const isOnboarding = mode === 'onboarding'

  return (
    <div className={isOnboarding ? 'page' : ''}>
      {isOnboarding && (
        <div className="text-center" style={{ padding: '18px 0 6px' }}>
          <SunGraphic size={80} />
          <h1 className="section-title" style={{ marginTop: 12 }}>
            Welcome to SunQuest
          </h1>
          <p className="card-sub" style={{ marginTop: 6 }}>
            First, pick the skin type that best matches yours. This helps SunQuest give you more
            personal burn-risk estimates.
          </p>
        </div>
      )}

      <div className="stack gap-12 mt-12">
        {SKIN_TYPES.map((type) => {
          const isActive = selected === type.id
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className="card"
              style={{
                textAlign: 'left',
                border: isActive ? '2px solid var(--sky-deep)' : '2px solid transparent',
                cursor: 'pointer',
                margin: 0,
                width: '100%',
              }}
            >
              <div className="row-between">
                <strong style={{ fontFamily: 'var(--font-display)' }}>{type.name}</strong>
                {isActive && <span className="chip chip-good">Selected</span>}
              </div>
              <p className="card-sub mt-8">
                {type.tagline} — {type.detail}
              </p>
            </button>
          )
        })}
      </div>

      <p className="card-sub text-center mt-16" style={{ padding: '0 8px' }}>
        Skin type changes how quickly visible sunburn may occur, but every skin type can
        experience UV damage.
      </p>
    </div>
  )
}
