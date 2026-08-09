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
    <div className="neon-box w-full mb-6 p-4 sm:p-5 flex flex-col xl:flex-row items-center justify-between gap-4">
      {/* Right side (RTL): Compact Date & inline Navigation */}
      <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 w-full xl:w-auto shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="text-base sm:text-lg font-bold text-white whitespace-nowrap">
            تاریخ:
          </span>
          <input
            type="text"
            value={dateStr}
            onChange={(e) => onDateChange(e.target.value)}
            placeholder="مثلاً: ۱۸ مرداد ۱۴۰۵"
            className="w-36 sm:w-44 bg-transparent text-purple-100 font-semibold text-sm sm:text-base border-b border-dashed border-purple-400/50 focus:border-purple-300 py-1 px-2 outline-none transition-colors text-right"
          />
        </div>

        {/* Inline sleek day navigation pills (No-print) */}
        <div className="no-print flex items-center gap-1 bg-purple-950/60 p-1 rounded-xl border border-purple-500/30">
          <button
            onClick={onPrevDay}
            className="p-1 rounded-lg hover:bg-purple-800/60 text-purple-200 hover:text-white transition-colors"
            title="روز قبل"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onToday}
            className="px-2.5 py-0.5 rounded-lg hover:bg-purple-800/60 text-xs font-semibold text-purple-200 hover:text-white transition-colors"
            title="رفتن به امروز"
          >
            امروز
          </button>
          <button
            onClick={onNextDay}
            className="p-1 rounded-lg hover:bg-purple-800/60 text-purple-200 hover:text-white transition-colors"
            title="روز بعد"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vertical separator on desktop */}
      <div className="hidden xl:block w-px h-8 bg-purple-500/25 shrink-0 mx-2" />

      {/* Left side (RTL): 7 Weekday buttons in ONE single horizontal line */}
      <div className="flex items-center justify-center xl:justify-end gap-1.5 sm:gap-2 w-full xl:w-auto flex-wrap sm:flex-nowrap">
        {ALL_WEEKDAYS.map((day) => {
          const isActive = day === activeWeekday;
          return (
            <button
              key={day}
              onClick={() => onSelectWeekday(day)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors border flex items-center gap-1.5 whitespace-nowrap ${
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
