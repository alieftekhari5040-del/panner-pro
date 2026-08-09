import React, { useState } from 'react';
import type { DailyHabit } from '../types';
import { BookOpen, PlayCircle, Dumbbell, Sparkles, Check, Plus, X } from 'lucide-react';

interface HabitsCardProps {
  habits: DailyHabit[];
  onToggle: (id: string) => void;
  onAddHabit: (text: string) => void;
  onRemoveHabit: (id: string) => void;
}

export const HabitsCard: React.FC<HabitsCardProps> = ({
  habits,
  onToggle,
  onAddHabit,
  onRemoveHabit,
}) => {
  const [newHabitText, setNewHabitText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const getIcon = (iconType: DailyHabit['icon']) => {
    switch (iconType) {
      case 'book':
        return <BookOpen className="w-4 h-4 text-purple-300" />;
      case 'growth':
        return <PlayCircle className="w-4 h-4 text-purple-300" />;
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-purple-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-300" />;
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    onAddHabit(newHabitText.trim());
    setNewHabitText('');
    setIsAdding(false);
  };

  return (
    <div className="neon-box p-5 sm:p-6 flex flex-col gap-4">
      {/* Card Title with indicator pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            اولویت امروز
          </h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="no-print p-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-1 transition-all"
          title="افزودن عادت دلخواه"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">عادت جدید</span>
        </button>
      </div>

      {/* Optional New Habit Form (no-print) */}
      {isAdding && (
        <form onSubmit={handleAdd} className="no-print flex items-center gap-2 bg-purple-950/50 p-2 rounded-lg border border-purple-500/40">
          <input
            type="text"
            value={newHabitText}
            onChange={(e) => setNewHabitText(e.target.value)}
            placeholder="عنوان عادت یا برنامه جدید..."
            className="flex-1 bg-transparent text-sm text-purple-100 placeholder-purple-400/50 outline-none px-2"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
          >
            افزودن
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1 rounded text-purple-400 hover:text-purple-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* List of Habits (Exactly matching poster layout) */}
      <div className="flex flex-col gap-3.5 mt-1">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="group flex items-center justify-between gap-3 p-2 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20 transition-all"
          >
            {/* Right side (RTL): Icon and Text */}
            <div className="flex items-center gap-3">
              {/* Icon box */}
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/40 flex items-center justify-center shrink-0 shadow-sm">
                {getIcon(habit.icon)}
              </div>
              <span
                className={`text-sm sm:text-base font-medium transition-all ${
                  habit.completed ? 'text-purple-300/60 line-through' : 'text-purple-100'
                }`}
              >
                {habit.text}
              </span>
            </div>

            {/* Middle: Dashed dotted connector line */}
            <div className="hidden sm:block flex-1 border-b border-dashed border-purple-500/40 mx-2" />

            {/* Left side (RTL): Square Checkbox + optional delete for custom items */}
            <div className="flex items-center gap-2">
              {habit.icon === 'custom' && (
                <button
                  onClick={() => onRemoveHabit(habit.id)}
                  className="no-print opacity-0 group-hover:opacity-100 text-red-400/70 hover:text-red-400 p-1 transition-all"
                  title="حذف"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => onToggle(habit.id)}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 border-2 shrink-0 ${
                  habit.completed
                    ? 'bg-purple-500 border-purple-300 text-white shadow-[0_0_12px_rgba(168,85,247,0.8)]'
                    : 'bg-purple-950/30 border-purple-400/60 hover:border-purple-300'
                }`}
                title={habit.completed ? 'انجام شد' : 'علامت به عنوان انجام‌شده'}
              >
                {habit.completed && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
