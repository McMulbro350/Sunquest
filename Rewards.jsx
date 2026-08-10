import { useAppState } from '../context/AppStateContext'
import SunPoints from '../components/SunPoints'
import BadgeCard from '../components/BadgeCard'
import { LEVELS } from '../lib/gamification'

export default function Rewards() {
  const { points, badges } = useAppState()

  return (
    <div className="page">
      <h1 className="section-title">🏆 Rewards</h1>

      <SunPoints points={points} />

      <div className="card">
        <div className="card-title">🌊 Summer Ranks</div>
        <div className="stack gap-4">
          {LEVELS.map((l) => (
            <div key={l.level} className="row-between" style={{ padding: '4px 0' }}>
              <span style={{ fontSize: 13, fontWeight: points >= l.min ? 800 : 500 }}>
                Level {l.level} — {l.name}
              </span>
              <span className="text-faint" style={{ fontSize: 12 }}>
                {l.min}+ pts
              </span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="section-title" style={{ fontSize: 17 }}>
        Badges
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {badges.map((b) => (
          <BadgeCard key={b.id} badge={b} />
        ))}
      </div>
    </div>
  )
}
