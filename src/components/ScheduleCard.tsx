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
          className="no-print flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 hover:text-white text-xs transition-all shadow-sm"
          title="افزودن ردیف جدید"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ردیف جدید</span>
        </button>
      </div>

      {/* Table Container (neon-inner-box with horizontal grid rows matching poster 100%) */}
      <div className="neon-inner-box overflow-hidden flex-1 flex flex-col divide-y divide-purple-500/25">
        {schedule.map((slot) => (
          <div
            key={slot.id}
            className={`group flex items-center justify-between gap-3 p-3 sm:p-3.5 transition-colors ${
              slot.completed
                ? 'bg-purple-950/40'
                : 'hover:bg-purple-900/15'
            }`}
          >
            {/* Wide activity / task input column on right (RTL) */}
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={slot.task}
                onChange={(e) => onChangeTask(slot.id, e.target.value)}
                placeholder="برنامه یا فعالیت امروز را بنویسید..."
                className={`w-full bg-transparent text-sm sm:text-base outline-none transition-all ${
                  slot.completed
                    ? 'text-purple-300/60 line-through'
                    : 'text-purple-100 placeholder-purple-400/40'
                }`}
              />
            </div>

            {/* Vertical column divider matching the poster */}
            <div className="w-px h-6 bg-purple-500/30 shrink-0 mx-1 sm:mx-2" />

            {/* Completion checkbox on left (RTL) + delete button on hover */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRemoveSlot(slot.id)}
                className="no-print opacity-0 group-hover:opacity-100 focus:opacity-100 text-purple-400/60 hover:text-red-400 p-1 transition-all"
                title="حذف این ردیف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleSlot(slot.id)}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 border-2 shrink-0 ${
                  slot.completed
                    ? 'bg-purple-500 border-purple-300 text-white shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                  : 'bg-purple-950/30 border-purple-400/60 hover:border-purple-300'
                }`}
                title={slot.completed ? 'انجام شد' : 'علامت به عنوان انجام‌شده'}
              >
                {slot.completed && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>
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
