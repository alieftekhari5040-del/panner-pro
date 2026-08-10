import { useApp } from '../context/AppContext'
import PageWrapper from '../components/PageWrapper'
import { MEDAL_TIERS, getRequiredTicks } from '../utils/medalSystem'

export default function Medals() {
  const { state } = useApp()

  if (state.challenges.length === 0) {
    return (
      <PageWrapper>
      <div>
        <div className="page-header">
          <h2>🏅 مدال‌ها</h2>
          <p>مجموعه مدال‌های کسب شده</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🏅</div>
          <h3>هنوز مدالی نداری!</h3>
          <p>چالش بساز و با تیک زدن، مدال‌های مختلف کسب کن. هر چالش ۱۰ سطح مدال داره!</p>
        </div>
      </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
    <div>
      <div className="page-header">
        <h2>🏅 مدال‌ها</h2>
        <p>مجموعه مدال‌های هر چالش. با تکمیل ۱۰ مدال، حاشیه طلایی فعال میشه!</p>
      </div>

      <div className="medals-container">
        {state.challenges.map(challenge => {
          const isFullyComplete = challenge.medalsEarned >= 10

          return (
            <div
              key={challenge.id}
              className={`medal-track ${isFullyComplete ? 'golden-border' : ''}`}
            >
              <div className="medal-track-header">
                <div className="medal-track-title">
                  <span className="track-emoji">{challenge.emoji}</span>
                  <div>
                    <h3>{challenge.title}</h3>
                    <div className="medal-track-subtitle">
                      {challenge.medalsEarned} از ۱۰ مدال کسب شده
                      {isFullyComplete && ' — ✨ تکمیل شده!'}
                    </div>
                  </div>
                </div>
                {isFullyComplete && (
                  <div className="completed-badge">
                    <span>✨</span>
                    تکمیل شده
                  </div>
                )}
              </div>

              <div className="medals-grid">
                {MEDAL_TIERS.map((tier, index) => {
                  const isUnlocked = index < challenge.medalsEarned
                  const isCurrent = index === challenge.medalsEarned && !isFullyComplete
                  const required = getRequiredTicks(challenge.baseTarget, tier.level)

                  return (
                    <div
                      key={tier.key}
                      className={`medal-slot medal-${tier.key} ${
                        isUnlocked ? 'unlocked' : isCurrent ? 'locked current' : 'locked'
                      }`}
                      title={
                        isUnlocked
                          ? `${tier.name} - کسب شده!`
                          : isCurrent
                          ? `${tier.name} - ${challenge.currentTicks}/${required} تیک`
                          : `${tier.name} - قفل`
                      }
                    >
                      <div className="medal-icon">{tier.icon}</div>
                      <div className="medal-name">{tier.name}</div>
                      {isCurrent && (
                        <div className="medal-level">
                          {challenge.currentTicks}/{required}
                        </div>
                      )}
                      {!isUnlocked && !isCurrent && (
                        <div className="medal-level">🔒</div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Medal History */}
              {challenge.history.length > 0 && (
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    📜 تاریخچه مدال‌ها
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {challenge.history.map((h, i) => {
                      const tier = MEDAL_TIERS[h.medalLevel - 1]
                      return (
                        <span
                          key={i}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.7rem',
                            background: '#ffffff08',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          {tier?.icon} {tier?.name} — {new Date(h.date).toLocaleDateString('fa-IR')}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
    </PageWrapper>
  )
}
