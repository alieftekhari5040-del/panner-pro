import { useApp } from '../context/AppContext'
import { getLevelFromXP, MEDAL_TIERS, ACHIEVEMENTS } from '../utils/medalSystem'
import PageWrapper from '../components/PageWrapper'
import { useState } from 'react'

export default function Profile() {
  const { state, dispatch } = useApp()
  const levelInfo = getLevelFromXP(state.totalXP)

  const totalMedals = state.challenges.reduce((sum, c) => sum + c.medalsEarned, 0)
  const totalTicks = state.challenges.reduce((sum, c) => sum + c.totalTicks, 0)
  const completedChallenges = state.challenges.filter(c => c.medalsEarned >= 10).length

  const handleReset = () => {
    if (confirm('⚠️ آیا مطمئنی؟ تمام داده‌ها پاک میشن!')) {
      if (confirm('این عمل غیرقابل بازگشته! مطمئنی؟')) {
        dispatch({ type: 'RESET_ALL' })
      }
    }
  }

  const handleExport = () => {
    const data = JSON.stringify(state, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `panner-pro-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (data.challenges && Array.isArray(data.challenges)) {
            if (confirm('داده‌های فعلی با داده‌های فایل جایگزین میشن. مطمئنی؟')) {
              localStorage.setItem('panner-pro-state', JSON.stringify(data))
              window.location.reload()
            }
          } else {
            alert('فایل نامعتبر است')
          }
        } catch {
          alert('خطا در خواندن فایل')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <PageWrapper>
    <div>
      <div className="page-header">
        <h2>👤 پروفایل</h2>
        <p>آمار و اطلاعات حساب کاربری</p>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: '24px', textAlign: 'center', padding: '40px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          margin: '0 auto 16px',
          boxShadow: '0 4px 20px #7c3aed44',
        }}>
          🎮
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '4px' }}>بازیکن پنر پرو</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          سطح {levelInfo.level} — {state.totalXP.toLocaleString('fa-IR')} XP
        </p>
      </div>

      {/* Detailed Stats */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon purple">⚔️</div>
          <div className="stat-info">
            <h3>{state.challenges.length.toLocaleString('fa-IR')}</h3>
            <p>چالش ساخته شده</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🏅</div>
          <div className="stat-info">
            <h3>{totalMedals.toLocaleString('fa-IR')}</h3>
            <p>مدال کسب شده</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <h3>{totalTicks.toLocaleString('fa-IR')}</h3>
            <p>تیک زده شده</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">🏆</div>
          <div className="stat-info">
            <h3>{completedChallenges.toLocaleString('fa-IR')}</h3>
            <p>چالش تکمیل شده</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">🔥</div>
          <div className="stat-info">
            <h3>{state.streak.toLocaleString('fa-IR')}</h3>
            <p>روز متوالی</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">⭐</div>
          <div className="stat-info">
            <h3>{levelInfo.level.toLocaleString('fa-IR')}</h3>
            <p>سطح فعلی</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
          🏆 دستاوردها ({state.achievements.length}/{ACHIEVEMENTS.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = state.achievements.includes(achievement.id)
            return (
              <div
                key={achievement.id}
                className="card"
                style={{
                  padding: '16px',
                  opacity: isUnlocked ? 1 : 0.4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{achievement.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{achievement.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {achievement.description}
                  </div>
                </div>
                {isUnlocked && (
                  <span style={{ marginRight: 'auto', color: 'var(--accent-green)', fontSize: '0.75rem' }}>
                    ✅
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Medal Legend */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
          🏅 راهنمای مدال‌ها
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {MEDAL_TIERS.map(tier => (
            <div
              key={tier.key}
              className="card"
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{tier.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: tier.color }}>{tier.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  ضریب: ×{tier.multiplier}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '1rem' }}>
          💾 مدیریت داده‌ها
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          از داده‌هات بکاپ بگیر یا فایل بکاپ قبلی رو برگردون.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleExport}>
            📥 دانلود بکاپ
          </button>
          <button className="btn btn-ghost" onClick={handleImport}>
            📤 بازیابی از بکاپ
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: '#ef444433' }}>
        <h3 style={{ color: 'var(--accent-red)', marginBottom: '8px', fontSize: '1rem' }}>
          ⚠️ منطقه خطر
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          با ریست کردن، تمام داده‌ها و پیشرفت‌ها پاک میشن. قبلش بکاپ بگیر!
        </p>
        <button className="btn btn-danger" onClick={handleReset}>
          🗑️ ریست تمام داده‌ها
        </button>
      </div>
    </div>
    </PageWrapper>
  )
}
