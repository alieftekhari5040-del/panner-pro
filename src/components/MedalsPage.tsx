'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getChallenges, getMedalCollections } from '@/lib/storage';
import { Challenge, MedalCollection } from '@/types';
import { MEDAL_TIERS, getMedalByTier } from '@/lib/medals';

export default function MedalsPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [collections, setCollections] = useState<MedalCollection[]>([]);

  useEffect(() => {
    setChallenges(getChallenges());
    setCollections(getMedalCollections());
  }, []);

  const getCollectionForChallenge = (challengeId: string): MedalCollection => {
    return (
      collections.find((c) => c.challengeId === challengeId) || {
        challengeId,
        earnedMedals: [],
        isGolden: false,
      }
    );
  };

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>🏆 مدال‌ها</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          مجموعه مدال‌هایی که کسب کردی
        </p>
      </motion.div>

      {/* Medal Tier Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
        style={{ marginBottom: 32 }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          مسیر ۱۰ مدال (از ضعیف تا قوی)
        </h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            justifyContent: 'center',
          }}
        >
          {MEDAL_TIERS.map((medal, index) => (
            <motion.div
              key={medal.tier}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: `3px solid ${medal.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  boxShadow: `0 0 12px ${medal.glowColor}`,
                }}
              >
                {medal.icon}
              </div>
              <span style={{ fontSize: 11, color: medal.color, fontWeight: 600 }}>
                {medal.label}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                #{index + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Medal Collections per Challenge */}
      {challenges.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card"
          style={{ textAlign: 'center', padding: 60 }}
        >
          <div style={{ fontSize: 80, marginBottom: 20 }}>🏆</div>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>هنوز مدالی نداری!</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            اول یه چالش بساز و شروع کن به تیک زدن پارت‌ها
            <br />
            وقتی همه پارت‌ها رو انجام بدی، اولین مدالت رو میگیری!
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          {challenges.map((challenge, cIndex) => {
            const collection = getCollectionForChallenge(challenge.id);
            const isGolden = collection.isGolden;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: cIndex * 0.1 }}
                className={`card ${isGolden ? 'golden-border' : ''}`}
                style={{
                  padding: 32,
                }}
              >
                {/* Challenge Title */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                      {challenge.title}
                    </h3>
                    {challenge.description && (
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {challenge.description}
                      </p>
                    )}
                  </div>
                  {isGolden && (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--golden)',
                        background: 'rgba(255, 215, 0, 0.1)',
                        padding: '8px 16px',
                        borderRadius: 100,
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                      }}
                    >
                      👑 کلکسیون طلایی
                    </motion.div>
                  )}
                  {challenge.totalCompletedCycles > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--golden)' }}>
                      × {challenge.totalCompletedCycles + (isGolden ? 1 : 0)}
                    </div>
                  )}
                </div>

                {/* Medals Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gap: 12,
                  }}
                >
                  {MEDAL_TIERS.map((medal, medalIndex) => {
                    const isEarned = collection.earnedMedals.includes(medal.tier);
                    const isCurrent = challenge.currentMedalIndex === medalIndex;
                    const isLocked = !isEarned && !isCurrent;

                    return (
                      <motion.div
                        key={medal.tier}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: cIndex * 0.1 + medalIndex * 0.05 }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <motion.div
                          className={`medal-slot ${isEarned ? 'earned' : isLocked ? 'locked' : ''}`}
                          style={{
                            color: medal.color,
                            width: 72,
                            height: 72,
                            borderColor: isEarned ? medal.color : isCurrent ? medal.color : undefined,
                            boxShadow: isEarned ? `0 0 20px ${medal.glowColor}` : isCurrent ? `0 0 10px ${medal.glowColor}` : 'none',
                          }}
                          whileHover={{ scale: 1.1 }}
                          animate={isCurrent ? { borderColor: [medal.color, 'transparent', medal.color] } : {}}
                          transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                        >
                          {isEarned ? medal.icon : isCurrent ? '🔓' : '🔒'}
                        </motion.div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: isEarned ? 700 : 400,
                            color: isEarned ? medal.color : isCurrent ? medal.color : 'var(--text-secondary)',
                            opacity: isLocked ? 0.5 : 1,
                            textAlign: 'center',
                          }}
                        >
                          {medal.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Progress Summary */}
                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {collection.earnedMedals.length} از ۱۰ مدال کسب شده
                  </span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                    {collection.earnedMedals.length * 10}% تکمیل
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
