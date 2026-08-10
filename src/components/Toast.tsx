'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'medal' | 'golden';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { border: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', icon: '✅' },
    info: { border: 'var(--accent-primary)', bg: 'rgba(139, 92, 246, 0.1)', icon: 'ℹ️' },
    medal: { border: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', icon: '🏅' },
    golden: { border: '#ffd700', bg: 'rgba(255, 215, 0, 0.15)', icon: '👑' },
  };

  const color = colors[type];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      exit={{ y: -100, opacity: 0, x: '-50%' }}
      className="toast"
      style={{
        borderColor: color.border,
        background: `linear-gradient(135deg, var(--bg-card), ${color.bg})`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 300,
      }}
    >
      <span style={{ fontSize: 24 }}>{color.icon}</span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{message}</span>
    </motion.div>
  );
}
