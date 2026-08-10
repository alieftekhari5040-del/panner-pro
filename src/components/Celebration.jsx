import { useEffect, useState } from 'react'

export default function Celebration({ icon, title, description, onClose }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate confetti particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 1,
      color: ['#ffd700', '#ff6b6b', '#7c3aed', '#3b82f6', '#10b981', '#ec4899'][
        Math.floor(Math.random() * 6)
      ],
      size: 6 + Math.random() * 8,
      emoji: ['✨', '⭐', '🎉', '🏅', '💫'][Math.floor(Math.random() * 5)],
    }))
    setParticles(newParticles)

    const timer = setTimeout(() => {
      onClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="celebration-overlay" onClick={onClose}>
      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      <div className="celebration-card" onClick={e => e.stopPropagation()}>
        <div className="celebration-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="btn btn-primary btn-lg" onClick={onClose}>
          🎉 عالیه!
        </button>
      </div>
    </div>
  )
}
