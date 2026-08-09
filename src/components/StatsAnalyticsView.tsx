import React, { useState } from 'react';
import type { WeekdayName } from '../types';
import { ALL_WEEKDAYS, getWeekIsoDates, toIsoDateString, addDaysToIso, formatShortJalaliDate, parseIsoDate } from '../utils/jalali';
import { loadDayDataByIso } from '../utils/storage';
import {
  BarChart3,
  Award,
  CheckCircle2,
  Calendar,
  Flame,
  Target,
  Clock,
  Sparkles,
  Filter,
} from 'lucide-react';
import type { HabitTrackItem } from './HabitTrackerView';

interface StatsProps {
  currentIsoDate?: string;
}

type FilterCategory = 'all' | 'schedule' | 'priorities' | 'goals';

export const StatsAnalyticsView: React.FC<StatsProps> = ({
  currentIsoDate = toIsoDateString(),
}) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');

  // Calculate dates to inspect based on timeframe
  const datesToInspect = React.useMemo(() => {
    if (timeframe === 'week') {
      return getWeekIsoDates(currentIsoDate).map((d) => ({
        iso: d.iso,
        dayName: d.day,
        label: d.label,
      }));
    } else {
      // 30 days up to currentIsoDate
      const arr = [];
      for (let i = 29; i >= 0; i--) {
        const iso = addDaysToIso(currentIsoDate, -i);
        const dateObj = parseIsoDate(iso);
        arr.push({
          iso,
          dayName: formatShortJalaliDate(dateObj),
          label: formatShortJalaliDate(dateObj),
        });
      }
      return arr;
    }
  }, [currentIsoDate, timeframe]);

  // Load stats for inspected dates
  const dayStats = React.useMemo(() => {
    return datesToInspect.map((item) => {
      const data = loadDayDataByIso(item.iso);

      const activePriorities = data.priorities.filter((p) => p.text.trim().length > 0 || p.completed);
      const prioritiesTotal = activePriorities.length;
      const prioritiesDone = activePriorities.filter((p) => p.completed).length;

      const activeGoals = data.goals.filter((g) => g.text.trim().length > 0 || g.completed);
      const goalsTotal = activeGoals.length;
      const goalsDone = activeGoals.filter((g) => g.completed).length;

      const activeSchedule = data.schedule.filter((s) => s.task.trim().length > 0 || s.completed);
      const scheduleTotal = activeSchedule.length;
      const scheduleDone = activeSchedule.filter((s) => s.completed).length;

      let total = prioritiesTotal + goalsTotal + scheduleTotal;
      let completed = prioritiesDone + goalsDone + scheduleDone;

      if (categoryFilter === 'schedule') {
        total = scheduleTotal;
        completed = scheduleDone;
      } else if (categoryFilter === 'priorities') {
        total = prioritiesTotal;
        completed = prioritiesDone;
      } else if (categoryFilter === 'goals') {
        total = goalsTotal;
        completed = goalsDone;
      }

      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        iso: item.iso,
        day: item.dayName,
        label: item.label,
        total,
        completed,
        percent,
        prioritiesTotal,
        prioritiesDone,
        goalsTotal,
        goalsDone,
        scheduleTotal,
        scheduleDone,
      };
    });
  }, [datesToInspect, categoryFilter]);

  // Load habits from storage
  const [habits] = useState<HabitTrackItem[]>(() => {
    try {
      const saved = localStorage.getItem('ascent_blueprint_habits_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Calculate overall habit success rate
  const totalHabitDays = habits.length * 7;
  const completedHabitDays = habits.reduce((acc, h) => {
    const doneCount = ALL_WEEKDAYS.filter((d) => h.days[d]).length;
    return acc + doneCount;
  }, 0);
  const habitRate = totalHabitDays > 0 ? Math.round((completedHabitDays / totalHabitDays) * 100) : 0;

  // Calculate overall category averages across active items only
  const totalPrioritiesAll = dayStats.reduce((acc, d) => acc + d.prioritiesTotal, 0);
  const donePrioritiesAll = dayStats.reduce((acc, d) => acc + d.prioritiesDone, 0);
  const prioritiesAvg = totalPrioritiesAll > 0 ? Math.round((donePrioritiesAll / totalPrioritiesAll) * 100) : 0;

  const totalGoalsAll = dayStats.reduce((acc, d) => acc + d.goalsTotal, 0);
  const doneGoalsAll = dayStats.reduce((acc, d) => acc + d.goalsDone, 0);
  const goalsAvg = totalGoalsAll > 0 ? Math.round((doneGoalsAll / totalGoalsAll) * 100) : 0;

  const totalScheduleAll = dayStats.reduce((acc, d) => acc + d.scheduleTotal, 0);
  const doneScheduleAll = dayStats.reduce((acc, d) => acc + d.scheduleDone, 0);
  const scheduleAvg = totalScheduleAll > 0 ? Math.round((doneScheduleAll / totalScheduleAll) * 100) : 0;

  const totalTasksCompleted = dayStats.reduce((acc, curr) => acc + curr.completed, 0);
  const totalTasksAll = dayStats.reduce((acc, curr) => acc + curr.total, 0);
  const periodAverage = totalTasksAll > 0 ? Math.round((totalTasksCompleted / totalTasksAll) * 100) : 0;

  // Find most productive day
  const bestDayObj = [...dayStats].sort((a, b) => b.completed - a.completed)[0] || dayStats[0];

  // Interactive selected day for breakdown
  const [selectedIso, setSelectedIso] = useState<string>(bestDayObj.iso);
  const selectedDayData = dayStats.find((d) => d.iso === selectedIso) || dayStats[0];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in">
      {/* Header Banner & Timeframe Switcher */}
      <div className="neon-box p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              آمار و تحلیل واقعی عملکرد (Real Productivity Analytics)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-purple-300/80 mt-1">
            ارزیابی دقیق عملکرد روزانه و هفتگی شما بر اساس تاریخ‌های شمسی واقعی
          </p>
        </div>
        
        {/* Timeframe selector tabs */}
        <div className="flex items-center gap-1 bg-purple-950/60 p-1 rounded-xl border border-purple-500/30">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              timeframe === 'week'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            هفته جاری
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              timeframe === 'month'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            ۳۰ روز گذشته (Heatmap)
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Period average */}
        <div className="neon-box p-5 flex items-center justify-between group hover:border-purple-400/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/25 border border-purple-400/40 flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <p className="text-xs text-purple-300/90 font-medium">راندمان {timeframe === 'week' ? 'این هفته' : '۳۰ روز'}</p>
              <p className="text-2xl font-black text-white mt-0.5">{periodAverage}٪</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full shrink-0">
            واقعی
          </span>
        </div>

        {/* Card 2: Total Completed */}
        <div className="neon-box p-5 flex items-center justify-between group hover:border-indigo-400/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/25 border border-indigo-400/40 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs text-purple-300/90 font-medium">کارهای انجام‌شده</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-baseline gap-1.5">
                <span>{totalTasksCompleted}</span>
                <span className="text-xs sm:text-sm font-semibold text-purple-300">
                  از {totalTasksAll} مورد
                </span>
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-300 bg-purple-900/50 border border-purple-400/30 px-2.5 py-1 rounded-full shrink-0">
            مفید
          </span>
        </div>

        {/* Card 3: Best Day */}
        <div className="neon-box p-5 flex items-center justify-between group hover:border-pink-400/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-600/25 border border-pink-400/40 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-pink-300" />
            </div>
            <div>
              <p className="text-xs text-purple-300/90 font-medium">فعال‌ترین روز</p>
              <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                {bestDayObj.day} <span className="text-xs font-normal text-purple-300">({bestDayObj.completed} کار)</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-orange-400 bg-orange-950/60 border border-orange-500/30 px-2.5 py-1 rounded-full shrink-0">
            برتر
          </span>
        </div>

        {/* Card 4: Habit Rate */}
        <div className="neon-box p-5 flex items-center justify-between group hover:border-orange-400/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/25 border border-orange-400/40 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-purple-300/90 font-medium">پایبندی به عادت‌ها</p>
              <p className="text-2xl font-black text-white mt-0.5">{habitRate}٪</p>
            </div>
          </div>
          <span className="text-xs font-bold text-orange-300 bg-orange-900/40 border border-orange-400/30 px-2.5 py-1 rounded-full shrink-0">
            استمراری
          </span>
        </div>
      </div>

      {/* Interactive Bar Chart / Heatmap with Category Filter Switcher */}
      <div className="neon-box p-6 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{timeframe === 'week' ? 'نمودار راندمان ۷ روز هفته' : 'نقشه حرارتی ۳۰ روز گذشته (Heatmap)'}</span>
              <span className="text-xs font-normal text-purple-300 bg-purple-900/50 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                روی هر روز کلیک کنید
              </span>
            </h3>
            <p className="text-xs text-purple-300/80 mt-1">
              {timeframe === 'week'
                ? 'مشاهده میزان موفقیت روزانه بر اساس تاریخ‌های شمسی هفته جاری'
                : 'بررسی پیوستگی و میزان فعالیت شما در ۳۰ روز اخیر'}
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-purple-950/70 p-1.5 rounded-xl border border-purple-500/30">
            <span className="text-xs text-purple-300 px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              <span>فیلتر:</span>
            </span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              همه بخش‌ها
            </button>
            <button
              onClick={() => setCategoryFilter('schedule')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === 'schedule'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              برنامه‌ی امروز
            </button>
            <button
              onClick={() => setCategoryFilter('priorities')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === 'priorities'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              اولویت‌ها
            </button>
            <button
              onClick={() => setCategoryFilter('goals')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === 'goals'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              اهداف امروز
            </button>
          </div>
        </div>

        {/* Bar chart / Heatmap container */}
        {timeframe === 'week' ? (
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-60 pt-6 border-b border-purple-500/30 pb-4">
            {dayStats.map((st) => {
              const heightPx = Math.max(20, Math.round((st.percent / 100) * 170));
              const isSelected = st.iso === selectedIso;

              return (
                <button
                  key={st.iso}
                  onClick={() => setSelectedIso(st.iso)}
                  className={`flex flex-col items-center gap-2 group outline-none transition-all ${
                    isSelected ? 'scale-105' : 'hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                >
                  <span className={`text-xs font-bold transition-colors ${
                    isSelected ? 'text-orange-300 font-extrabold' : 'text-purple-200'
                  }`}>
                    {st.percent}٪
                  </span>
                  <div
                    className={`w-full max-w-[48px] rounded-t-2xl h-44 flex items-end justify-center overflow-hidden p-1 border transition-all ${
                      isSelected
                        ? 'bg-purple-900/80 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                        : 'bg-purple-950/60 border-purple-500/30 group-hover:border-purple-400'
                    }`}
                  >
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        isSelected
                          ? 'bg-gradient-to-t from-purple-600 via-pink-500 to-orange-400'
                          : 'bg-gradient-to-t from-purple-700 to-purple-500'
                      }`}
                      style={{ height: `${heightPx}px` }}
                    />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold transition-colors ${
                    isSelected ? 'text-white font-extrabold' : 'text-purple-200'
                  }`}>
                    {st.day}
                  </span>
                  <span className="text-[10px] text-purple-400">{st.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          /* 30-Day GitHub Style Contribution Heatmap */
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2.5 py-4 border-b border-purple-500/30">
            {dayStats.map((st) => {
              const isSelected = st.iso === selectedIso;
              let bgClass = 'bg-purple-950/40 border-purple-500/20';
              if (st.percent > 0 && st.percent < 40) bgClass = 'bg-purple-700/60 border-purple-500/50';
              if (st.percent >= 40 && st.percent < 75) bgClass = 'bg-purple-600 border-purple-400';
              if (st.percent >= 75) bgClass = 'bg-gradient-to-tr from-purple-500 to-orange-400 border-orange-300';

              return (
                <button
                  key={st.iso}
                  onClick={() => setSelectedIso(st.iso)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    bgClass
                  } ${isSelected ? 'ring-2 ring-orange-400 scale-105 shadow-lg' : 'hover:scale-105'}`}
                  title={`${st.day} ${st.label}: ${st.percent}٪ انجام شد`}
                >
                  <span className="text-[11px] font-bold text-white">{st.label}</span>
                  <span className="text-[10px] font-semibold text-purple-200">{st.percent}٪</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Day Detailed Scorecard Below Chart */}
        <div className="neon-inner-box p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                جزئیات عملکرد روز {selectedDayData.day} ({selectedDayData.label})
              </h4>
              <p className="text-xs text-purple-300/90 mt-0.5">
                مجموع کارهای مفید انجام‌شده در این تاریخ: <strong>{selectedDayData.completed} از {selectedDayData.total} مورد ({selectedDayData.percent}٪)</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-xs text-purple-200">
              برنامه‌ی امروز: <strong>{selectedDayData.scheduleDone}/{selectedDayData.scheduleTotal}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-xs text-purple-200">
              اولویت‌ها: <strong>{selectedDayData.prioritiesDone}/{selectedDayData.prioritiesTotal}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-xs text-purple-200">
              اهداف امروز: <strong>{selectedDayData.goalsDone}/{selectedDayData.goalsTotal}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Category Performance Breakdown & Habit Summary with 7-Day Visual Dots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Category Breakdown */}
        <div className="neon-box p-6 flex flex-col gap-5 justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-300" />
              <span>تفکیک دسته‌ای عملکرد (Category Breakdown)</span>
            </h3>
            <p className="text-xs text-purple-300/80 mt-1">
              نرخ موفقیت شما در بخش‌های مختلف برنامه روزانه
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {/* Category 1: Schedule */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-purple-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>برنامه‌ی امروز (Today Schedule)</span>
                </span>
                <span className="text-white font-bold">{scheduleAvg}٪</span>
              </div>
              <div className="w-full bg-purple-950/70 rounded-full h-2.5 overflow-hidden border border-purple-500/30">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full transition-all duration-500"
                  style={{ width: `${scheduleAvg}%` }}
                />
              </div>
            </div>

            {/* Category 2: Priorities */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-purple-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-orange-400" />
                  <span>اولویت کارها (Priorities)</span>
                </span>
                <span className="text-white font-bold">{prioritiesAvg}٪</span>
              </div>
              <div className="w-full bg-purple-950/70 rounded-full h-2.5 overflow-hidden border border-purple-500/30">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 h-full transition-all duration-500"
                  style={{ width: `${prioritiesAvg}%` }}
                />
              </div>
            </div>

            {/* Category 3: Goals */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-purple-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>اهداف امروز (Goals)</span>
                </span>
                <span className="text-white font-bold">{goalsAvg}٪</span>
              </div>
              <div className="w-full bg-purple-950/70 rounded-full h-2.5 overflow-hidden border border-purple-500/30">
                <div
                  className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${goalsAvg}%` }}
                />
              </div>
            </div>

            {/* Category 4: Habits */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-purple-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>عادت‌های روزانه (Habit Tracker)</span>
                </span>
                <span className="text-white font-bold">{habitRate}٪</span>
              </div>
              <div className="w-full bg-purple-950/70 rounded-full h-2.5 overflow-hidden border border-purple-500/30">
                <div
                  className="bg-gradient-to-r from-orange-500 to-pink-500 h-full transition-all duration-500"
                  style={{ width: `${habitRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Habit Success Summary with 7-Day Dot Pattern */}
        <div className="neon-box p-6 flex flex-col gap-4 justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span>وضعیت پایبندی به عادت‌ها و الگوی هفتگی</span>
            </h3>
            <p className="text-xs text-purple-300/80 mt-1">
              مشاهده الگوی انجام عادت‌ها در ۷ روز هفته (شنبه تا جمعه)
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            {habits.map((h) => {
              const doneDays = ALL_WEEKDAYS.filter((d) => h.days[d]).length;
              const rate = Math.round((doneDays / 7) * 100);
              return (
                <div
                  key={h.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-purple-950/40 border border-purple-500/20"
                >
                  <span className="text-xs sm:text-sm font-semibold text-purple-100">
                    {h.name}
                  </span>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* 7-Day Visual Dot Matrix (Saturday -> Friday) */}
                    <div className="flex items-center gap-1" title="وضعیت ۷ روز هفته (شنبه تا جمعه)">
                      {ALL_WEEKDAYS.map((day) => {
                        const done = h.days[day];
                        return (
                          <div
                            key={day}
                            className={`w-3 h-3 rounded-full border ${
                              done
                                ? 'bg-orange-400 border-orange-300 shadow-[0_0_6px_rgba(249,115,22,0.8)]'
                                : 'bg-purple-950/80 border-purple-500/40'
                            }`}
                            title={`${day}: ${done ? 'انجام شد' : 'انجام نشد'}`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded-md border border-purple-400/20">
                        {doneDays}/7
                      </span>
                      <span className="text-xs font-extrabold text-orange-300 w-9 text-left">
                        {rate}٪
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {habits.length === 0 && (
              <div className="text-center py-6 text-purple-400/60 text-sm">
                هنوز عادتی ثبت نشده است. به تب «ردیاب عادت‌ها» بروید.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
