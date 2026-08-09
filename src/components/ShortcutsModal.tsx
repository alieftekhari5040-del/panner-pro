import React from 'react';
import { Keyboard, X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + 1', desc: 'رفتن به تب برنامه‌ی روزانه (Today Planner)' },
    { key: 'Alt + 2', desc: 'رفتن به تب ردیاب عادت‌ها (Habit Tracker)' },
    { key: 'Alt + 3', desc: 'رفتن به تب آمار و عملکرد (Analytics)' },
    { key: 'Ctrl + S / ⌘ + S', desc: 'ذخیره‌سازی سریع و بازیابی / پشتیبان‌گیری' },
    { key: 'Ctrl + P / ⌘ + P', desc: 'چاپ صفحه یا خروجی PDF' },
    { key: 'Alt + N', desc: 'باز کردن دفترچه یادداشت شخصی (Scratchpad)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="neon-box w-full max-w-md p-6 bg-[#0f0928] border-2 border-purple-500/80 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.5)] flex flex-col gap-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400 flex items-center justify-center shadow-lg">
            <Keyboard className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              کلیدهای میانبر لپ‌تاپ (Shortcuts)
            </h3>
            <p className="text-xs text-purple-300/80">
              دسترسی سریع با کیبورد برای افزایش سرعت برنامه‌ریزی
            </p>
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="flex flex-col gap-2.5">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-purple-950/40 border border-purple-500/30"
            >
              <span className="text-xs sm:text-sm text-purple-200 font-medium">
                {sc.desc}
              </span>
              <kbd className="px-2.5 py-1 rounded-lg bg-purple-900/80 border border-purple-400/40 text-white font-mono text-xs font-bold shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-200 font-medium text-sm transition-colors"
        >
          متوجه شدم
        </button>
      </div>
    </div>
  );
};
