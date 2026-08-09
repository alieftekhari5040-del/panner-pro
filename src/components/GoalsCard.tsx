import React from 'react';
import type { GoalItem } from '../types';

interface GoalsCardProps {
  goals: GoalItem[];
  onChangeText: (id: string, text: string) => void;
}

export const GoalsCard: React.FC<GoalsCardProps> = ({
  goals,
  onChangeText,
}) => {
  return (
    <div className="neon-box p-5 sm:p-6 flex flex-col gap-4">
      {/* Card Title with indicator pill */}
      <div className="flex items-center gap-2.5">
        <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          اهداف امروز
        </h2>
      </div>

      {/* Inner glowing bordered container with horizontal ruled lines */}
      <div className="neon-inner-box p-4 sm:p-5 flex flex-col gap-4">
        {goals.map((goal, idx) => (
          <div key={goal.id} className="flex items-center gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
};
