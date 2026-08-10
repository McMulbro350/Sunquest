import { useEffect, useState } from 'react'

const PREFIX = 'sunquest:'

/**
 * A drop-in replacement for useState that keeps its value in localStorage
 * so it survives page reloads. Every SunQuest feature (profile, points,
 * history, challenges...) is built on top of this one hook.
 */
export function useLocalStorage(key, defaultValue) {
  const fullKey = PREFIX + key

  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(fullKey)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch (err) {
      console.warn('SunQuest: could not read', fullKey, err)
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(value))
    } catch (err) {
      console.warn('SunQuest: could not save', fullKey, err)
    }
  }, [fullKey, value])

  return [value, setValue]
}

export function readLocalStorage(key, defaultValue) {
  try {
    const stored = window.localStorage.getItem(PREFIX + key)
    return stored !== null ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10) // YYYY-MM-DD
}
