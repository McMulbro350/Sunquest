// ---------------------------------------------------------------------------
// UV Index categories (World Health Organization scale)
// ---------------------------------------------------------------------------
export const UV_CATEGORIES = [
  { max: 2, label: 'Low', key: 'low' },
  { max: 5, label: 'Moderate', key: 'moderate' },
  { max: 7, label: 'High', key: 'high' },
  { max: 10, label: 'Very High', key: 'veryhigh' },
  { max: Infinity, label: 'Extreme', key: 'extreme' },
]

export function getUVCategory(uv) {
  const safeUV = Number.isFinite(uv) ? uv : 0
  return UV_CATEGORIES.find((c) => safeUV <= c.max) || UV_CATEGORIES[UV_CATEGORIES.length - 1]
}

export function uvColorClass(uv, prefix = 'uv') {
  return `${prefix}-${getUVCategory(uv).key}`
}

// ---------------------------------------------------------------------------
// Skin type reference data (Fitzpatrick scale)
// These multipliers are rough educational approximations relative to a
// Type II reference person — NOT clinical minimal-erythema-dose values.
// ---------------------------------------------------------------------------
export const SKIN_TYPES = [
  {
    id: 1,
    name: 'Type I',
    tagline: 'Very fair skin',
    detail: 'Always burns, does not tan easily',
    multiplier: 0.6,
  },
  {
    id: 2,
    name: 'Type II',
    tagline: 'Fair skin',
    detail: 'Burns easily, tans slightly',
    multiplier: 1,
  },
  {
    id: 3,
    name: 'Type III',
    tagline: 'Medium skin',
    detail: 'Sometimes burns, gradually tans',
    multiplier: 1.5,
  },
  {
    id: 4,
    name: 'Type IV',
    tagline: 'Olive / light brown skin',
    detail: 'Rarely burns, tans easily',
    multiplier: 2.5,
  },
  {
    id: 5,
    name: 'Type V',
    tagline: 'Brown skin',
    detail: 'Very rarely burns',
    multiplier: 4,
  },
  {
    id: 6,
    name: 'Type VI',
    tagline: 'Dark brown / black skin',
    detail: 'Rarely visibly burns',
    multiplier: 6,
  },
]

export function getSkinType(id) {
  return SKIN_TYPES.find((s) => s.id === id) || SKIN_TYPES[1]
}

// ---------------------------------------------------------------------------
// Estimated burn-risk time.
//
// The reference values in the brief for a Type II person fit the curve
// minutes ≈ 169 / UV closely (2→85, 3→56, 5→34, 7→24, 9→19, 11→15),
// which matches the "UV is roughly proportional to dose rate" explanation:
// double the UV, half the time to the same dose. We reuse that same constant
// for every skin type and just scale it by the skin-type multiplier.
//
// This is explicitly a rough educational estimate, not a medical guarantee —
// every screen that shows it must carry that disclaimer.
// ---------------------------------------------------------------------------
const BASE_CONSTANT_TYPE_II = 169

export function estimateBurnRiskMinutes(uv, skinTypeId) {
  if (!uv || uv <= 0) return null
  const skin = getSkinType(skinTypeId)
  const minutes = (BASE_CONSTANT_TYPE_II / uv) * skin.multiplier
  return Math.max(5, Math.round(minutes))
}

export function formatMinutes(minutes) {
  if (minutes === null || minutes === undefined) return '—'
  if (minutes < 60) return `~${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `~${h}h` : `~${h}h ${m}m`
}

// ---------------------------------------------------------------------------
// Accumulated exposure fraction used by the Exposure Progress Meter.
// fraction = minutes already outside / estimated burn-risk minutes for the
// current UV + skin type. This is the same "dose accumulates proportionally"
// idea from the UV Strength Explanation card, applied live during a session.
// ---------------------------------------------------------------------------
export function getExposureFraction(elapsedMinutes, uv, skinTypeId) {
  const riskMinutes = estimateBurnRiskMinutes(uv, skinTypeId)
  if (!riskMinutes) return 0
  return elapsedMinutes / riskMinutes
}

export function getExposureStage(fraction) {
  if (fraction < 0.25) {
    return { key: 'low', label: 'Low accumulated exposure', tone: 'good' }
  }
  if (fraction < 0.5) {
    return { key: 'increasing', label: 'Increasing exposure', tone: 'neutral' }
  }
  if (fraction < 0.75) {
    return { key: 'high', label: 'High exposure', tone: 'warn' }
  }
  if (fraction < 1) {
    return { key: 'shade', label: 'Consider getting shade', tone: 'warn' }
  }
  return { key: 'protect', label: 'Time to protect your skin', tone: 'danger' }
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const hh = Math.floor(s / 3600)
  const mm = Math.floor((s % 3600) / 60)
  const ss = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  return hh > 0 ? `${pad(hh)}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`
}
