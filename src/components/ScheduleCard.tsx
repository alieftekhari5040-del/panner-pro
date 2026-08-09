import React from 'react';
import type { ScheduleSlot } from '../types';
import { Check, Plus, Trash2 } from 'lucide-react';

interface ScheduleCardProps {
  schedule: ScheduleSlot[];
  onChangeTask: (id: string, text: string) => void;
  onChangeTime: (id: string, time: string) => void;
  onToggleSlot: (id: string) => void;
  onAddSlot: () => void;
  onRemoveSlot: (id: string) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onChangeTask,
  onChangeTime,
  onToggleSlot,
  onAddSlot,
  onRemoveSlot,
}) => {
  return (
    <div className="neon-box p-5 sm:p-6 flex flex-col gap-4 h-full">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            برنامه‌ی امروز
          </h2>
        </div>
        <button
          onClick={onAddSlot}
          className="no-print flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 text-xs transition-all"
          title="افزودن بازه زمانی جدید"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>بازه زمانی</span>
        </button>
      </div>

      {/* Table Container (neon-inner-box with horizontal grid rows) */}
      <div className="neon-inner-box overflow-hidden flex-1 flex flex-col divide-y divide-purple-500/25">
        {schedule.map((slot, index) => (
          <div
            key={slot.id}
            className={`flex items-center gap-2 sm:gap-4 p-2.5 sm:p-3 transition-colors ${
              slot.completed
                ? 'bg-purple-950/40'
                : 'hover:bg-purple-900/15'
            }`}
          >
            {/* Row index or status checkbox on right */}
            <button
              onClick={() => onToggleSlot(slot.id)}
              className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-200 border shrink-0 ${
                slot.completed
                  ? 'bg-purple-500 border-purple-300 text-white shadow-[0_0_10px_rgba(168,85,247,0.7)]'
                  : 'bg-purple-950/30 border-purple-400/50 hover:border-purple-300'
              }`}
              title={slot.completed ? 'انجام شد' : 'علامت به عنوان انجام‌شده'}
            >
              {slot.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            {/* Time slot column */}
            <div className="w-24 sm:w-28 shrink-0">
              <input
                type="text"
                value={slot.time}
                onChange={(e) => onChangeTime(slot.id, e.target.value)}
                placeholder="ساعت..."
                className="w-full bg-purple-950/30 border border-purple-500/20 rounded-md py-0.5 px-1.5 text-center text-xs sm:text-sm font-medium text-purple-200 focus:border-purple-300 outline-none transition-all"
              />
            </div>

            {/* Vertical column divider */}
            <div className="w-px h-6 bg-purple-500/30 shrink-0" />

            {/* Wide activity / task input column */}
            <div className="flex-1">
              <input
                type="text"
                value={slot.task}
                onChange={(e) => onChangeTask(slot.id, e.target.value)}
                placeholder="برنامه یا فعالیت در این بازه زمانی..."
                className={`w-full bg-transparent text-sm sm:text-base outline-none transition-all ${
                  slot.completed
                    ? 'text-purple-300/60 line-through'
                    : 'text-purple-100 placeholder-purple-400/30'
                }`}
              />
            </div>

            {/* Remove custom slot button (if more than 5 slots) */}
            {schedule.length > 5 && (
              <button
                onClick={() => onRemoveSlot(slot.id)}
                className="no-print opacity-0 hover:opacity-100 focus:opacity-100 text-purple-400/50 hover:text-red-400 p-1 transition-all"
                title="حذف این ردیف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
