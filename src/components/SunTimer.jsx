import { useEffect, useRef, useState } from 'react'
import { useAppState } from '../context/AppStateContext'
import { POINTS } from '../lib/gamification'
import { formatClock, getExposureFraction, getUVCategory } from '../lib/uv'
import { todayKey } from '../lib/storage'
import ExposureMeter from './ExposureMeter'
import ProtectionReminder from './ProtectionReminder'
import SmartSuggestion from './SmartSuggestion'

export default function SunTimer({ uv, skinTypeId }) {
  const { logShadeBreak, logSunscreen, logHat, logWater, addSessionToHistory, addPoints } = useAppState()

  const [status, setStatus] = useState('idle') // idle | running | paused
  const [elapsedMs, setElapsedMs] = useState(0)
  const [lastSummary, setLastSummary] = useState(null)

  const startRef = useRef(null)
  const pauseStartRef = useRef(null)
  const pausedTotalRef = useRef(0)
  const uvSamplesRef = useRef([])
  const sessionRef = useRef({ shade: 0, sunscreen: 0, hat: 0, water: 0, points: 0 })

  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current - pausedTotalRef.current)
      uvSamplesRef.current.push(uv)
    }, 1000)
    return () => clearInterval(id)
  }, [status, uv])

  const elapsedMinutes = elapsedMs / 60000
  const fraction = getExposureFraction(elapsedMinutes, uv, skinTypeId)

  function start() {
    startRef.current = Date.now()
    pausedTotalRef.current = 0
    uvSamplesRef.current = [uv]
    sessionRef.current = { shade: 0, sunscreen: 0, hat: 0, water: 0, points: 0 }
    setElapsedMs(0)
    setLastSummary(null)
    setStatus('running')
  }

  function pause() {
    pauseStartRef.current = Date.now()
    setStatus('paused')
  }

  function resume() {
    pausedTotalRef.current += Date.now() - pauseStartRef.current
    setStatus('running')
  }

  function end() {
    const samples = uvSamplesRef.current.length ? uvSamplesRef.current : [uv]
    const avgUV = samples.reduce((a, b) => a + b, 0) / samples.length
    const durationMin = Math.max(1, Math.round(elapsedMinutes))

    let earned = sessionRef.current.points
    if (fraction < 0.75) {
      earned += POINTS.SAFE_SESSION_END
      addPoints(POINTS.SAFE_SESSION_END)
    }

    const entry = {
      id: `${Date.now()}`,
      date: todayKey(),
      durationMin,
      avgUV: Math.round(avgUV * 10) / 10,
      shadeBreaks: sessionRef.current.shade,
      points: earned,
    }
    addSessionToHistory(entry)
    setLastSummary(entry)
    setStatus('idle')
    setElapsedMs(0)
  }

  function withSessionLog(kind, points, action) {
    sessionRef.current[kind] += 1
    sessionRef.current.points += points
    action()
  }

  if (status === 'idle') {
    return (
      <div className="stack gap-12">
        <SmartSuggestion uv={uv} />
        {lastSummary && (
          <div className="card" style={{ background: 'var(--leaf-pale)' }}>
            <strong>Session saved 🌊</strong>
            <p className="card-sub mt-4">
              {lastSummary.durationMin} min outside, avg UV {lastSummary.avgUV}, +{lastSummary.points}{' '}
              points.
            </p>
          </div>
        )}
        <button className="btn btn-primary" onClick={start} style={{ padding: '20px' }}>
          ☀️ Start Sun Timer
        </button>
      </div>
    )
  }

  return (
    <div className="stack gap-12">
      <div className="card text-center">
        <div className="card-title" style={{ justifyContent: 'center' }}>
          Sun Session
        </div>
        <div className="big-number" style={{ fontSize: 42 }}>
          {formatClock(elapsedMs / 1000)}
        </div>
        <div className="stack gap-8 mt-12" style={{ textAlign: 'left' }}>
          <StatLine label="Current UV" value={uv} />
          <StatLine label="Session UV Exposure" value={getUVCategory(uv).label} />
          <StatLine label="Suggested protection" value="SPF 30+, shade, hat" />
        </div>

        <div className="btn-row mt-16">
          {status === 'running' ? (
            <button className="btn btn-secondary" onClick={pause}>
              ⏸ Pause
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={resume}>
              ▶ Resume
            </button>
          )}
          <button className="btn btn-danger" onClick={end}>
            ⏹ End Session
          </button>
        </div>
      </div>

      <ExposureMeter fraction={fraction} />

      <ProtectionReminder uv={uv} active={status === 'running'} />

      <div className="card">
        <div className="card-title">Log this session</div>
        <div className="stack gap-8">
          <LogButton
            icon="🌴"
            label="Shade break"
            points={POINTS.SHADE_BREAK}
            onClick={() => withSessionLog('shade', POINTS.SHADE_BREAK, logShadeBreak)}
          />
          <LogButton
            icon="🧴"
            label="Sunscreen check"
            points={POINTS.SUNSCREEN_REMINDER}
            onClick={() => withSessionLog('sunscreen', POINTS.SUNSCREEN_REMINDER, logSunscreen)}
          />
          <LogButton
            icon="🧢"
            label="Hat / covered up"
            points={POINTS.HAT_LOG}
            onClick={() => withSessionLog('hat', POINTS.HAT_LOG, logHat)}
          />
          <LogButton
            icon="💧"
            label="Glass of water"
            points={POINTS.WATER_LOG}
            onClick={() => withSessionLog('water', POINTS.WATER_LOG, logWater)}
          />
        </div>
      </div>
    </div>
  )
}

function StatLine({ label, value }) {
  return (
    <div className="row-between">
      <span className="text-faint" style={{ fontSize: 12, fontWeight: 700 }}>
        {label.toUpperCase()}
      </span>
      <span style={{ fontWeight: 800 }}>{value}</span>
    </div>
  )
}

function LogButton({ icon, label, points, onClick }) {
  return (
    <button className="btn btn-ghost" onClick={onClick} style={{ justifyContent: 'space-between' }}>
      <span>
        {icon} {label}
      </span>
      <span className="chip chip-good">+{points}</span>
    </button>
  )
}
