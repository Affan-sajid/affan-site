import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Writings', to: '/writings' },
  { label: 'Features', to: '/features' },
]

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

export default function Header({ light, onToggleLight }) {
  const muted = light ? '#999' : '#3d3d3d'
  const active = light ? '#111' : '#e8e8e8'
  const hover = light ? '#444' : '#888'

  return (
    <header className="w-full">
      <div className="max-w-2xl mx-auto px-8 pt-24 mb-14 flex items-center gap-7">
        {/* Photo */}
        <div
          className={`relative shrink-0 w-20 h-20 rounded-full overflow-hidden border ${light ? 'bg-[#e5e5e2] border-[#d0d0cc]' : 'bg-[#1c1c1c] border-[#2a2a2a]'}`}
        >
          <img
            src="/IMG_4176.jpeg"
            alt="Affan"
            className="absolute left-1/2 top-1/2 h-[112%] w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>

        {/* Nav */}
        <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 flex-1">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-2 py-0.5 text-[12px] uppercase tracking-widest transition-colors ${
                  isActive
                    ? `font-bold underline underline-offset-4 decoration-2`
                    : 'hover:opacity-70'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? active : muted,
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Light/dark toggle */}
        <button
          onClick={onToggleLight}
          aria-label="Toggle light mode"
          className={`shrink-0 p-2 rounded-full transition-colors ${light ? 'text-[#555] hover:text-[#111]' : 'text-[#444] hover:text-[#aaa]'}`}
        >
          {light ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  )
}
