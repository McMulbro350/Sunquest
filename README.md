# ☀️ SunQuest

SunQuest is a mobile-first web app that helps you understand the UV Index where you
are, track time outdoors, and build sun-safety habits — with a bit of a game layered
on top (points, levels, badges, and daily challenges).

It's built with plain React + Vite, kept intentionally simple so it's easy to read
even if you're fairly new to React.

> **Not medical advice.** Every number in this app (burn-risk minutes, exposure %,
> etc.) is a rough educational estimate, not a guarantee of a "safe" amount of sun.
> See [How the burn-risk estimate works](#how-the-burn-risk-estimate-works) below.

---

## 1. How the project works

```
src/
  main.jsx                 → mounts the app
  App.jsx                  → shows the skin-type onboarding, then the 5 tabs
  index.css                → the entire visual design system (colors, type, layout)
  context/
    AppStateContext.jsx    → the one place all shared state lives (see below)
  lib/
    storage.js              → useLocalStorage hook — all persistence goes through this
    uv.js                   → UV categories, skin-type data, burn-risk math
    uvApi.js                → geolocation + calls to the UV/weather APIs
    gamification.js         → points, levels, challenges, badges data + logic
  components/               → the 10+ reusable UI pieces (UVIndexCard, SunTimer, ...)
  pages/                     → the 5 tabs: Today, Timer, Rewards, Learn, Profile
```

**State flows one way:** `AppStateContext` holds skin type, Sun Points, lifetime
stats, badges, challenges, and session history, all backed by `localStorage`. Any
component can call `useAppState()` to read that state or call an action like
`logShadeBreak()`. The live UV/weather numbers are separate — they come from
`useUVData()` in `lib/uvApi.js`, which is not persisted (it re-fetches on load,
falling back to the last cached reading if the network is unavailable).

**The bottom nav doesn't use a router.** `App.jsx` just keeps `activeTab` in state
and renders the matching page from `pages/`. This keeps the whole app to one
dependency: React itself (plus Vite for the dev server/build).

## 2. Install dependencies

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
cd sunquest
npm install
```

## 3. Add your UV/weather API key

SunQuest uses two free APIs:

- **[OpenUV](https://www.openuv.io/)** — the actual UV Index and hourly forecast.
  This one needs a free API key.
- **[Open-Meteo](https://open-meteo.com/)** — current temperature. No key needed.
- **[BigDataCloud](https://www.bigdatacloud.com/)** reverse geocoding — turns your
  coordinates into a place name. No key needed.

To add your OpenUV key:

1. Sign up at [openuv.io](https://www.openuv.io/) and copy your API key from the
   dashboard (the free tier is enough for personal use).
2. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and paste your key:
   ```
   VITE_OPENUV_API_KEY=your_key_here
   ```
4. Restart the dev server if it was already running.

**No key yet?** The app still works — `lib/uvApi.js` falls back to a smooth
synthetic UV curve (peaking around 1pm) so you can build and click around before
you've signed up for anything. You'll see a small "estimated curve" chip on the
Today page whenever it's using that fallback.

Then run it:

```bash
npm run dev
```

and open the printed local URL (typically `http://localhost:5173`).

## 4. How localStorage is used

Everything that should survive a page refresh goes through the single
`useLocalStorage(key, defaultValue)` hook in `lib/storage.js`. It behaves exactly
like `useState`, except every update is also written to
`localStorage["sunquest:<key>"]` as JSON, and the initial value is read back out
of `localStorage` when the app loads.

Data currently stored this way:

| Key                     | What it holds                                          |
| ------------------------ | ------------------------------------------------------- |
| `skinType`               | Your chosen Fitzpatrick type (1–6)                       |
| `points`                 | Lifetime Sun Points                                      |
| `stats`                  | Shade breaks, sunscreen/hat logs, hydration & active days used for badges |
| `history`                | Every completed Sun Timer session                        |
| `challengeCompletions`   | Which daily challenges you've completed, per date         |
| `lastUVData`             | The most recent successful UV/weather fetch (used as an offline fallback) |

Because it's all `localStorage`, this data is per-browser and stays on the
device — there's no server or account system.

## 5. How the UV exposure estimate works

The **UV Index** is roughly proportional to how fast UV dose builds up on skin:
UV 10 delivers a given dose in about half the time UV 5 does. The brief for this
app gave reference burn-risk times for a Type II (fair) skin person:

| UV | ~Minutes to burn risk |
| -- | ---------------------- |
| 2  | 85                      |
| 3  | 55                      |
| 5  | 34                      |
| 7  | 24                      |
| 9  | 19                      |
| 11 | 15                      |

Those numbers fit the curve **minutes ≈ 169 ÷ UV** closely, which is exactly the
"double the UV, half the time" relationship. `lib/uv.js` uses that same formula for
every skin type, scaled by a rough multiplier per Fitzpatrick type (fairer skin →
shorter estimated time, deeper skin → longer) — see `estimateBurnRiskMinutes()`.

The **Exposure Progress Meter** on the Timer tab then works the same way: it
divides how many minutes you've been outside by that estimated burn-risk time, so
the gauge fills up in step with your actual accumulated dose, not just a flat
countdown clock.

**Important caveats baked into the design on purpose:**

- These are educational approximations, not clinical minimal-erythema-dose values —
  individual sensitivity varies a lot.
- Every skin type can experience UV damage, even ones that rarely show a visible
  burn — the copy throughout the app is written to avoid implying otherwise.
- Nothing in SunQuest ever describes a timer as a "safe tanning time." Points are
  only ever awarded for protective behavior (shade, sunscreen, hats, water,
  ending a session before high exposure) — never for spending more time in the sun.

---

## Customizing

- **Colors/type/spacing** all live as CSS variables at the top of `src/index.css`.
- **Point values, challenges, badges, and levels** are plain data objects in
  `src/lib/gamification.js` — tweak numbers there without touching any component.
- **Skin-type multipliers** are in `src/lib/uv.js` if you want to recalibrate the
  burn-risk estimate.

## Building for production

```bash
npm run build
```

Outputs a static site to `dist/`, which you can deploy anywhere that serves static
files (Netlify, Vercel, GitHub Pages, etc.).
