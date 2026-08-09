import React from 'react';
import type { ScheduleSlot } from '../types';
import { Check, Plus, Trash2 } from 'lucide-react';

interface ScheduleCardProps {
  schedule: ScheduleSlot[];
  onChangeTask: (id: string, text: string) => void;
  onChangeTime?: (id: string, time: string) => void;
  onToggleSlot: (id: string) => void;
  onAddSlot: () => void;
  onRemoveSlot: (id: string) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onChangeTask,
  onToggleSlot,
  onAddSlot,
  onRemoveSlot,
}) => {
  return (
    <div className="neon-box p-5 sm:p-6 flex flex-col gap-4 h-full">
      {/* Title Row & Add Row Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            برنامه‌ی امروز
          </h2>
        </div>
        <button
          onClick={onAddSlot}
          className="no-print flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-800/70 border border-purple-500/40 text-purple-200 hover:text-white text-xs transition-colors shadow-sm"
          title="افزودن ردیف جدید"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ردیف جدید</span>
        </button>
      </div>

      {/* Table Container with Numbering as requested */}
      <div className="neon-inner-box overflow-hidden flex-1 flex flex-col divide-y divide-purple-500/25">
        {schedule.map((slot, idx) => (
          <div
            key={slot.id}
            className={`group row-interactive flex items-center justify-between gap-3 p-2.5 sm:p-3 ${
              slot.completed
                ? 'bg-purple-950/50'
                : ''
            }`}
          >
            {/* 1. Completion checkbox on RIGHT side (in RTL, first element) */}
            <button
              onClick={() => onToggleSlot(slot.id)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 border-2 shrink-0 ${
                slot.completed
                  ? 'bg-purple-500 border-purple-300 text-white shadow-[0_0_10px_rgba(168,85,247,0.7)]'
                  : 'bg-purple-950/40 border-purple-400/60 hover:border-purple-300'
              }`}
              title={slot.completed ? 'انجام شد' : 'علامت به عنوان انجام‌شده'}
            >
              {slot.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            {/* 2. Numbering (.1, .2, .3...) as requested */}
            <span className="text-xs sm:text-sm font-semibold text-purple-300/80 w-5 select-none shrink-0 text-center">
              {idx + 1}.
            </span>

            {/* 3. Wide activity / task input column */}
            <div className="flex-1 flex items-center">
              <input
                type="text"
                value={slot.task}
                onChange={(e) => onChangeTask(slot.id, e.target.value)}
                placeholder="برنامه یا فعالیت امروز را بنویسید..."
                className={`w-full bg-transparent text-sm sm:text-base outline-none transition-colors ${
                  slot.completed
                    ? 'text-purple-300/60 line-through'
                    : 'text-purple-100 placeholder-purple-400/40'
                }`}
              />
            </div>

            {/* 4. Delete button remains on LEFT side (in RTL, last element) on hover */}
            <button
              onClick={() => onRemoveSlot(slot.id)}
              className="no-print opacity-0 group-hover:opacity-100 focus:opacity-100 text-purple-400/60 hover:text-red-400 p-1.5 transition-colors shrink-0"
              title="حذف این ردیف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {schedule.length === 0 && (
          <div className="text-center py-6 text-purple-400/60 text-sm">
            هیچ ردیف برنامه‌ای وجود ندارد. روی «ردیف جدید» کلیک کنید.
          </div>
        )}
      </div>
    </div>
  );
};
