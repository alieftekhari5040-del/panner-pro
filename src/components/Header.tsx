import React from 'react';
import { Download, Printer, RotateCcw, Volume2, VolumeX, Sparkles, Monitor, Zap } from 'lucide-react';

interface HeaderProps {
  progressPercent: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onExportPng: () => void;
  onPrint: () => void;
  onOpenInstallModal: () => void;
  isInstallReady?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  progressPercent,
  soundEnabled,
  onToggleSound,
  onReset,
  onExportPng,
  onPrint,
  onOpenInstallModal,
  isInstallReady,
}) => {
  // Dynamic daily motivation based on completion percent
  const getMotivationalQuote = (percent: number) => {
    if (percent === 100) return 'تکمیل ۱۰۰٪! امروز قله را فتح کردی! 🏆✨';
    if (percent >= 75) return 'فقط چند قدم تا قله باقی مانده؛ ادامه بده! ⚡';
    if (percent >= 40) return 'مسیر صعود هموار است؛ عالی پیش می‌روی! 🔥';
    if (percent > 0) return 'شروعی پرقدرت؛ قدم‌های اول برداشته شد! 🚀';
    return 'هر روز یک قدم جلوتر؛ برنامه امروزت را بچین! ✨';
  };

  return (
    <header className="w-full mb-6 flex flex-col gap-4">
      {/* Top action / control bar (No-Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl px-4 py-3 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.2)]">
        {/* Left/Right widget: Progress indicator + Live motivational banner */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-purple-900/60 to-indigo-950/60 border border-purple-400/40 px-3.5 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-semibold text-purple-100">
              تکمیل امروز: <strong className="text-white text-sm">{progressPercent}٪</strong>
            </span>
            <div className="w-20 bg-purple-950/80 rounded-full h-2 overflow-hidden ml-1 border border-purple-500/30">
              <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 h-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Dynamic Daily Motivation Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-purple-200/90 bg-purple-900/30 px-3 py-1.5 rounded-full border border-purple-500/20">
            <Zap className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>{getMotivationalQuote(progressPercent)}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Install on Desktop button */}
          <button
            onClick={onOpenInstallModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm border ${
              isInstallReady
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-pulse'
                : 'bg-purple-900/50 hover:bg-purple-800/70 border-purple-400/40 text-purple-100'
            }`}
            title="نصب اپلیکیشن روی دسکتاپ (Windows / Mac / Linux)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>نصب روی دسکتاپ</span>
          </button>

          <button
            onClick={onExportPng}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-xs font-medium text-purple-100 transition-all shadow-sm hover:scale-105"
            title="دانلود به عنوان عکس پوستر (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>خروجی عکس (PNG)</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-xs font-medium text-purple-200 transition-all hover:scale-105"
            title="چاپ یا ذخیره به عنوان PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>چاپ / PDF</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 transition-all hover:scale-105"
            title={soundEnabled ? 'صدا روشن' : 'صدا خاموش'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-300" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-xl bg-purple-900/40 hover:bg-red-900/60 border border-purple-500/30 hover:border-red-500/50 text-purple-300 hover:text-red-300 transition-all hover:scale-105"
            title="بازنشانی برنامه‌ی امروز"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Poster Header Row (Matches Vitto Season Planner poster exact layout) */}
      <div className="flex flex-row items-start justify-between w-full pt-2 px-1">
        {/* Right side (in RTL): Title and Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            برنامه‌ی روزانه
          </h1>
          <p className="text-sm sm:text-base font-normal text-purple-300/90 mt-1.5 flex items-center gap-2">
            <span>هر روز یک قدم جلوتر</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          </p>
        </div>

        {/* Left side (in RTL): THE ASCENT BLUEPRINT Logo & Icon */}
        <div className="flex items-center gap-3 self-center sm:self-start">
          <div className="flex flex-col text-left font-sans tracking-widest text-xs sm:text-sm font-semibold text-purple-200/90 leading-tight uppercase">
            <span>THE ASCENT</span>
            <span>BLUEPRINT</span>
          </div>
          {/* Three rounded vertical bars logo icon (000) with animated glow */}
          <div className="flex items-center gap-1 bg-purple-500/15 p-2 rounded-xl border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <div className="w-2.5 h-6 bg-purple-300 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.9)] animate-pulse" />
            <div className="w-2.5 h-6 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.9)]" />
            <div className="w-2.5 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.9)] animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
};
