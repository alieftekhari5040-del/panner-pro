import React from 'react';
import type { WeekdayName } from '../types';
import { ALL_WEEKDAYS } from '../utils/jalali';

interface DateWeekBarProps {
  dateStr: string;
  onDateChange: (newDate: string) => void;
  activeWeekday: WeekdayName;
  onSelectWeekday: (day: WeekdayName) => void;
}

export const DateWeekBar: React.FC<DateWeekBarProps> = ({
  dateStr,
  onDateChange,
  activeWeekday,
  onSelectWeekday,
}) => {
  return (
    <div className="neon-box w-full mb-6 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Right side (RTL): Date field */}
      <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[280px]">
        <span className="text-base sm:text-lg font-bold text-white whitespace-nowrap">
          تاریخ:
        </span>
        <div className="relative flex-1">
          <input
            type="text"
            value={dateStr}
            onChange={(e) => onDateChange(e.target.value)}
            placeholder="مثلاً: ۱۸ مرداد ۱۴۰۵"
            className="w-full bg-transparent text-purple-100 font-medium text-sm sm:text-base border-b border-dashed border-purple-400/60 focus:border-purple-300 py-1 px-2 outline-none transition-all"
          />
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
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-purple-600/50 border-purple-300 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)] font-semibold scale-[1.03]'
                  : 'bg-purple-950/40 border-purple-500/30 text-purple-300/80 hover:border-purple-400/60 hover:text-white'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
