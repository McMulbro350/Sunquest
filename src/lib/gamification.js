// ---------------------------------------------------------------------------
// Sun Points — every value here rewards a *protective* action.
// Nothing in SunQuest ever awards points for spending more time in the sun.
// ---------------------------------------------------------------------------
export const POINTS = {
  SUNSCREEN_REMINDER: 10,
  SHADE_BREAK: 10,
  WATER_LOG: 5,
  HAT_LOG: 10,
  SAFE_SESSION_END: 10, // ending a session before reaching "high exposure"
  FORECAST_CHECK: 5,
  CHALLENGE: 15,
}

// ---------------------------------------------------------------------------
// Levels — five fun summer ranks, driven purely by lifetime Sun Points
// earned from protective habits.
// ---------------------------------------------------------------------------
export const LEVELS = [
  { level: 1, name: 'Beach Rookie', min: 0, max: 100 },
  { level: 2, name: 'Sun Scout', min: 100, max: 250 },
  { level: 3, name: 'Shade Seeker', min: 250, max: 500 },
  { level: 4, name: 'Beach Pro', min: 500, max: 900 },
  { level: 5, name: 'Sun Smart Master', min: 900, max: Infinity },
]

export function getLevelProgress(points) {
  const level = LEVELS.find((l) => points < l.max) || LEVELS[LEVELS.length - 1]
  const span = level.max === Infinity ? Math.max(points - level.min, 1) : level.max - level.min
  const into = points - level.min
  const pct = level.max === Infinity ? 100 : Math.min(100, Math.round((into / span) * 100))
  return { ...level, into, span, pct }
}

// ---------------------------------------------------------------------------
// Daily challenges — a pool of 5, three are picked deterministically for
// "today" so everyone sees a fresh-feeling set without any backend.
// ---------------------------------------------------------------------------
export const CHALLENGE_POOL = [
  { id: 'check-uv-morning', icon: '☀️', title: 'Sun Smart', detail: 'Check the UV Index before noon.' },
  { id: 'shade-break', icon: '🌴', title: 'Shade Seeker', detail: 'Take one shade break.' },
  { id: 'hydration', icon: '💧', title: 'Hydration Hero', detail: 'Log three glasses of water.' },
  { id: 'sunscreen', icon: '🧴', title: 'Sunscreen Streak', detail: 'Check your sunscreen reminder.' },
  { id: 'covered-up', icon: '🧢', title: 'Covered Up', detail: 'Log a hat or protective clothing.' },
]

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date - start
  return Math.floor(diff / 86400000)
}

export function getTodaysChallenges(date = new Date()) {
  const seed = dayOfYear(date)
  const pool = [...CHALLENGE_POOL]
  const picked = []
  for (let i = 0; i < 3; i++) {
    const idx = (seed + i * 2) % pool.length
    const challenge = pool[idx]
    if (!picked.find((c) => c.id === challenge.id)) picked.push(challenge)
  }
  // Guarantee 3 unique challenges even if the modulo math collides
  for (const c of pool) {
    if (picked.length >= 3) break
    if (!picked.find((p) => p.id === c.id)) picked.push(c)
  }
  return picked
}

// ---------------------------------------------------------------------------
// Badges — computed live from stats kept in AppStateContext.
// Each badge defines a `check(stats) => { earned, progress, goal }`.
// ---------------------------------------------------------------------------
export const BADGE_DEFS = [
  {
    id: 'uv-checker',
    icon: '☀️',
    name: 'UV Checker',
    detail: 'Checked UV 5 days',
    goal: 5,
    getProgress: (stats) => stats.uvCheckDays.length,
  },
  {
    id: 'shade-master',
    icon: '🌴',
    name: 'Shade Master',
    detail: 'Took 10 shade breaks',
    goal: 10,
    getProgress: (stats) => stats.shadeBreaks,
  },
  {
    id: 'sunscreen-hero',
    icon: '🧴',
    name: 'Sunscreen Hero',
    detail: 'Logged 10 sunscreen reminders',
    goal: 10,
    getProgress: (stats) => stats.sunscreenLogs,
  },
  {
    id: 'hydration-streak',
    icon: '💧',
    name: 'Hydration Streak',
    detail: 'Logged hydration 7 days',
    goal: 7,
    getProgress: (stats) => stats.hydrationDays.length,
  },
  {
    id: 'beach-week',
    icon: '🌊',
    name: 'Beach Week',
    detail: 'Used SunQuest 7 days',
    goal: 7,
    getProgress: (stats) => stats.activeDays.length,
  },
]

export function computeBadges(stats) {
  return BADGE_DEFS.map((def) => {
    const progress = Math.min(def.goal, def.getProgress(stats) || 0)
    return { ...def, progress, earned: progress >= def.goal }
  })
}

// ---------------------------------------------------------------------------
// Protection reminders shown periodically during a session
// ---------------------------------------------------------------------------
export const ROTATING_REMINDERS = [
  { icon: '☀️', text: 'UV exposure is adding up.' },
  { icon: '🧴', text: 'Time to check your sunscreen.' },
  { icon: '🌴', text: 'A little shade break sounds good.' },
  { icon: '💧', text: 'Grab some water.' },
  { icon: '🧢', text: 'Hat check!' },
]

export function getHighUVWarning(uv) {
  if (uv < 8) return null
  return {
    title: 'VERY HIGH UV',
    text:
      'UV exposure is accumulating quickly. Consider limiting direct sun and using shade, clothing, and sunscreen.',
  }
}
