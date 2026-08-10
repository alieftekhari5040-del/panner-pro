'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import ChallengesPage from '@/components/ChallengesPage';
import MedalsPage from '@/components/MedalsPage';
import ParticlesBg from '@/components/ParticlesBg';
import Toast from '@/components/Toast';
import Confetti from '@/components/Confetti';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'info' | 'medal' | 'golden';
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'medal' | 'golden') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Show confetti for medal and golden achievements
    if (type === 'medal' || type === 'golden') {
      setShowConfetti(true);
    }
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <ParticlesBg count={15} />
      
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginRight: 240,
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard onNavigate={setActiveTab} />
            </motion.div>
          )}
          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ChallengesPage onToast={addToast} />
            </motion.div>
          )}
          {activeTab === 'medals' && (
            <motion.div
              key="medals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <MedalsPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Toasts */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              style={{ position: 'absolute', top: 24 + index * 80, left: '50%', transform: 'translateX(-50%)' }}
            >
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
