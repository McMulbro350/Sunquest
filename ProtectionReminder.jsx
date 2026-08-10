import { useEffect, useState } from 'react'
import { ROTATING_REMINDERS, getHighUVWarning } from '../lib/gamification'

export default function ProtectionReminder({ uv, active }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_REMINDERS.length)
    }, 15000)
    return () => clearInterval(id)
  }, [active])

  if (!active) return null

  const highWarning = getHighUVWarning(uv)
  const reminder = ROTATING_REMINDERS[index]

  return (
    <div className="stack gap-8">
      {highWarning && (
        <div
          className="card"
          style={{ background: '#fdeceb', border: '2px solid var(--coral)', margin: 0 }}
        >
          <strong style={{ color: 'var(--coral-deep)' }}>{highWarning.title}</strong>
          <p className="card-sub mt-4">{highWarning.text}</p>
        </div>
      )}

      <div className="card" style={{ margin: 0 }}>
        <p style={{ fontWeight: 700 }}>
          {reminder.icon} {reminder.text}
        </p>
      </div>
    </div>
  )
}
