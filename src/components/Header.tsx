import React, { useState, useEffect } from 'react';
import {
  Download,
  Printer,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Monitor,
  Zap,
  HardDrive,
  User,
  Clock as ClockIcon,
  Keyboard,
  FileText,
  Edit2,
} from 'lucide-react';
import { playCheckSound } from '../utils/sound';

interface HeaderProps {
  progressPercent: number;
  completedScheduleCount: number;
  totalScheduleCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onExportPng: () => void;
  onPrint: () => void;
  onOpenInstallModal: () => void;
  onOpenStorageModal: () => void;
  onOpenShortcutsModal: () => void;
  onOpenQuickNoteModal: () => void;
  isInstallReady?: boolean;
}

const PROFILE_NAME_KEY = 'ascent_blueprint_profile_name';

export const Header: React.FC<HeaderProps> = ({
  progressPercent,
  completedScheduleCount,
  totalScheduleCount,
  soundEnabled,
  onToggleSound,
  onReset,
  onExportPng,
  onPrint,
  onOpenInstallModal,
  onOpenStorageModal,
  onOpenShortcutsModal,
  onOpenQuickNoteModal,
  isInstallReady,
}) => {
  // Personalized Profile Name
  const [profileName, setProfileName] = useState(() => {
    try {
      return localStorage.getItem(PROFILE_NAME_KEY) || 'علی افتخاری';
    } catch {
      return 'علی افتخاری';
    }
  });
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_NAME_KEY, profileName);
    } catch {
      // ignore
    }
  }, [profileName]);

  // Live Persian Digital Clock for laptop view
  const [clockStr, setClockStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setClockStr(formatter.format(now));
      } catch {
        setClockStr('۱۲:۰۰');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic daily motivation based on completion percent of Today's Schedule
  const getMotivationalQuote = (percent: number) => {
    if (percent === 100) return 'تکمیل ۱۰۰٪ برنامه‌ی امروز! قله را فتح کردی! 🏆';
    if (percent >= 75) return 'فقط چند قدم تا تکمیل برنامه‌ی امروز باقی مانده! ⚡';
    if (percent >= 40) return 'مسیر برنامه‌ی امروز هموار است؛ عالی پیش می‌روی! 🔥';
    if (percent > 0) return 'شروعی پرقدرت؛ اولین ردیف‌های برنامه تیک خورد! 🚀';
    return 'هر روز یک قدم جلوتر؛ برنامه‌ی امروزت را تکمیل کن! ✨';
  };

  const handleLogoClick = () => {
    playCheckSound(true);
  };

  return (
    <header className="w-full mb-5 flex flex-col gap-4">
      {/* Top action / control bar (No-Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-purple-950/40 border border-purple-500/25 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-sm">
        {/* Left/Right widget: Personal Profile + Live Clock + Animated Progress indicator */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Personalized User Badge */}
          <div className="flex items-center gap-1.5 bg-purple-900/50 border border-purple-400/35 px-3 py-1 rounded-full text-xs text-purple-100">
            <User className="w-3.5 h-3.5 text-purple-300 shrink-0" />
            {isEditingName ? (
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="bg-purple-950 px-1.5 py-0.5 rounded text-white outline-none w-28 text-xs font-bold"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-1 hover:text-white font-bold transition-colors"
                title="کلیک برای تغییر نام کاربری"
              >
                <span>سلام، {profileName}!</span>
                <Edit2 className="w-2.5 h-2.5 text-purple-400 opacity-60 hover:opacity-100" />
              </button>
            )}
          </div>

          {/* Live Laptop Digital Clock */}
          <div className="hidden sm:flex items-center gap-1.5 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-mono text-purple-200">
            <ClockIcon className="w-3.5 h-3.5 text-orange-400" />
            <span>{clockStr}</span>
          </div>

          {/* Lively, Animated Progress bar pill dedicated 100% to Today's Schedule (برنامه‌ی امروز) */}
          <div
            className="flex items-center gap-2.5 bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 border border-purple-400/60 px-3.5 py-1.5 rounded-full shadow-[0_0_18px_rgba(168,85,247,0.45)] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-all duration-300 group cursor-default"
            title={`وضعیت برنامه‌ی امروز: ${completedScheduleCount} از ${totalScheduleCount} ردیف انجام شده است`}
          >
            <Sparkles className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-semibold text-purple-100 flex items-center gap-1">
              <span>تکمیل امروز:</span>
              <strong className="text-white font-extrabold text-sm">{progressPercent}٪</strong>
            </span>
            {/* Animated Moving Gradient Fill Bar */}
            <div className="w-24 sm:w-28 bg-purple-950/90 rounded-full h-2.5 overflow-hidden ml-1 border border-purple-400/40 shadow-inner">
              <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-[length:200%_100%] animate-gradient h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {totalScheduleCount > 0 && (
              <span className="text-[11px] font-bold text-purple-200/90 hidden md:inline-block bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                {completedScheduleCount}/{totalScheduleCount} ردیف
              </span>
            )}
          </div>

          {/* Dynamic Daily Motivation Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-purple-200/90 bg-purple-900/30 px-3.5 py-1 rounded-full border border-purple-500/20">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>{getMotivationalQuote(progressPercent)}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Quick Note Scratchpad */}
          <button
            onClick={onOpenQuickNoteModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/70 border border-purple-400/35 text-xs font-medium text-purple-100 transition-colors shadow-sm"
            title="دفترچه یادداشت شخصی (Alt + N)"
          >
            <FileText className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden sm:inline">یادداشت سریع</span>
          </button>

          {/* Shortcuts Help */}
          <button
            onClick={onOpenShortcutsModal}
            className="p-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 transition-colors"
            title="کلیدهای میانبر لپ‌تاپ (Shortcuts)"
          >
            <Keyboard className="w-4 h-4 text-purple-300" />
          </button>

          {/* Persistent Storage Status & Backup button */}
          <button
            onClick={onOpenStorageModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/70 border border-purple-400/35 text-xs font-medium text-purple-100 transition-colors shadow-sm"
            title="وضعیت ذخیره‌سازی در مرورگر و تهیه‌ی فایل پشتیبان (Backup / Restore)"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">ذخیره در مرورگر</span>
          </button>

          {/* Install on Desktop button */}
          <button
            onClick={onOpenInstallModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border shadow-sm ${
              isInstallReady
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-purple-300'
                : 'bg-purple-900/50 hover:bg-purple-800/70 border-purple-400/30 text-purple-100'
            }`}
            title="نصب اپلیکیشن روی دسکتاپ (Windows / Mac / Linux)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>نصب روی دسکتاپ</span>
          </button>

          <button
            onClick={onExportPng}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/35 text-xs font-medium text-purple-100 transition-colors shadow-sm"
            title="دانلود به عنوان عکس پوستر (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروجی عکس</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-xs font-medium text-purple-200 transition-colors"
            title="چاپ یا ذخیره به عنوان PDF (Ctrl + P)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">چاپ</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 transition-colors"
            title={soundEnabled ? 'صدا روشن' : 'صدا خاموش'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-300" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-xl bg-purple-900/40 hover:bg-red-900/60 border border-purple-500/30 hover:border-red-500/50 text-purple-300 hover:text-red-300 transition-colors"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(139,92,246,0.4)]">
            برنامه‌ی روزانه
          </h1>
          <p className="text-sm sm:text-base font-normal text-purple-300/90 mt-1.5 flex items-center gap-2">
            <span>هر روز یک قدم جلوتر</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          </p>
        </div>

        {/* Left side (in RTL): LIVELY ANIMATED THE ASCENT BLUEPRINT Logo & Equalizer Icon */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 self-center sm:self-start group cursor-pointer"
          title="THE ASCENT BLUEPRINT — کلیک کنید"
        >
          {/* Shimmering Typography */}
          <div className="flex flex-col text-left font-sans tracking-widest text-xs sm:text-sm font-black leading-tight uppercase bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            <span>THE ASCENT</span>
            <span>BLUEPRINT</span>
          </div>

          {/* Three rounded vertical bars logo icon (000) - LIVELY EQUALIZER WAVE */}
          <div className="flex items-center gap-1.5 bg-purple-900/40 p-2.5 rounded-2xl border border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:border-purple-300 group-hover:shadow-[0_0_30px_rgba(192,132,252,0.8)] transition-all duration-300">
            <div className="w-2.5 h-6 bg-gradient-to-t from-purple-600 via-pink-400 to-purple-200 rounded-full shadow-[0_0_12px_rgba(192,132,252,0.9)] animate-bar-1" />
            <div className="w-2.5 h-6 bg-gradient-to-t from-indigo-500 via-purple-400 to-pink-300 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.9)] animate-bar-2" />
            <div className="w-2.5 h-6 bg-gradient-to-t from-purple-600 via-pink-400 to-purple-200 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.9)] animate-bar-3" />
          </div>
        </div>
      </div>
    </header>
  );
};
