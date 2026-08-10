export type MedalTier =
  | 'iron'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'legendary'
  | 'mythic'
  | 'epic'
  | 'divine';

export interface Medal {
  tier: MedalTier;
  label: string;
  color: string;
  glowColor: string;
  icon: string;
  requiredParts: number; // number of parts needed to earn this medal
}

export interface MedalCollection {
  challengeId: string;
  earnedMedals: MedalTier[];
  isGolden: boolean; // when all 10 medals earned
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetParts: number; // parts needed for one medal
  currentParts: number; // current progress
  currentMedalIndex: number; // which medal we're working toward (0-9)
  createdAt: string;
  isActive: boolean;
  totalCompletedCycles: number; // how many times completed a full cycle
}

export interface UserStats {
  totalChallenges: number;
  totalMedalsEarned: number;
  totalPartsCompleted: number;
  goldenCollections: number;
  streakDays: number;
  lastActiveDate: string;
}
