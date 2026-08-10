'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  getChallenges,
  saveChallenges,
  addMedalToCollection,
  incrementPartsCompleted,
  incrementMedalsEarned,
  incrementGoldenCollections,
} from '@/lib/storage';
import { Challenge } from '@/types';
import { MEDAL_TIERS, getMedalByIndex } from '@/lib/medals';

interface ChallengesPageProps {
  onToast: (message: string, type: 'success' | 'info' | 'medal' | 'golden') => void;
}

export default function ChallengesPage({ onToast }: ChallengesPageProps) {
  const [challenges, setChallengesState] = useState<Challenge[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTarget, setNewTarget] = useState(10);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  useEffect(() => {
    setChallengesState(getChallenges());
  }, []);

  const refreshChallenges = useCallback(() => {
    setChallengesState(getChallenges());
  }, []);

  const handleCreateChallenge = () => {
    if (!newTitle.trim()) return;

    const challenge: Challenge = {
      id: uuidv4(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      targetParts: newTarget,
      currentParts: 0,
      currentMedalIndex: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
      totalCompletedCycles: 0,
    };

    const updated = [...challenges, challenge];
    saveChallenges(updated);
    setChallengesState(updated);
    setShowModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewTarget(10);
    onToast('چالش جدید ساخته شد! ⚔️', 'success');
  };

  const handlePartClick = (challengeId: string, partIndex: number) => {
    const updated = challenges.map((c) => {
      if (c.id !== challengeId) return c;

      // If clicking a completed part, uncomplete it (and all after)
      if (partIndex < c.currentParts) {
        return { ...c, currentParts: partIndex };
      }

      // Can only click the next part
      if (partIndex !== c.currentParts) return c;

      const newParts = c.currentParts + 1;
      incrementPartsCompleted();

      // Check if medal earned
      if (newParts >= c.targetParts) {
        const medal = getMedalByIndex(c.currentMedalIndex);
        addMedalToCollection(c.id, medal.tier);
        incrementMedalsEarned();

        const nextMedalIndex = c.currentMedalIndex + 1;

        // All 10 medals earned!
        if (nextMedalIndex >= 10) {
          incrementGoldenCollections();
          onToast(`🎉 تمام مدال‌ها تکمیل شد! کلکسیون طلایی: ${c.title}`, 'golden');
          return {
            ...c,
            currentParts: 0,
            currentMedalIndex: 0,
            totalCompletedCycles: c.totalCompletedCycles + 1,
          };
        }

        // Medal earned, move to next
        const nextMedal = getMedalByIndex(nextMedalIndex);
        onToast(
          `🏅 مدال ${medal.label} کسب شد! هدف بعدی: ${nextMedal.requiredParts} پارت برای مدال ${nextMedal.label}`,
          'medal'
        );

        return {
          ...c,
          currentParts: 0,
          currentMedalIndex: nextMedalIndex,
        };
      }

      return { ...c, currentParts: newParts };
    });

    saveChallenges(updated);
    setChallengesState(updated);
  };

  const handleDeleteChallenge = (id: string) => {
    const updated = challenges.filter((c) => c.id !== id);
    saveChallenges(updated);
    setChallengesState(updated);
    if (selectedChallenge === id) setSelectedChallenge(null);
    onToast('چالش حذف شد', 'info');
  };

  const selectedData = challenges.find((c) => c.id === selectedChallenge);

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>⚔️ چالش‌ها</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            چالش‌هات رو مدیریت کن و پیشرفت کن
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + چالش جدید
        </button>
      </motion.div>

      {/* Challenges List */}
      {challenges.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card"
          style={{ textAlign: 'center', padding: 60 }}
        >
          <div style={{ fontSize: 80, marginBottom: 20 }}>🎯</div>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>هنوز چالشی نساختی!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.8 }}>
            اولین چالشت رو بساز. مثلاً «۱۰ پارت متمرکز درس خوندن»
            <br />
            هر پارت رو که انجام دادی تیک بزن و مدال بگیر!
          </p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            ساخت اولین چالش 🚀
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedChallenge ? '1fr 1fr' : '1fr', gap: 24 }}>
          {/* Challenge Cards */}
          <div style={{ display: 'grid', gap: 16 }}>
            {challenges.map((challenge, index) => {
              const currentMedal = getMedalByIndex(challenge.currentMedalIndex);
              const progress = (challenge.currentParts / challenge.targetParts) * 100;
              const isSelected = selectedChallenge === challenge.id;

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card ${isSelected ? 'golden-border' : ''}`}
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--accent-primary)' : undefined,
                  }}
                  onClick={() => setSelectedChallenge(isSelected ? null : challenge.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                        {challenge.title}
                      </h3>
                      {challenge.description && (
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {challenge.description}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'center', marginRight: 16 }}>
                      <div style={{ fontSize: 36 }}>{currentMedal.icon}</div>
                      <div style={{ fontSize: 11, color: currentMedal.color, fontWeight: 600, marginTop: 4 }}>
                        {currentMedal.label}
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {challenge.currentParts} / {challenge.targetParts} پارت
                      </span>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Medal progress */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {MEDAL_TIERS.map((medal, i) => (
                        <div
                          key={medal.tier}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: i < challenge.currentMedalIndex ? medal.color : 'var(--border-color)',
                            opacity: i < challenge.currentMedalIndex ? 1 : 0.4,
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      مدال {challenge.currentMedalIndex + 1} از ۱۰
                    </span>
                  </div>

                  {challenge.totalCompletedCycles > 0 && (
                    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--golden)' }}>
                      👑 {challenge.totalCompletedCycles} بار تکمیل شده
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Selected Challenge Detail - Part Tracker */}
          <AnimatePresence>
            {selectedData && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="card"
                style={{ position: 'sticky', top: 32, height: 'fit-content' }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                  {selectedData.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
                  روی هر دایره کلیک کن وقتی یه پارت رو انجام دادی
                </p>

                {/* Parts Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  {Array.from({ length: selectedData.targetParts }, (_, i) => (
                    <motion.button
                      key={i}
                      className={`part-btn ${i < selectedData.currentParts ? 'completed' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePartClick(selectedData.id, i);
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {i < selectedData.currentParts ? '✓' : i + 1}
                    </motion.button>
                  ))}
                </div>

                {/* Current Medal Info */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    در حال تلاش برای
                  </p>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>
                    {getMedalByIndex(selectedData.currentMedalIndex).icon}
                  </div>
                  <p style={{ fontWeight: 700, color: getMedalByIndex(selectedData.currentMedalIndex).color }}>
                    مدال {getMedalByIndex(selectedData.currentMedalIndex).label}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {selectedData.targetParts} پارت لازم داری
                  </p>
                </div>

                {/* Medal Journey */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>مسیر مدال‌ها:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {MEDAL_TIERS.map((medal, i) => (
                      <div
                        key={medal.tier}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '8px 12px',
                          borderRadius: 8,
                          background:
                            i === selectedData.currentMedalIndex
                              ? 'rgba(139, 92, 246, 0.1)'
                              : 'transparent',
                          border:
                            i === selectedData.currentMedalIndex
                              ? '1px solid var(--accent-primary)'
                              : '1px solid transparent',
                          opacity: i <= selectedData.currentMedalIndex ? 1 : 0.4,
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{medal.icon}</span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: i === selectedData.currentMedalIndex ? 700 : 400,
                            color: i < selectedData.currentMedalIndex ? medal.color : 'var(--text-primary)',
                          }}
                        >
                          {medal.label}
                        </span>
                        {i < selectedData.currentMedalIndex && (
                          <span style={{ fontSize: 12, color: '#22c55e', marginRight: 'auto' }}>✓</span>
                        )}
                        {i === selectedData.currentMedalIndex && (
                          <span style={{ fontSize: 11, color: 'var(--accent-primary)', marginRight: 'auto' }}>
                            ← الان
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delete */}
                <button
                  className="btn-secondary"
                  style={{ width: '100%', color: '#ef4444', borderColor: '#ef4444' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('مطمئنی میخوای این چالش رو حذف کنی؟')) {
                      handleDeleteChallenge(selectedData.id);
                    }
                  }}
                >
                  🗑️ حذف چالش
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Create Challenge Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
                ⚔️ چالش جدید
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    عنوان چالش *
                  </label>
                  <input
                    className="input-field"
                    placeholder="مثلاً: درس خوندن متمرکز"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    توضیحات
                  </label>
                  <input
                    className="input-field"
                    placeholder="مثلاً: هر پارت = ۲۵ دقیقه تمرکز کامل"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    تعداد پارت‌ها برای هر مدال: {newTarget}
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={50}
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                    <span>۳</span>
                    <span>۵۰</span>
                  </div>
                </div>

                {/* Preview */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 12,
                    padding: 16,
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>پیش‌نمایش</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>
                    {newTitle || 'عنوان چالش'} — {newTarget} پارت
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    برای هر مدال {newTarget} بار باید انجام بدی
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleCreateChallenge}>
                  ساخت چالش 🚀
                </button>
                <button className="btn-secondary" onClick={() => setShowModal(false)}>
                  انصراف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
