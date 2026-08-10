import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getLevelFromXP } from '../utils/medalSystem'

export default function Sidebar({ open, onClose }) {
  const { state } = useApp()
  const levelInfo = getLevelFromXP(state.totalXP)

  const totalMedals = state.challenges.reduce((sum, c) => sum + c.medalsEarned, 0)

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">🎮</div>
        <h1>پنر پرو</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
          داشبورد
        </NavLink>

        <NavLink
          to="/challenges"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
          چالش‌ها
        </NavLink>

        <NavLink
          to="/medals"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
          </svg>
          مدال‌ها
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          پروفایل
        </NavLink>
      </nav>

      <div className="sidebar-stats">
        <div className="stat-label">سطح شما</div>
        <div className="stat-value">{levelInfo.level}</div>
        <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {totalMedals} مدال کسب شده
        </div>
      </div>
    </aside>
  )
}
