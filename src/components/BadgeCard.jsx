export default function BadgeCard({ badge }) {
  const pct = Math.round((badge.progress / badge.goal) * 100)

  return (
    <div
      className="card"
      style={{
        margin: 0,
        textAlign: 'center',
        opacity: badge.earned ? 1 : 0.55,
      }}
    >
      <div style={{ fontSize: 30 }}>{badge.icon}</div>
      <strong style={{ fontSize: 13 }}>{badge.name}</strong>
      <p className="card-sub mt-4" style={{ fontSize: 11 }}>
        {badge.detail}
      </p>
      <div className="progress-track mt-8" style={{ height: 8 }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-faint mt-4" style={{ fontSize: 11 }}>
        {badge.earned ? 'Earned!' : `${badge.progress}/${badge.goal}`}
      </p>
    </div>
  )
}
