import { useAppState } from '../context/AppStateContext'
import { POINTS } from '../lib/gamification'

export default function DailyChallenges() {
  const { todaysChallenges, completedToday, completeChallenge } = useAppState()

  return (
    <div className="card">
      <div className="card-title">🎯 Today's Challenges</div>
      <div className="stack gap-8">
        {todaysChallenges.map((c) => {
          const done = completedToday.includes(c.id)
          return (
            <button
              key={c.id}
              onClick={() => completeChallenge(c.id)}
              disabled={done}
              className="card"
              style={{
                margin: 0,
                padding: 12,
                textAlign: 'left',
                width: '100%',
                cursor: done ? 'default' : 'pointer',
                background: done ? 'var(--leaf-pale)' : 'var(--sky-pale)',
                boxShadow: 'none',
                border: 'none',
              }}
            >
              <div className="row-between">
                <span style={{ fontWeight: 700 }}>
                  {c.icon} {c.title}
                </span>
                <span className={`chip ${done ? 'chip-good' : ''}`}>
                  {done ? 'Done ✓' : `+${POINTS.CHALLENGE}`}
                </span>
              </div>
              <p className="card-sub mt-4">{c.detail}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
