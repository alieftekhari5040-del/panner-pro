import React from 'react';
import { Download, Printer, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderProps {
  progressPercent: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onExportPng: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progressPercent,
  soundEnabled,
  onToggleSound,
  onReset,
  onExportPng,
  onPrint,
}) => {
  return (
    <header className="w-full mb-6 flex flex-col gap-4">
      {/* Top action / control bar (No-Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-purple-950/30 border border-purple-500/20 rounded-xl px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-purple-900/40 border border-purple-500/30 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs font-medium text-purple-200">
              تکمیل امروز: <strong className="text-purple-300">{progressPercent}٪</strong>
            </span>
            <div className="w-16 bg-purple-950/80 rounded-full h-1.5 overflow-hidden ml-1">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportPng}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-xs font-medium text-purple-100 transition-all shadow-sm"
            title="دانلود به عنوان عکس پوستر (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>خروجی عکس (PNG)</span>
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-xs font-medium text-purple-200 transition-all"
            title="چاپ یا ذخیره به عنوان PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>چاپ / PDF</span>
          </button>
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 transition-all"
            title={soundEnabled ? 'صدا روشن' : 'صدا خاموش'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-purple-900/40 hover:bg-red-900/60 border border-purple-500/30 hover:border-red-500/50 text-purple-300 hover:text-red-300 transition-all"
            title="بازنشانی برنامه‌ی امروز"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Poster Header Row (Matches Vitto Season Planner poster exact layout) */}
      <div className="flex flex-row items-start justify-between w-full pt-1 px-1">
        {/* Right side (in RTL): Title and Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            برنامه‌ی روزانه
          </h1>
          <p className="text-sm sm:text-base font-normal text-purple-300/80 mt-1">
            هر روز یک قدم جلوتر
          </p>
        </div>

        {/* Left side (in RTL): THE ASCENT BLUEPRINT Logo & Icon */}
        <div className="flex items-center gap-3 self-center sm:self-start">
          <div className="flex flex-col text-left font-sans tracking-widest text-xs sm:text-sm font-semibold text-purple-200/90 leading-tight uppercase">
            <span>THE ASCENT</span>
            <span>BLUEPRINT</span>
          </div>
          {/* Three rounded vertical bars logo icon (000) */}
          <div className="flex items-center gap-1 bg-purple-500/10 p-1.5 rounded-lg border border-purple-500/30">
            <div className="w-2.5 h-6 bg-purple-300 rounded-full shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            <div className="w-2.5 h-6 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <div className="w-2.5 h-6 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
          </div>
        </div>
      </div>
    </header>
  );
};
