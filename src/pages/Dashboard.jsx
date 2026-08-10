import { useApp } from '../context/AppContext'
import { getLevelFromXP, MEDAL_TIERS, getRequiredTicks } from '../utils/medalSystem'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'

export default function Dashboard() {
  const { state } = useApp()
  const navigate = useNavigate()
  const levelInfo = getLevelFromXP(state.totalXP)

  const totalMedals = state.challenges.reduce((sum, c) => sum + c.medalsEarned, 0)
  const totalTicks = state.challenges.reduce((sum, c) => sum + c.totalTicks, 0)
  const activeChallenges = state.challenges.length

  // Find the challenge closest to earning a medal
  const activeChallengesWithProgress = state.challenges.map(c => {
    const required = c.currentMedalLevel <= 10
      ? getRequiredTicks(c.baseTarget, c.currentMedalLevel)
      : c.baseTarget
    const progress = c.currentMedalLevel <= 10 ? (c.currentTicks / required) * 100 : 100
    return { ...c, progress, required }
  }).sort((a, b) => b.progress - a.progress)

  return (
    <PageWrapper>
    <div>
      <div className="page-header">
        <h2>👋 خوش اومدی!</h2>
        <p>وضعیت چالش‌ها و پیشرفتت رو اینجا ببین</p>
      </div>

      {/* Level Section */}
      <div className="level-section">
        <div className="level-header">
          <div className="level-title">
            <div className="level-badge">{levelInfo.level}</div>
            <div className="level-info">
              <h3>سطح {levelInfo.level}</h3>
              <p>تجربه کل: {state.totalXP.toLocaleString('fa-IR')} XP</p>
            </div>
          </div>
          <div className="level-xp">
            {levelInfo.currentXP.toLocaleString('fa-IR')} / {levelInfo.xpForNextLevel.toLocaleString('fa-IR')} XP
          </div>
        </div>
        <div className="level-bar">
          <div
            className="level-fill"
            style={{ width: `${(levelInfo.currentXP / levelInfo.xpForNextLevel) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">⚔️</div>
          <div className="stat-info">
            <h3>{activeChallenges.toLocaleString('fa-IR')}</h3>
            <p>چالش فعال</p>
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
          <div className="stat-icon cyan">✅</div>
          <div className="stat-info">
            <h3>{totalTicks.toLocaleString('fa-IR')}</h3>
            <p>تیک زده شده</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">🔥</div>
          <div className="stat-info">
            <h3>{state.streak.toLocaleString('fa-IR')}</h3>
            <p>روز متوالی</p>
          </div>
        </div>
      </div>

      {/* Active Challenges Progress */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📊 پیشرفت چالش‌ها</h3>
          {state.challenges.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/challenges')}>
              مشاهده همه
            </button>
          )}
        </div>

        {activeChallengesWithProgress.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <h3>هنوز چالشی نداری!</h3>
            <p>اولین چالشت رو بساز و شروع کن به پیشرفت</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/challenges')}>
              ساخت چالش جدید
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeChallengesWithProgress.slice(0, 5).map(challenge => (
              <div key={challenge.id} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{challenge.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{challenge.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {challenge.currentMedalLevel <= 10
                          ? `مسیر ${MEDAL_TIERS[challenge.currentMedalLevel - 1]?.name || 'تکمیل'}`
                          : '✅ تکمیل شده'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {challenge.medalsEarned > 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', fontWeight: 600 }}>
                        {challenge.medalsEarned} 🏅
                      </span>
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {challenge.currentMedalLevel <= 10
                        ? `${challenge.currentTicks}/${challenge.required}`
                        : '✅'}
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${challenge.progress >= 100 ? 'complete' : ''}`}
                    style={{ width: `${Math.min(challenge.progress, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </PageWrapper>
  )
}
