import { Challenge, MedalCollection, UserStats } from '@/types';

const CHALLENGES_KEY = 'gamification_challenges';
const MEDALS_KEY = 'gamification_medals';
const STATS_KEY = 'gamification_stats';

// Challenges
export function getChallenges(): Challenge[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(CHALLENGES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveChallenges(challenges: Challenge[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
}

export function addChallenge(challenge: Challenge): void {
  const challenges = getChallenges();
  challenges.push(challenge);
  saveChallenges(challenges);
}

export function updateChallenge(updated: Challenge): void {
  const challenges = getChallenges();
  const index = challenges.findIndex(c => c.id === updated.id);
  if (index !== -1) {
    challenges[index] = updated;
    saveChallenges(challenges);
  }
}

export function deleteChallenge(id: string): void {
  const challenges = getChallenges().filter(c => c.id !== id);
  saveChallenges(challenges);
}

// Medals
export function getMedalCollections(): MedalCollection[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MEDALS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMedalCollections(collections: MedalCollection[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEDALS_KEY, JSON.stringify(collections));
}

export function getMedalCollection(challengeId: string): MedalCollection | null {
  const collections = getMedalCollections();
  return collections.find(c => c.challengeId === challengeId) || null;
}

export function addMedalToCollection(challengeId: string, tier: string): void {
  const collections = getMedalCollections();
  let collection = collections.find(c => c.challengeId === challengeId);
  
  if (!collection) {
    collection = { challengeId, earnedMedals: [], isGolden: false };
    collections.push(collection);
  }
  
  if (!collection.earnedMedals.includes(tier as any)) {
    collection.earnedMedals.push(tier as any);
  }
  
  if (collection.earnedMedals.length >= 10) {
    collection.isGolden = true;
  }
  
  saveMedalCollections(collections);
}

// Stats
export function getStats(): UserStats {
  if (typeof window === 'undefined') {
    return {
      totalChallenges: 0,
      totalMedalsEarned: 0,
      totalPartsCompleted: 0,
      goldenCollections: 0,
      streakDays: 0,
      lastActiveDate: '',
    };
  }
  const data = localStorage.getItem(STATS_KEY);
  return data
    ? JSON.parse(data)
    : {
        totalChallenges: 0,
        totalMedalsEarned: 0,
        totalPartsCompleted: 0,
        goldenCollections: 0,
        streakDays: 0,
        lastActiveDate: '',
      };
}

export function saveStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateStreak(): void {
  const stats = getStats();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (stats.lastActiveDate === today) return;
  
  if (stats.lastActiveDate === yesterday) {
    stats.streakDays += 1;
  } else if (stats.lastActiveDate !== today) {
    stats.streakDays = 1;
  }
  
  stats.lastActiveDate = today;
  saveStats(stats);
}

export function incrementPartsCompleted(): void {
  const stats = getStats();
  stats.totalPartsCompleted += 1;
  saveStats(stats);
  updateStreak();
}

export function incrementMedalsEarned(): void {
  const stats = getStats();
  stats.totalMedalsEarned += 1;
  saveStats(stats);
}

export function incrementGoldenCollections(): void {
  const stats = getStats();
  stats.goldenCollections += 1;
  saveStats(stats);
}
