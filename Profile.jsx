import { useState } from 'react'
import { useAppState } from '../context/AppStateContext'
import SkinTypeSelector from '../components/SkinTypeSelector'
import SessionHistory from '../components/SessionHistory'
import InfoBanner from '../components/InfoBanner'

export default function Profile() {
  const { skinType, setSkinType, stats, history, points } = useAppState()
  const [editingSkin, setEditingSkin] = useState(false)

  return (
    <div className="page">
      <h1 className="section-title">👤 Profile</h1>

      <div className="card">
        <div className="row-between">
          <div className="card-title" style={{ margin: 0 }}>
            👤 Skin Type
          </div>
          <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => setEditingSkin((v) => !v)}>
            {editingSkin ? 'Done' : 'Change'}
          </button>
        </div>
        {editingSkin && (
          <div className="mt-12">
            <SkinTypeSelector selected={skinType} onSelect={setSkinType} mode="settings" />
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">📊 Lifetime Stats</div>
        <div className="stack gap-8">
          <StatRow label="Sun Points" value={points} />
          <StatRow label="Shade breaks" value={stats.shadeBreaks} />
          <StatRow label="Sunscreen checks" value={stats.sunscreenLogs} />
          <StatRow label="Hat / cover-up logs" value={stats.hatLogs} />
          <StatRow label="Days active" value={stats.activeDays.length} />
        </div>
      </div>

      <h2 className="section-title" style={{ fontSize: 17 }}>
        Session History
      </h2>
      <SessionHistory history={history} />

      <InfoBanner />
    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div className="row-between">
      <span className="text-soft" style={{ fontSize: 14 }}>
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  )
}
