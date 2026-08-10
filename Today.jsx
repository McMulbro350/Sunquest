import { useEffect, useState } from 'react'
import { useAppState } from '../context/AppStateContext'
import { useUVData } from '../lib/uvApi'
import UVIndexCard from '../components/UVIndexCard'
import HourlyUVChart from '../components/HourlyUVChart'
import BurnRiskCard from '../components/BurnRiskCard'
import DailyChallenges from '../components/DailyChallenges'
import InfoBanner from '../components/InfoBanner'
import { WaveDivider, CloudShape } from '../components/SunIcon'

export default function Today({ onNavigate }) {
  const { skinType, logUVCheck } = useAppState()
  const { data, status } = useUVData()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (status === 'ready') logUVCheck()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const loading = status === 'loading' || !data

  return (
    <div>
      <div className="hero-header">
        <div style={{ position: 'absolute', top: 14, right: 16, opacity: 0.9 }}>
          <CloudShape size={44} />
        </div>
        <div className="hero-top-row">
          <span className="hero-location">📍 {loading ? 'Locating…' : data.place}</span>
          <span className="hero-time">
            {now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
        <div className="text-center mt-16" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 34, fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {loading || data.temperature === null ? '--°' : `${data.temperature}°`}
          </div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Current temperature</div>
        </div>
        <WaveDivider />
      </div>

      <div className="page" style={{ paddingTop: 24 }}>
        {data?.isSynthetic && (
          <div className="chip chip-warn mt-8" style={{ marginBottom: 12 }}>
            Showing an estimated curve — add an OpenUV API key for live data
          </div>
        )}

        <UVIndexCard uv={loading ? 0 : data.current} max={data?.max} maxHour={data?.maxHour} loading={loading} />

        <div className="card">
          <div className="card-title">🔎 What does UV mean?</div>
          <p className="card-sub">
            The UV Index measures the strength of ultraviolet radiation reaching your skin. Higher
            UV numbers mean your skin receives UV radiation more quickly.
          </p>
          <p className="card-sub mt-8">
            The scale is roughly proportional — UV 10 is roughly twice as intense as UV 5, so the
            same UV dose can accumulate in about half the time.
          </p>
        </div>

        <BurnRiskCard uv={loading ? 0 : data.current} skinTypeId={skinType} />

        <HourlyUVChart hourly={data?.hourly} loading={loading} />

        <DailyChallenges />

        <button className="btn btn-primary" onClick={() => onNavigate('timer')}>
          ☀️ Start Sun Timer
        </button>

        <InfoBanner />
      </div>
    </div>
  )
}
