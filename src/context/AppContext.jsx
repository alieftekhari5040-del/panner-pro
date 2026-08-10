import { createContext, useContext, useReducer, useEffect } from 'react'
import { getRequiredTicks, calculateXP, getLevelFromXP, ACHIEVEMENTS } from '../utils/medalSystem'

const AppContext = createContext(null)

const initialState = {
  challenges: [],
  totalXP: 0,
  achievements: [],
  streak: 0,
  lastActiveDate: null,
}

function loadState() {
  try {
    const saved = localStorage.getItem('panner-pro-state')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load state:', e)
  }
  return initialState
}

function saveState(state) {
  try {
    localStorage.setItem('panner-pro-state', JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state:', e)
  }
}

function checkAchievements(state) {
  const newAchievements = []
  ACHIEVEMENTS.forEach(achievement => {
    if (!state.achievements.includes(achievement.id) && achievement.condition(state)) {
      newAchievements.push(achievement)
    }
  })
  return newAchievements
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_CHALLENGE': {
      const newChallenge = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        emoji: action.payload.emoji,
        baseTarget: action.payload.baseTarget,
        currentTicks: 0,
        currentMedalLevel: 1,
        medalsEarned: 0,
        totalTicks: 0,
        createdAt: new Date().toISOString(),
        history: [],
      }
      const newState = {
        ...state,
        challenges: [...state.challenges, newChallenge],
      }
      return checkAndAddAchievements(newState)
    }

    case 'TICK_CHALLENGE': {
      const challenges = state.challenges.map(challenge => {
        if (challenge.id !== action.payload.id) return challenge
        const newTicks = challenge.currentTicks + 1
        const required = getRequiredTicks(challenge.baseTarget, challenge.currentMedalLevel)
        const newTotalTicks = challenge.totalTicks + 1

        if (newTicks >= required && challenge.currentMedalLevel <= 10) {
          // Medal earned!
          const xpEarned = calculateXP(required, challenge.currentMedalLevel)
          const newMedalsEarned = challenge.medalsEarned + 1
          const nextLevel = Math.min(challenge.currentMedalLevel + 1, 11)

          return {
            ...challenge,
            currentTicks: 0,
            currentMedalLevel: nextLevel,
            medalsEarned: newMedalsEarned,
            totalTicks: newTotalTicks,
            history: [...challenge.history, {
              medalLevel: challenge.currentMedalLevel,
              date: new Date().toISOString(),
              ticks: newTicks,
            }],
            _medalEarned: true,
            _medalLevel: challenge.currentMedalLevel,
          }
        }

        return {
          ...challenge,
          currentTicks: newTicks,
          totalTicks: newTotalTicks,
        }
      })

      // Calculate XP earned
      let xpEarned = 10 // Base XP per tick
      const completedChallenge = challenges.find(c => c._medalEarned)
      if (completedChallenge) {
        xpEarned = calculateXP(
          getRequiredTicks(completedChallenge.baseTarget, completedChallenge._medalLevel),
          completedChallenge._medalLevel
        )
      }

      // Update streak
      const today = new Date().toDateString()
      let newStreak = state.streak
      if (state.lastActiveDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (state.lastActiveDate === yesterday.toDateString()) {
          newStreak = state.streak + 1
        } else if (state.lastActiveDate !== today) {
          newStreak = 1
        }
      }

      const newState = {
        ...state,
        challenges,
        totalXP: state.totalXP + xpEarned,
        streak: newStreak,
        lastActiveDate: today,
        _xpEarned: xpEarned,
        _medalEarned: completedChallenge ? completedChallenge._medalLevel : null,
      }

      return checkAndAddAchievements(newState)
    }

    case 'UNDO_TICK': {
      const challenges = state.challenges.map(challenge => {
        if (challenge.id !== action.payload.id) return challenge
        if (challenge.currentTicks <= 0) return challenge
        return {
          ...challenge,
          currentTicks: challenge.currentTicks - 1,
          totalTicks: Math.max(0, challenge.totalTicks - 1),
        }
      })
      return { ...state, challenges }
    }

    case 'DELETE_CHALLENGE': {
      const newState = {
        ...state,
        challenges: state.challenges.filter(c => c.id !== action.payload.id),
      }
      return newState
    }

    case 'RESET_CHALLENGE': {
      const challenges = state.challenges.map(challenge => {
        if (challenge.id !== action.payload.id) return challenge
        return {
          ...challenge,
          currentTicks: 0,
          currentMedalLevel: 1,
          medalsEarned: 0,
          totalTicks: 0,
          history: [],
        }
      })
      return { ...state, challenges }
    }

    case 'ADD_ACHIEVEMENT': {
      return {
        ...state,
        achievements: [...state.achievements, action.payload.id],
      }
    }

    case 'RESET_ALL': {
      return initialState
    }

    default:
      return state
  }
}

function checkAndAddAchievements(state) {
  const newAchievements = checkAchievements(state)
  if (newAchievements.length > 0) {
    return {
      ...state,
      achievements: [...state.achievements, ...newAchievements.map(a => a.id)],
      _newAchievements: newAchievements,
    }
  }
  return state
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
