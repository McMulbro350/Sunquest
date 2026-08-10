import { useState } from 'react'
import { AppStateProvider, useAppState } from './context/AppStateContext'
import SkinTypeSelector from './components/SkinTypeSelector'
import BottomNav from './components/BottomNav'
import Today from './pages/Today'
import Timer from './pages/Timer'
import Rewards from './pages/Rewards'
import Learn from './pages/Learn'
import Profile from './pages/Profile'

const PAGES = {
  today: Today,
  timer: Timer,
  rewards: Rewards,
  learn: Learn,
  profile: Profile,
}

function Shell() {
  const [tab, setTab] = useState('today')
  const { skinType, setSkinType } = useAppState()

  if (!skinType) {
    return (
      <div className="app-shell">
        <SkinTypeSelector onSelect={setSkinType} mode="onboarding" />
      </div>
    )
  }

  const Page = PAGES[tab]

  return (
    <div className="app-shell">
      <Page onNavigate={setTab} />
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  )
}
