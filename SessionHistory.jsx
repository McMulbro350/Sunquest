export default function SessionHistory({ history }) {
  if (!history.length) {
    return (
      <div className="card empty-state">
        <p>🌊 No sessions yet — start your first Sun Timer session to see history here.</p>
      </div>
    )
  }

  return (
    <div className="stack gap-8">
      {history.map((entry) => (
        <div key={entry.id} className="card" style={{ margin: 0 }}>
          <div className="row-between">
            <strong>{formatDate(entry.date)}</strong>
            <span className="chip chip-good">+{entry.points} pts</span>
          </div>
          <div className="row gap-12 mt-8" style={{ flexWrap: 'wrap' }}>
            <span className="text-soft" style={{ fontSize: 13 }}>
              ⏱ {entry.durationMin} min
            </span>
            <span className="text-soft" style={{ fontSize: 13 }}>
              ☀️ avg UV {entry.avgUV}
            </span>
            <span className="text-soft" style={{ fontSize: 13 }}>
              🌴 {entry.shadeBreaks} shade break{entry.shadeBreaks === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDate(dateKey) {
  const d = new Date(`${dateKey}T00:00:00`)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
