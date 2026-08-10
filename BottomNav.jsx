const ITEMS = [
  { key: 'today', icon: '☀️', label: 'Today' },
  { key: 'timer', icon: '⏱', label: 'Timer' },
  { key: 'rewards', icon: '🏆', label: 'Rewards' },
  { key: 'learn', icon: '📚', label: 'Learn' },
  { key: 'profile', icon: '👤', label: 'Profile' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          className={`nav-item ${active === item.key ? 'active' : ''}`}
          onClick={() => onChange(item.key)}
          aria-current={active === item.key}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
