import { Medal, MedalTier } from '@/types';

export const MEDAL_TIERS: Medal[] = [
  {
    tier: 'iron',
    label: 'آهنی',
    color: '#71717a',
    glowColor: 'rgba(113, 113, 122, 0.4)',
    icon: '🪨',
    requiredParts: 10,
  },
  {
    tier: 'bronze',
    label: 'برنزی',
    color: '#cd7f32',
    glowColor: 'rgba(205, 127, 50, 0.4)',
    icon: '🥉',
    requiredParts: 15,
  },
  {
    tier: 'silver',
    label: 'نقره‌ای',
    color: '#c0c0c0',
    glowColor: 'rgba(192, 192, 192, 0.4)',
    icon: '🥈',
    requiredParts: 20,
  },
  {
    tier: 'gold',
    label: 'طلایی',
    color: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.4)',
    icon: '🥇',
    requiredParts: 25,
  },
  {
    tier: 'platinum',
    label: 'پلاتینی',
    color: '#e5e4e2',
    glowColor: 'rgba(229, 228, 226, 0.5)',
    icon: '💎',
    requiredParts: 30,
  },
  {
    tier: 'diamond',
    label: 'الماسی',
    color: '#b9f2ff',
    glowColor: 'rgba(185, 242, 255, 0.5)',
    icon: '💠',
    requiredParts: 40,
  },
  {
    tier: 'legendary',
    label: 'افسانه‌ای',
    color: '#ff6b35',
    glowColor: 'rgba(255, 107, 53, 0.5)',
    icon: '🔥',
    requiredParts: 50,
  },
  {
    tier: 'mythic',
    label: 'اسطوره‌ای',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    icon: '🔮',
    requiredParts: 60,
  },
  {
    tier: 'epic',
    label: 'حماسی',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.5)',
    icon: '⚡',
    requiredParts: 75,
  },
  {
    tier: 'divine',
    label: 'خدایی',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    icon: '👑',
    requiredParts: 100,
  },
];

export function getMedalByTier(tier: MedalTier): Medal {
  return MEDAL_TIERS.find(m => m.tier === tier)!;
}

export function getMedalByIndex(index: number): Medal {
  return MEDAL_TIERS[index] || MEDAL_TIERS[0];
}
