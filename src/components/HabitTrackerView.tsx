import React, { useState, useEffect } from 'react';
import type { WeekdayName } from '../types';
import { ALL_WEEKDAYS } from '../utils/jalali';
import { Check, Plus, Trash2, Flame, Award, BookOpen, PlayCircle, Dumbbell, Sparkles } from 'lucide-react';
import { playCheckSound } from '../utils/sound';

export interface HabitTrackItem {
  id: string;
  name: string;
  icon: string;
  days: Record<WeekdayName, boolean>;
}

const HABITS_STORAGE_KEY = 'ascent_blueprint_habits_v2';

const DEFAULT_HABITS: HabitTrackItem[] = [
  {
    id: 'h_1',
    name: 'مطالعه روزانه (حداقل ۳۰ دقیقه)',
    icon: 'book',
    days: {
      'شنبه': true,
      'یکشنبه': true,
      'دوشنبه': false,
      'سه‌شنبه': true,
      'چهارشنبه': false,
      'پنج‌شنبه': false,
      'جمعه': false,
    },
  },
  {
    id: 'h_2',
    name: 'تسک رشد فردی (دوره، ویدیو یا پادکست)',
    icon: 'growth',
    days: {
      'شنبه': true,
      'یکشنبه': true,
      'دوشنبه': true,
      'سه‌شنبه': false,
      'چهارشنبه': true,
      'پنج‌شنبه': false,
      'جمعه': false,
    },
  },
  {
    id: 'h_3',
    name: 'تمرین / بدنسازی (ورزش روزانه)',
    icon: 'workout',
    days: {
      'شنبه': true,
      'یکشنبه': false,
      'دوشنبه': true,
      'سه‌شنبه': false,
      'چهارشنبه': true,
      'پنج‌شنبه': false,
      'جمعه': false,
    },
  },
  {
    id: 'h_4',
    name: 'نوشیدن ۸ لیوان آب در طول روز',
    icon: 'sparkles',
    days: {
      'شنبه': true,
      'یکشنبه': true,
      'دوشنبه': true,
      'سه‌شنبه': true,
      'چهارشنبه': true,
      'پنج‌شنبه': false,
      'جمعه': false,
    },
  },
];

export const HabitTrackerView: React.FC = () => {
  const [habits, setHabits] = useState<HabitTrackItem[]>(() => {
    try {
      const saved = localStorage.getItem(HABITS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_HABITS;
  });

  const [newHabitName, setNewHabitName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch {
      // ignore
    }
  }, [habits]);

  const handleToggleDay = (id: string, day: WeekdayName) => {
    playCheckSound(true);
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              days: {
                ...h.days,
                [day]: !h.days[day],
              },
            }
          : h
      )
    );
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const item: HabitTrackItem = {
      id: `h_${Date.now()}`,
      name: newHabitName.trim(),
      icon: 'sparkles',
      days: {
        'شنبه': false,
        'یکشنبه': false,
        'دوشنبه': false,
        'سه‌شنبه': false,
        'چهارشنبه': false,
        'پنج‌شنبه': false,
        'جمعه': false,
      },
    };
    setHabits((prev) => [...prev, item]);
    setNewHabitName('');
    setIsAdding(false);
  };

  const handleRemoveHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const calculateStreak = (item: HabitTrackItem): number => {
    let streak = 0;
    // count consecutive from Saturday
    for (const day of ALL_WEEKDAYS) {
      if (item.days[day]) {
        streak++;
      } else if (streak > 0) {
        // breaks streak
        break;
      }
    }
    return streak;
  };

  const calculatePercent = (item: HabitTrackItem): number => {
    const done = ALL_WEEKDAYS.filter((d) => item.days[d]).length;
    return Math.round((done / 7) * 100);
  };

  const getIcon = (iconType: string) => {
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

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in">
      {/* Header card */}
      <div className="neon-box p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              ردیاب عادت‌ها (Habit Tracker)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-purple-300/80 mt-1">
            پیگیری روزانه عادت‌های موفقیت و مشاهده زنجیره‌ی استریک (Streak) در طول هفته
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن عادت جدید</span>
        </button>
      </div>

      {/* Add Habit Modal/Form */}
      {isAdding && (
        <form onSubmit={handleAddHabit} className="neon-box p-5 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="نام عادت جدید (مثلاً: ۳۰ دقیقه ورزش صبحگاهی)..."
            className="flex-1 w-full bg-purple-950/40 border border-purple-400/40 rounded-xl px-3 py-2 text-sm text-purple-100 placeholder-purple-400/50 outline-none focus:border-purple-300"
            autoFocus
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-all"
            >
              افزودن
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 text-xs font-medium"
            >
              انصراف
            </button>
          </div>
        </form>
      )}

      {/* Weekly Tracker Matrix Table */}
      <div className="neon-box p-5 sm:p-6 overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-purple-500/30 text-xs sm:text-sm font-semibold text-purple-300">
              <th className="pb-4 pl-4 font-bold text-white">عادت روزانه</th>
              {ALL_WEEKDAYS.map((day) => (
                <th key={day} className="pb-4 px-2 text-center">
                  {day}
                </th>
              ))}
              <th className="pb-4 px-3 text-center">استریک (Streak)</th>
              <th className="pb-4 px-3 text-center">پیشرفت هفته</th>
              <th className="pb-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/20">
            {habits.map((item) => {
              const streak = calculateStreak(item);
              const percent = calculatePercent(item);

              return (
                <tr key={item.id} className="row-interactive group">
                  {/* Habit Name & Icon */}
                  <td className="py-3.5 pl-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/40 flex items-center justify-center shrink-0">
                        {getIcon(item.icon)}
                      </div>
                      <span className="text-sm sm:text-base font-medium text-white">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* 7 Checkboxes for Saturday -> Friday */}
                  {ALL_WEEKDAYS.map((day) => {
                    const done = item.days[day];
                    return (
                      <td key={day} className="py-3.5 px-2 text-center">
                        <button
                          onClick={() => handleToggleDay(item.id, day)}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all duration-200 border-2 ${
                            done
                              ? 'bg-purple-600 border-purple-300 text-white shadow-[0_0_12px_rgba(168,85,247,0.7)]'
                              : 'bg-purple-950/40 border-purple-400/50 hover:border-purple-300'
                          }`}
                          title={done ? `${day}: انجام شد` : `${day}: انجام نشده`}
                        >
                          {done && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>
                      </td>
                    );
                  })}

                  {/* Streak Badge */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-900/40 border border-purple-400/30 text-xs font-bold text-orange-400">
                      <Flame className="w-3.5 h-3.5 fill-orange-400" />
                      <span>{streak} روز</span>
                    </div>
                  </td>

                  {/* Percent progress bar */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-purple-950/70 rounded-full h-2 overflow-hidden border border-purple-500/30">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-purple-200">{percent}٪</span>
                    </div>
                  </td>

                  {/* Delete button */}
                  <td className="py-3.5 text-center">
                    <button
                      onClick={() => handleRemoveHabit(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-purple-400/60 hover:text-red-400 p-1.5 transition-all"
                      title="حذف این عادت"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
