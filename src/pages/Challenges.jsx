import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { useApp } from '../context/AppContext'
import { getRequiredTicks, MEDAL_TIERS } from '../utils/medalSystem'
import AddChallengeModal from '../components/AddChallengeModal'
import Celebration from '../components/Celebration'

const EMOJIS = ['📚', '💪', '🏃', '🎯', '✍️', '🧠', '💻', '🎨', '🎵', '🏋️', '📝', '🌱']

export default function Challenges() {
  const { state, dispatch } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [celebration, setCelebration] = useState(null)

  const handleAddChallenge = (data) => {
    dispatch({ type: 'ADD_CHALLENGE', payload: data })
    setShowModal(false)
  }

  const handleTick = (id) => {
    const prevState = state.challenges.find(c => c.id === id)
    dispatch({ type: 'TICK_CHALLENGE', payload: { id } })

    // Check if a medal was earned (we check after dispatch)
    if (prevState) {
      const required = getRequiredTicks(prevState.baseTarget, prevState.currentMedalLevel)
      if (prevState.currentTicks + 1 >= required && prevState.currentMedalLevel <= 10) {
        const medalInfo = MEDAL_TIERS[prevState.currentMedalLevel - 1]
        setCelebration({
          icon: medalInfo.icon,
          title: `مدال ${medalInfo.name} کسب شد!`,
          description: `تبریک! مدال ${medalInfo.name} برای چالش "${prevState.title}" باز شد`,
        })
      }
    }
  }

  const handleDelete = (id) => {
    if (confirm('آیا مطمئنی میخوای این چالش رو حذف کنی؟')) {
      dispatch({ type: 'DELETE_CHALLENGE', payload: { id } })
    }
  }

  return (
    <PageWrapper>
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>⚔️ چالش‌ها</h2>
          <p>چالش‌هات رو مدیریت کن و پیشرفتت رو ببین</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
          + چالش جدید
        </button>
      </div>

      {state.challenges.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>اولین چالشت رو بساز!</h3>
          <p>یک چالش تعریف کن، هدف مشخص کن و شروع کن به تیک زدن. هر بار که به هدف برسی یه مدال میگیری!</p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
            + ساخت چالش جدید
          </button>
        </div>
      ) : (
        <div className="challenges-grid">
          {state.challenges.map(challenge => {
            const required = challenge.currentMedalLevel <= 10
              ? getRequiredTicks(challenge.baseTarget, challenge.currentMedalLevel)
              : challenge.baseTarget
            const progress = challenge.currentMedalLevel <= 10
              ? (challenge.currentTicks / required) * 100
              : 100
            const isComplete = challenge.medalsEarned >= 10
            const currentMedal = challenge.currentMedalLevel <= 10
              ? MEDAL_TIERS[challenge.currentMedalLevel - 1]
              : null

            return (
              <div key={challenge.id} className="challenge-card">
                <div className="challenge-card-header">
                  <div className="challenge-card-title">
                    <span className="challenge-emoji">{challenge.emoji}</span>
                    <h3>{challenge.title}</h3>
                  </div>
                  <span className={`challenge-card-badge ${isComplete ? 'badge-completed' : 'badge-active'}`}>
                    {isComplete ? '✅ تکمیل' : '🔥 فعال'}
                  </span>
                </div>

                {challenge.description && (
                  <p className="challenge-description">{challenge.description}</p>
                )}

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    🏅 {challenge.medalsEarned}/۱۰ مدال
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    ✅ {challenge.totalTicks.toLocaleString('fa-IR')} تیک
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    🎯 پایه: {challenge.baseTarget}
                  </span>
                </div>

                {!isComplete && currentMedal && (
                  <div className="progress-section">
                    <div className="progress-header">
                      <span className="progress-label">
                        مسیر {currentMedal.icon} {currentMedal.name}
                      </span>
                      <span className="progress-count">
                        {challenge.currentTicks.toLocaleString('fa-IR')} / {required.toLocaleString('fa-IR')}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="challenge-actions">
                  {!isComplete && (
                    <button
                      className="btn btn-success tick-btn"
                      onClick={() => handleTick(challenge.id)}
                      style={{ flex: 1 }}
                    >
                      ✅ تیک
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(challenge.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <AddChallengeModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddChallenge}
          emojis={EMOJIS}
        />
      )}

      {celebration && (
        <Celebration
          {...celebration}
          onClose={() => setCelebration(null)}
        />
      )}
    </div>
    </PageWrapper>
  )
}
