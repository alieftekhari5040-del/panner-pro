'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'داشبورد', icon: '🏠' },
  { id: 'challenges', label: 'چالش‌ها', icon: '⚔️' },
  { id: 'medals', label: 'مدال‌ها', icon: '🏆' },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside
      style={{
        width: 240,
        height: '100vh',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ fontSize: 48, marginBottom: 8 }}
        >
          🎮
        </motion.div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          پنر پرو
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
          سیستم گیمیفیکیشن شخصی
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 15,
              fontWeight: activeTab === tab.id ? 600 : 400,
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  : 'transparent',
              color:
                activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: 24,
                  background: 'white',
                  borderRadius: 4,
                }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '16px',
          borderRadius: 12,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          نسخه ۱.۰.۰
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
          🌐 آفلاین فعال
        </p>
      </div>
    </aside>
  );
}
