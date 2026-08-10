import { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage, todayKey } from '../lib/storage'
import { POINTS, computeBadges, getTodaysChallenges } from '../lib/gamification'

const AppStateCtx = createContext(null)

const DEFAULT_STATS = {
  shadeBreaks: 0,
  sunscreenLogs: 0,
  hatLogs: 0,
  hydrationDays: [],
  uvCheckDays: [],
  activeDays: [],
}

export function AppStateProvider({ children }) {
  const [skinType, setSkinType] = useLocalStorage('skinType', null)
  const [points, setPoints] = useLocalStorage('points', 0)
  const [stats, setStats] = useLocalStorage('stats', DEFAULT_STATS)
  const [history, setHistory] = useLocalStorage('history', [])
  const [challengeCompletions, setChallengeCompletions] = useLocalStorage('challengeCompletions', {})

  // Mark today as "active" once per session load.
  useEffect(() => {
    const key = todayKey()
    setStats((s) => (s.activeDays.includes(key) ? s : { ...s, activeDays: [...s.activeDays, key] }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addPoints(amount) {
    setPoints((p) => p + amount)
  }

  function logUVCheck() {
    const key = todayKey()
    if (stats.uvCheckDays.includes(key)) return
    setStats((s) => ({ ...s, uvCheckDays: [...s.uvCheckDays, key] }))
    addPoints(POINTS.FORECAST_CHECK)
  }

  function logShadeBreak() {
    setStats((s) => ({ ...s, shadeBreaks: s.shadeBreaks + 1 }))
    addPoints(POINTS.SHADE_BREAK)
  }

  function logSunscreen() {
    setStats((s) => ({ ...s, sunscreenLogs: s.sunscreenLogs + 1 }))
    addPoints(POINTS.SUNSCREEN_REMINDER)
  }

  function logHat() {
    setStats((s) => ({ ...s, hatLogs: s.hatLogs + 1 }))
    addPoints(POINTS.HAT_LOG)
  }

  function logWater() {
    const key = todayKey()
    setStats((s) => ({
      ...s,
      hydrationDays: s.hydrationDays.includes(key) ? s.hydrationDays : [...s.hydrationDays, key],
    }))
    addPoints(POINTS.WATER_LOG)
  }

  const todaysChallenges = useMemo(() => getTodaysChallenges(), [])
  const completedToday = challengeCompletions[todayKey()] || []

  function completeChallenge(id) {
    const key = todayKey()
    const done = challengeCompletions[key] || []
    if (done.includes(id)) return
    setChallengeCompletions((c) => ({ ...c, [key]: [...done, id] }))
    addPoints(POINTS.CHALLENGE)
  }

  function addSessionToHistory(entry) {
    setHistory((h) => [entry, ...h].slice(0, 100))
  }

  const badges = useMemo(() => computeBadges(stats), [stats])

  const value = {
    skinType,
    setSkinType,
    points,
    addPoints,
    stats,
    history,
    addSessionToHistory,
    badges,
    todaysChallenges,
    completedToday,
    completeChallenge,
    logUVCheck,
    logShadeBreak,
    logSunscreen,
    logHat,
    logWater,
  }

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateCtx)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
