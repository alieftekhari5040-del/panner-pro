import React from 'react';
import { Target, Check, Sparkles } from 'lucide-react';

interface OneBigThingProps {
  text: string;
  onChange: (text: string) => void;
  completed?: boolean;
  onToggle?: () => void;
}

export const OneBigThing: React.FC<OneBigThingProps> = ({
  text,
  onChange,
  completed = false,
  onToggle,
}) => {
  return (
    <div className="neon-box w-full p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-purple-950/60 border-purple-400/50 shadow-[0_0_25px_rgba(168,85,247,0.18)]">
      {/* Right side (RTL): Label */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/60 flex items-center justify-center shrink-0 shadow-sm">
          <Target className="w-5 h-5 text-orange-300" />
        </div>
        <div>
          <span className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
            <span>مهم‌ترین هدف امروز من:</span>
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          </span>
          <span className="text-[11px] text-purple-300/80 hidden sm:inline-block">
            (One Big Thing — اصلی‌ترین دستاورد امروز)
          </span>
        </div>
      </div>

      {/* Middle/Left: Editable Input & optional Checkbox */}
      <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
        <input
          type="text"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="مهم‌ترین کار یا دستاورد امروز خود را اینجا بنویسید..."
          className={`w-full bg-transparent pb-1 px-2 text-sm sm:text-base border-b border-dashed border-orange-400/50 focus:border-orange-300 outline-none transition-colors ${
            completed ? 'text-purple-300/70 line-through font-medium' : 'text-orange-200 font-bold placeholder-purple-400/40'
          }`}
        />
        {onToggle && (
          <button
            onClick={onToggle}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 border-2 shrink-0 ${
              completed
                ? 'bg-orange-500 border-orange-300 text-white shadow-[0_0_12px_rgba(249,115,22,0.8)]'
                : 'bg-purple-950/50 border-orange-400/60 hover:border-orange-300'
            }`}
            title={completed ? 'انجام شد' : 'علامت به عنوان انجام‌شده'}
          >
            {completed && <Check className="w-4 h-4 stroke-[3]" />}
          </button>
        )}
      </div>
    </div>
  );
};
