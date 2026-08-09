import React from 'react';
import type { PriorityTask } from '../types';
import { Check } from 'lucide-react';

interface PrioritiesCardProps {
  priorities: PriorityTask[];
  onToggle: (id: string) => void;
  onChangeText: (id: string, text: string) => void;
}

export const PrioritiesCard: React.FC<PrioritiesCardProps> = ({
  priorities,
  onToggle,
  onChangeText,
}) => {
  return (
    <div className="neon-box p-5 sm:p-6 flex flex-col gap-4">
      {/* Card Title with Red/Orange indicator pill on right (RTL) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            اولویت کارها
          </h2>
        </div>
      </div>

      {/* List of 5 priority rows */}
      <div className="flex flex-col gap-4 mt-2">
        {priorities.map((task) => (
          <div key={task.id} className="flex items-center gap-3.5 group">
            {/* Square rounded checkbox */}
            <button
              onClick={() => onToggle(task.id)}
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 border-2 shrink-0 ${
                task.completed
                  ? 'bg-purple-500 border-purple-300 text-white shadow-[0_0_12px_rgba(168,85,247,0.8)]'
                  : 'bg-purple-950/30 border-purple-400/60 hover:border-purple-300'
              }`}
              title={task.completed ? 'انجام شد' : 'علامت به عنوان انجام‌شده'}
            >
              {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            {/* Ruled / Dotted input line */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={task.text}
                onChange={(e) => onChangeText(task.id, e.target.value)}
                placeholder="کاری که امروز باید انجام شود..."
                className={`w-full bg-transparent pb-1 px-1 text-sm sm:text-base border-b border-purple-500/40 focus:border-purple-300 outline-none transition-all ${
                  task.completed
                    ? 'text-purple-300/60 line-through'
                    : 'text-purple-100 placeholder-purple-400/40'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
