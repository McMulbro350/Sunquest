import { getLevelProgress } from '../lib/gamification'

export default function SunPoints({ points }) {
  const level = getLevelProgress(points)

  return (
    <div className="card">
      <div className="row-between">
        <div className="card-title" style={{ margin: 0 }}>
          🏆 {level.name.toUpperCase()}
        </div>
        <span className="chip">{points} pts</span>
      </div>
      <div className="progress-track mt-12">
        <div className="progress-fill" style={{ width: `${level.pct}%` }} />
      </div>
      <p className="card-sub mt-8">
        {level.max === Infinity
          ? `${points} lifetime Sun Points — top rank reached!`
          : `${level.into} / ${level.span} points to Level ${level.level + 1}`}
      </p>
    </div>
  )
}
