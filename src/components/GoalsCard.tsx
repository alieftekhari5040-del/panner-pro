import React from 'react';
import type { GoalItem } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface GoalsCardProps {
  goals: GoalItem[];
  onChangeText: (id: string, text: string) => void;
  onAddGoal: () => void;
  onRemoveGoal: (id: string) => void;
}

export const GoalsCard: React.FC<GoalsCardProps> = ({
  goals,
  onChangeText,
  onAddGoal,
  onRemoveGoal,
}) => {
  return (
    <div className="neon-box p-5 sm:p-6 flex flex-col gap-4">
      {/* Card Title with indicator pill and Add Goal button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.9)] animate-pulse" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            اهداف امروز
          </h2>
          {goals.length > 0 && (
            <span className="no-print text-[11px] font-bold bg-purple-900/50 border border-purple-400/30 text-purple-200 px-2 py-0.5 rounded-full">
              {goals.length} هدف
            </span>
          )}
        </div>
        <button
          onClick={onAddGoal}
          className="no-print flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/50 hover:bg-purple-800/70 border border-purple-500/40 text-purple-200 hover:text-white text-xs transition-all shadow-sm hover:scale-105"
          title="افزودن هدف جدید"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>هدف جدید</span>
        </button>
      </div>

      {/* Inner glowing bordered container with horizontal ruled lines */}
      <div className="neon-inner-box p-4 sm:p-5 flex flex-col gap-3">
        {goals.map((goal, idx) => (
          <div key={goal.id} className="row-interactive flex items-center gap-2.5 p-2 rounded-xl group">
            <span className="text-xs font-semibold text-purple-400/70 w-4 select-none">
              {idx + 1}.
            </span>
            <input
              type="text"
              value={goal.text}
              onChange={(e) => onChangeText(goal.id, e.target.value)}
              placeholder="هدف خود برای امروز را بنویسید..."
              className="w-full bg-transparent pb-1 px-1 text-sm sm:text-base text-purple-100 placeholder-purple-400/40 border-b border-purple-500/30 focus:border-purple-300 outline-none transition-all"
            />
            <button
              onClick={() => onRemoveGoal(goal.id)}
              className="no-print opacity-0 group-hover:opacity-100 focus:opacity-100 text-purple-400/60 hover:text-red-400 p-1.5 transition-all hover:scale-110"
              title="حذف این هدف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="text-center py-3 text-purple-400/60 text-sm">
            هیچ هدفی ثبت نشده است. روی «هدف جدید» کلیک کنید.
          </div>
        )}
      </div>
    </div>
  );
};
