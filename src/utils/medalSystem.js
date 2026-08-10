// Medal System - 10 tiers for each challenge
export const MEDAL_TIERS = [
  { level: 1, name: 'برنزی', key: 'bronze', icon: '🥉', color: '#cd7f32', multiplier: 1 },
  { level: 2, name: 'نقره‌ای', key: 'silver', icon: '🥈', color: '#c0c0c0', multiplier: 1.5 },
  { level: 3, name: 'طلایی', key: 'gold', icon: '🥇', color: '#ffd700', multiplier: 2 },
  { level: 4, name: 'پلاتینیوم', key: 'platinum', icon: '💎', color: '#e5e4e2', multiplier: 2.5 },
  { level: 5, name: 'الماس', key: 'diamond', icon: '💠', color: '#b9f2ff', multiplier: 3 },
  { level: 6, name: 'استاد', key: 'master', icon: '👑', color: '#ff6b6b', multiplier: 4 },
  { level: 7, name: 'افسانه‌ای', key: 'legendary', icon: '🔥', color: '#ff8c00', multiplier: 5 },
  { level: 8, name: 'اسطوره‌ای', key: 'mythic', icon: '⚡', color: '#9b59b6', multiplier: 6 },
  { level: 9, name: 'الهی', key: 'divine', icon: '✨', color: '#00ffcc', multiplier: 8 },
  { level: 10, name: 'نهایی', key: 'ultimate', icon: '🏆', color: '#ff00ff', multiplier: 10 },
]

// Calculate required ticks for each medal level based on base target
export function getRequiredTicks(baseTarget, level) {
  const tier = MEDAL_TIERS[level - 1]
  return Math.ceil(baseTarget * tier.multiplier)
}

// Get medal tier info
export function getMedalTier(level) {
  return MEDAL_TIERS[level - 1] || null
}

// Calculate XP earned
export function calculateXP(ticks, medalLevel) {
  const baseXP = 10
  const levelBonus = medalLevel * 5
  return (baseXP + levelBonus) * ticks
}

// Level thresholds
export function getLevelFromXP(totalXP) {
  let level = 1
  let xpForNext = 100
  let xpForCurrent = 0

  while (totalXP >= xpForNext) {
    xpForCurrent = xpForNext
    level++
    xpForNext = Math.floor(100 * Math.pow(1.5, level - 1))
  }

  return {
    level,
    currentXP: totalXP - xpForCurrent,
    xpForNextLevel: xpForNext - xpForCurrent,
    totalXP,
  }
}

// Achievement definitions
export const ACHIEVEMENTS = [
  { id: 'first_challenge', name: 'شروع سفر', icon: '🌱', description: 'اولین چالشت رو بساز', condition: (state) => state.challenges.length >= 1 },
  { id: 'five_challenges', name: 'چالش‌جو', icon: '⚔️', description: '۵ چالش بساز', condition: (state) => state.challenges.length >= 5 },
  { id: 'first_medal', name: 'اولین مدال', icon: '🥉', description: 'اولین مدالت رو بگیر', condition: (state) => state.challenges.some(c => c.medalsEarned >= 1) },
  { id: 'bronze_master', name: 'استاد برنز', icon: '🏅', description: '۵ مدال برنزی بگیر', condition: (state) => state.challenges.filter(c => c.medalsEarned >= 1).length >= 5 },
  { id: 'silver_collector', name: 'جمع‌آور نقره', icon: '🥈', description: '۳ مدال نقره‌ای بگیر', condition: (state) => state.challenges.filter(c => c.medalsEarned >= 2).length >= 3 },
  { id: 'gold_hunter', name: 'شکارچی طلا', icon: '🥇', description: '۲ مدال طلایی بگیر', condition: (state) => state.challenges.filter(c => c.medalsEarned >= 3).length >= 2 },
  { id: 'diamond_achieve', name: 'الماس‌نشان', icon: '💎', description: 'یک مدال الماس بگیر', condition: (state) => state.challenges.some(c => c.medalsEarned >= 5) },
  { id: 'ultimate_champion', name: 'قهرمان نهایی', icon: '🏆', description: 'یک مسیر مدال کامل کن', condition: (state) => state.challenges.some(c => c.medalsEarned >= 10) },
  { id: 'hundred_ticks', name: 'پشتکار', icon: '💪', description: '۱۰۰ تیک بزن', condition: (state) => state.challenges.reduce((sum, c) => sum + c.totalTicks, 0) >= 100 },
  { id: 'thousand_ticks', name: 'افسانه‌ای', icon: '🌟', description: '۱۰۰۰ تیک بزن', condition: (state) => state.challenges.reduce((sum, c) => sum + c.totalTicks, 0) >= 1000 },
  { id: 'level_5', name: 'سطح ۵', icon: '⭐', description: 'به سطح ۵ برس', condition: (state) => getLevelFromXP(state.totalXP).level >= 5 },
  { id: 'level_10', name: 'سطح ۱۰', icon: '🌟', description: 'به سطح ۱۰ برس', condition: (state) => getLevelFromXP(state.totalXP).level >= 10 },
]
