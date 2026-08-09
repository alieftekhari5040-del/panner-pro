import React from 'react';
import type { PriorityTask } from '../types';
import { Check, Plus, Trash2 } from 'lucide-react';

interface PrioritiesCardProps {
  priorities: PriorityTask[];
  onToggle?: (id: string) => void;
  onTogglePriority?: (id: string) => void;
  onChangeText: (id: string, text: string) => void;
  onAddPriority: () => void;
  onRemovePriority: (id: string) => void;
}

export const PrioritiesCard: React.FC<PrioritiesCardProps> = ({
  priorities,
  onToggle,
  onTogglePriority,
  onChangeText,
  onAddPriority,
  onRemovePriority,
}) => {
  const completedCount = priorities.filter((p) => p.completed).length;
  const handleToggle = onToggle || onTogglePriority || (() => {});

  return (
    <div className="neon-box p-5 sm:p-6 flex flex-col gap-4 h-full">
      {/* Card Title & Add Task button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            اولویت کارها
          </h2>
          {priorities.length > 0 && (
            <span className="no-print text-[11px] font-bold bg-purple-900/50 border border-purple-400/30 text-purple-200 px-2.5 py-0.5 rounded-full">
              {completedCount} از {priorities.length}
            </span>
          )}
        </div>
        <button
          onClick={onAddPriority}
          className="no-print flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-800/70 border border-purple-500/40 text-purple-200 hover:text-white text-xs transition-colors shadow-sm"
          title="افزودن کار یا اولویت جدید"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>تسک جدید</span>
        </button>
      </div>

      {/* List of priority rows aligned 100% with GoalsCard */}
      <div className="flex flex-col gap-3 mt-1">
        {priorities.map((task, idx) => (
          <div key={task.id} className="row-interactive flex items-center gap-3 p-2.5 rounded-xl group">
            {/* Square rounded checkbox on right (RTL) */}
            <button
              onClick={() => handleToggle(task.id)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 border-2 shrink-0 ${
                task.completed
                  ? 'bg-purple-500 border-purple-300 text-white shadow-[0_0_10px_rgba(168,85,247,0.7)]'
                  : 'bg-purple-950/40 border-purple-400/60 hover:border-purple-300'
              }`}
              title={task.completed ? 'انجام شد' : 'علامت به عنوان انجام‌شده'}
            >
              {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            {/* Numbering (.1, .2, ...) */}
            <span className="text-xs sm:text-sm font-semibold text-purple-300/80 w-5 select-none shrink-0 text-center">
              {idx + 1}.
            </span>

            {/* Ruled / Dotted input line */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={task.text}
                onChange={(e) => onChangeText(task.id, e.target.value)}
                placeholder="کاری که امروز باید انجام شود..."
                className={`w-full bg-transparent pb-1 px-1 text-sm sm:text-base border-b border-purple-500/40 focus:border-purple-300 outline-none transition-colors ${
                  task.completed
                    ? 'text-purple-300/60 line-through'
                    : 'text-purple-100 placeholder-purple-400/40'
                }`}
              />
            </div>

            {/* Remove task button on hover */}
            <button
              onClick={() => onRemovePriority(task.id)}
              className="no-print opacity-0 group-hover:opacity-100 focus:opacity-100 text-purple-400/60 hover:text-red-400 p-1.5 transition-colors shrink-0"
              title="حذف این کار"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {priorities.length === 0 && (
          <div className="text-center py-4 text-purple-400/60 text-sm">
            هیچ کاری وجود ندارد. روی «تسک جدید» کلیک کنید.
          </div>
        )}
      </div>
    </div>
  );
};
