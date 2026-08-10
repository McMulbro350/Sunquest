import { useEffect, useState } from 'react'
import { readLocalStorage } from './storage'

const OPENUV_KEY = import.meta.env.VITE_OPENUV_API_KEY

// Fallback used only if the browser denies/lacks geolocation, purely so the
// app has something to show in development. Swap for whatever makes sense
// for your users, or just leave the "location unavailable" state in place.
const FALLBACK_LOCATION = { lat: 40.7128, lon: -74.006, isFallback: true }

// ---------------------------------------------------------------------------
// Geolocation
// ---------------------------------------------------------------------------
export function useGeolocation() {
  const [state, setState] = useState({
    status: 'loading', // 'loading' | 'ready' | 'denied' | 'error'
    coords: null,
  })

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'denied', coords: FALLBACK_LOCATION })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: 'ready',
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude, isFallback: false },
        })
      },
      (err) => {
        console.warn('SunQuest: geolocation unavailable', err.message)
        setState({ status: 'denied', coords: FALLBACK_LOCATION })
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 }
    )
  }, [])

  return state
}

// ---------------------------------------------------------------------------
// Reverse geocoding (free, no API key) — just for a friendly place name.
// ---------------------------------------------------------------------------
async function fetchPlaceName(lat, lon) {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    )
    if (!res.ok) throw new Error('reverse geocode failed')
    const data = await res.json()
    return data.city || data.locality || data.principalSubdivision || 'Your location'
  } catch (err) {
    console.warn('SunQuest: could not resolve place name', err)
    return 'Your location'
  }
}

// ---------------------------------------------------------------------------
// Temperature (Open-Meteo, free, no API key required)
// ---------------------------------------------------------------------------
async function fetchTemperature(lat, lon) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&temperature_unit=fahrenheit`
    )
    if (!res.ok) throw new Error('weather request failed')
    const data = await res.json()
    return Math.round(data.current?.temperature_2m ?? null)
  } catch (err) {
    console.warn('SunQuest: could not fetch temperature', err)
    return null
  }
}

// ---------------------------------------------------------------------------
// UV Index (OpenUV — https://www.openuv.io/, requires a free API key)
// Falls back to a gentle synthetic curve if no key is configured yet, so the
// app is still fully explorable before you wire up a real key.
// ---------------------------------------------------------------------------
function syntheticUVCurve() {
  const hours = []
  for (let h = 6; h <= 19; h++) {
    const distanceFromNoon = Math.abs(h - 13)
    const uv = Math.max(0, Math.round((9 - distanceFromNoon * 1.3) * 10) / 10)
    hours.push({ hour: h, uv })
  }
  const current = new Date().getHours()
  const currentEntry = hours.find((h) => h.hour === current) || hours[0]
  const maxEntry = hours.reduce((a, b) => (b.uv > a.uv ? b : a), hours[0])
  return {
    current: currentEntry.uv,
    max: maxEntry.uv,
    maxHour: maxEntry.hour,
    hourly: hours,
    isSynthetic: true,
  }
}

async function fetchOpenUV(lat, lon) {
  if (!OPENUV_KEY) return syntheticUVCurve()

  try {
    const headers = { 'x-access-token': OPENUV_KEY }
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`, { headers }),
      fetch(`https://api.openuv.io/api/v1/forecast?lat=${lat}&lng=${lon}`, { headers }),
    ])

    if (!currentRes.ok) throw new Error(`OpenUV current request failed (${currentRes.status})`)
    const currentData = await currentRes.json()

    let hourly = []
    if (forecastRes.ok) {
      const forecastData = await forecastRes.json()
      hourly = (forecastData.result || []).map((entry) => {
        const d = new Date(entry.uv_time)
        return { hour: d.getHours(), uv: Math.round(entry.uv * 10) / 10 }
      })
    }

    const result = currentData.result || {}
    const maxHour = result.uv_max_time ? new Date(result.uv_max_time).getHours() : null

    return {
      current: Math.round((result.uv ?? 0) * 10) / 10,
      max: Math.round((result.uv_max ?? result.uv ?? 0) * 10) / 10,
      maxHour,
      hourly: hourly.length ? hourly : syntheticUVCurve().hourly,
      isSynthetic: false,
    }
  } catch (err) {
    console.warn('SunQuest: OpenUV request failed, using estimated curve', err)
    return syntheticUVCurve()
  }
}

// ---------------------------------------------------------------------------
// Combined hook used by the dashboard + timer screens
// ---------------------------------------------------------------------------
export function useUVData() {
  const geo = useGeolocation()
  const [data, setData] = useState(() => readLocalStorage('lastUVData', null))
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (geo.status === 'loading') return
    let cancelled = false

    async function load() {
      setStatus('loading')
      const { lat, lon } = geo.coords
      const [uv, temperature, place] = await Promise.all([
        fetchOpenUV(lat, lon),
        fetchTemperature(lat, lon),
        fetchPlaceName(lat, lon),
      ])

      if (cancelled) return

      const combined = {
        ...uv,
        temperature,
        place,
        locationDenied: geo.status === 'denied',
        fetchedAt: Date.now(),
      }

      setData(combined)
      try {
        window.localStorage.setItem('sunquest:lastUVData', JSON.stringify(combined))
      } catch {
        /* ignore storage quota errors */
      }
      setStatus('ready')
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.status])

  return { data, status, geoStatus: geo.status }
}
