import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Clock as ClockIcon,
  Keyboard,
  Edit2,
  Sun,
  Moon,
  Sunset,
} from 'lucide-react';
import { playCheckSound } from '../utils/sound';

interface HeaderProps {
  progressPercent: number;
  completedScheduleCount: number;
  totalScheduleCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onOpenShortcutsModal: () => void;
}

const PROFILE_NAME_KEY = 'ascent_blueprint_profile_name';

export const Header: React.FC<HeaderProps> = ({
  progressPercent,
  completedScheduleCount,
  totalScheduleCount,
  soundEnabled,
  onToggleSound,
  onReset,
  onOpenShortcutsModal,
}) => {
  // Personalized Profile Name (saved to localStorage automatically)
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

  // Live Persian Digital Clock & Time-of-Day Icon for Laptop View
  const [clockStr, setClockStr] = useState('');
  const [hours, setHours] = useState(12);

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
        setHours(now.getHours());
      } catch {
        setClockStr('۱۲:۰۰');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time-of-day greeting & icon
  const getTimeGreeting = () => {
    if (hours >= 5 && hours < 12) {
      return { text: 'صبح بخیر', icon: <Sun className="w-4 h-4 text-amber-400" /> };
    }
    if (hours >= 12 && hours < 17) {
      return { text: 'ظهر بخیر', icon: <Sunset className="w-4 h-4 text-orange-400" /> };
    }
    return { text: 'شب بخیر', icon: <Moon className="w-4 h-4 text-purple-300" /> };
  };

  const greeting = getTimeGreeting();

  const handleLogoClick = () => {
    playCheckSound(true);
  };

  return (
    <header className="w-full mb-6 flex flex-col gap-5">
      {/* UPGRADED Perfectly Organized Executive Command Bar (Single horizontal row, perfectly aligned left & right) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-[#110a2c]/85 border border-purple-500/40 rounded-2xl px-4 py-2.5 backdrop-blur-2xl shadow-[0_4px_30px_rgba(139,92,246,0.25)] w-full">
        
        {/* RIGHT GROUP (in RTL): Personal Identity + UPGRADED LIVE CLOCK */}
        <div className="flex items-center gap-2.5">
          {/* Personalized Profile Greeting Badge */}
          <div className="flex items-center gap-1.5 bg-purple-900/50 border border-purple-400/40 px-3 py-1.5 rounded-xl text-xs sm:text-sm text-purple-100 shadow-sm">
            {greeting.icon}
            {isEditingName ? (
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="bg-purple-950 px-2 py-0.5 rounded text-white outline-none w-28 text-xs sm:text-sm font-bold"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-1.5 hover:text-white font-bold transition-colors"
                title="کلیک برای تغییر نام کاربری"
              >
                <span>سلام، {profileName}!</span>
                <Edit2 className="w-3 h-3 text-purple-400 opacity-60 hover:opacity-100" />
              </button>
            )}
          </div>

          {/* Executive Digital Watch Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-purple-950/90 border border-orange-400/50 shadow-[0_0_15px_rgba(249,115,22,0.25)] px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-extrabold text-orange-300 tracking-wider">
            <ClockIcon className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>{clockStr}</span>
          </div>
        </div>

        {/* LEFT GROUP (in RTL): Lively Today Schedule Progress Bar + Minimalist Controls */}
        <div className="flex items-center gap-2.5">
          {/* Upgraded Lively Today Schedule Progress Bar */}
          <div
            className="flex items-center gap-2 bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-900/90 border border-purple-400/60 px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_22px_rgba(168,85,247,0.7)] transition-all duration-300 group cursor-default"
            title={`وضعیت برنامه‌ی امروز: ${completedScheduleCount} از ${totalScheduleCount} ردیف انجام شده است`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs sm:text-sm font-bold text-purple-100 flex items-center gap-1">
              <span>تکمیل امروز:</span>
              <strong className="text-white font-extrabold">{progressPercent}٪</strong>
            </span>
            {/* Animated Moving Gradient Fill Bar */}
            <div className="w-20 sm:w-28 bg-purple-950/90 rounded-full h-2.5 overflow-hidden border border-purple-400/40 shadow-inner">
              <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-[length:200%_100%] animate-gradient h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {totalScheduleCount > 0 && (
              <span className="text-[11px] font-bold text-purple-200 bg-purple-950/70 px-2 py-0.5 rounded-full border border-purple-500/40 hidden md:inline-block">
                {completedScheduleCount}/{totalScheduleCount} ردیف
              </span>
            )}
          </div>

          {/* Minimalist Utility Group (Shortcuts, Sound, Reset) */}
          <div className="flex items-center gap-1 bg-purple-950/60 p-1 rounded-xl border border-purple-500/35">
            {/* Shortcuts Help */}
            <button
              onClick={onOpenShortcutsModal}
              className="p-1.5 rounded-lg hover:bg-purple-800/60 text-purple-200 hover:text-white transition-colors"
              title="کلیدهای میانبر لپ‌تاپ (Shortcuts)"
            >
              <Keyboard className="w-4 h-4 text-purple-300" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg hover:bg-purple-800/60 text-purple-300 hover:text-white transition-colors"
              title={soundEnabled ? 'صدا روشن' : 'صدا خاموش'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-300" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>

            {/* Reset Today */}
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg hover:bg-red-900/60 text-purple-300 hover:text-red-300 transition-colors"
              title="بازنشانی برنامه‌ی امروز"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
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
