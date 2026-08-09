import React from 'react';
import type { WeekdayName } from '../types';
import { ALL_WEEKDAYS } from '../utils/jalali';
import { ChevronRight, ChevronLeft, Calendar } from 'lucide-react';

interface DateWeekBarProps {
  dateStr: string;
  onDateChange: (newDate: string) => void;
  activeWeekday: WeekdayName;
  onSelectWeekday: (day: WeekdayName) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export const DateWeekBar: React.FC<DateWeekBarProps> = ({
  dateStr,
  onDateChange,
  activeWeekday,
  onSelectWeekday,
  onPrevDay,
  onNextDay,
  onToday,
}) => {
  return (
    <div className="neon-box w-full mb-6 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Right side (RTL): Date field + Previous / Next / Today navigation */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span className="text-base sm:text-lg font-bold text-white whitespace-nowrap">
            تاریخ:
          </span>
        </div>
        
        <div className="relative flex-1 min-w-[170px]">
          <input
            type="text"
            value={dateStr}
            onChange={(e) => onDateChange(e.target.value)}
            placeholder="مثلاً: ۱۸ مرداد ۱۴۰۵"
            className="w-full bg-transparent text-purple-100 font-medium text-sm sm:text-base border-b border-dashed border-purple-400/60 focus:border-purple-300 py-1 px-2 outline-none transition-colors"
          />
        </div>

        {/* Day navigation buttons (No-print) */}
        <div className="no-print flex items-center gap-1.5 ml-2">
          <button
            onClick={onPrevDay}
            className="p-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-800/70 border border-purple-500/30 text-purple-200 hover:text-white transition-colors"
            title="روز قبل"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onToday}
            className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-400/40 text-xs font-semibold text-purple-200 hover:text-white transition-colors"
            title="رفتن به امروز"
          >
            امروز
          </button>
          <button
            onClick={onNextDay}
            className="p-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-800/70 border border-purple-500/30 text-purple-200 hover:text-white transition-colors"
            title="روز بعد"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vertical separator on desktop */}
      <div className="hidden md:block w-px h-10 bg-purple-500/30" />

      {/* Left side (RTL): 7 Weekday buttons */}
      <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 w-full md:w-auto">
        {ALL_WEEKDAYS.map((day) => {
          const isActive = day === activeWeekday;
          return (
            <button
              key={day}
              onClick={() => onSelectWeekday(day)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-purple-600 border-purple-300 text-white shadow-[0_2px_15px_rgba(168,85,247,0.45)] font-bold'
                  : 'bg-purple-950/40 border-purple-500/30 text-purple-300/80 hover:border-purple-400/70 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.9)]" />}
              <span>{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
