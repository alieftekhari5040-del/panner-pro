'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getChallenges, getMedalCollections, getStats, UserStats } from '@/lib/storage';
import { Challenge, MedalCollection } from '@/types';
import { MEDAL_TIERS } from '@/lib/medals';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [medalCollections, setMedalCollections] = useState<MedalCollection[]>([]);

  useEffect(() => {
    setStats(getStats());
    setChallenges(getChallenges());
    setMedalCollections(getMedalCollections());
  }, []);

  if (!stats) return null;

  const activeChallenges = challenges.filter(c => c.isActive);
  const totalMedals = medalCollections.reduce((sum, c) => sum + c.earnedMedals.length, 0);
  const goldenCount = medalCollections.filter(c => c.isGolden).length;

  const statCards = [
    { label: 'چالش‌های فعال', value: activeChallenges.length, icon: '⚔️', color: '#8b5cf6' },
    { label: 'مدال‌های کسب شده', value: totalMedals, icon: '🏆', color: '#fbbf24' },
    { label: 'پارت‌های انجام شده', value: stats.totalPartsCompleted, icon: '✅', color: '#22c55e' },
    { label: 'کلکسیون‌های طلایی', value: goldenCount, icon: '👑', color: '#ffd700' },
    { label: 'روزهای متوالی', value: stats.streakDays, icon: '🔥', color: '#ef4444' },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 40 }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          خوش آمدی! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          بیا ببینیم امروز چقدر پیشرفت کردی
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
            whileHover={{ scale: 1.05 }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>{stat.icon}</div>
            <div className="stat-number" style={{ background: `linear-gradient(135deg, ${stat.color}, #c084fc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Active Challenges Quick View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>چالش‌های فعال</h2>
          <button className="btn-secondary" onClick={() => onNavigate('challenges')}>
            مشاهده همه ←
          </button>
        </div>

        {activeChallenges.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>هنوز چالشی نداری!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              اولین چالشت رو بساز و شروع کن به پیشرفت
            </p>
            <button className="btn-primary" onClick={() => onNavigate('challenges')}>
              ساخت چالش جدید
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {activeChallenges.slice(0, 3).map((challenge, index) => {
              const currentMedal = MEDAL_TIERS[challenge.currentMedalIndex];
              const progress = (challenge.currentParts / challenge.targetParts) * 100;

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                        {challenge.title}
                      </h3>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {challenge.description}
                      </p>
                    </div>
                    <div style={{ fontSize: 32 }}>{currentMedal?.icon}</div>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        پیشرفت: {challenge.currentParts} / {challenge.targetParts}
                      </span>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12 }}>
                    در حال تلاش برای مدال: <span style={{ color: currentMedal?.color, fontWeight: 600 }}>{currentMedal?.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
