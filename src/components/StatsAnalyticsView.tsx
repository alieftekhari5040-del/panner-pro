import React from 'react';
import type { WeekdayName } from '../types';
import { ALL_WEEKDAYS } from '../utils/jalali';
import { loadDayData } from '../utils/storage';
import { BarChart3, Award, TrendingUp, Calendar, Zap, CheckCircle2 } from 'lucide-react';

export const StatsAnalyticsView: React.FC = () => {
  // Calculate stats across all 7 days of the week
  const dayStats = ALL_WEEKDAYS.map((day) => {
    const data = loadDayData(day);
    const total = data.priorities.length + data.goals.length + data.schedule.length;
    const completed =
      data.priorities.filter((p) => p.completed).length +
      data.goals.filter((g) => g.completed).length +
      data.schedule.filter((s) => s.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      day,
      total,
      completed,
      percent,
    };
  });

  const totalTasksCompleted = dayStats.reduce((acc, curr) => acc + curr.completed, 0);
  const totalTasksAll = dayStats.reduce((acc, curr) => acc + curr.total, 0);
  const weeklyAverage = totalTasksAll > 0 ? Math.round((totalTasksCompleted / totalTasksAll) * 100) : 0;

  // Find most productive day
  const bestDayObj = [...dayStats].sort((a, b) => b.completed - a.completed)[0] || dayStats[0];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in">
      {/* Header */}
      <div className="neon-box p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              آمار و تحلیل عملکرد (Analytics & Performance)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-purple-300/80 mt-1">
            مشاهده نمودار پیشرفت روزهای هفته، میانگین بهره‌وری و تحلیل عملکرد شما
          </p>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Weekly average */}
        <div className="neon-box p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-400/40 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <p className="text-xs text-purple-300">میانگین بهره‌وری هفته</p>
            <p className="text-2xl font-black text-white mt-0.5">{weeklyAverage}٪</p>
          </div>
        </div>

        {/* Card 2: Total Completed */}
        <div className="neon-box p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-400/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <p className="text-xs text-purple-300">کل کارهای انجام‌شده</p>
            <p className="text-2xl font-black text-white mt-0.5">{totalTasksCompleted} مورد</p>
          </div>
        </div>

        {/* Card 3: Best Day */}
        <div className="neon-box p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-400/40 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-pink-300" />
          </div>
          <div>
            <p className="text-xs text-purple-300">فعال‌ترین روز هفته</p>
            <p className="text-xl font-bold text-white mt-0.5">{bestDayObj.day} ({bestDayObj.completed} کار)</p>
          </div>
        </div>

        {/* Card 4: Trend */}
        <div className="neon-box p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-400/40 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-orange-300" />
          </div>
          <div>
            <p className="text-xs text-purple-300">وضعیت مسیر صعود</p>
            <p className="text-base font-bold text-orange-300 mt-1">هر روز یک قدم جلوتر 🚀</p>
          </div>
        </div>
      </div>

      {/* Bar Chart for 7 Days */}
      <div className="neon-box p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white">
            نمودار پیشرفت ۷ روز هفته
          </h3>
          <span className="text-xs text-purple-300/80">
            درصد انجام کارهای برنامه‌ریزی‌شده در هر روز
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-6 border-b border-purple-500/30 pb-4">
          {dayStats.map((st) => {
            const heightPx = Math.max(16, Math.round((st.percent / 100) * 160));
            return (
              <div key={st.day} className="flex flex-col items-center gap-2 group">
                <span className="text-xs font-bold text-purple-200 opacity-80 group-hover:opacity-100">
                  {st.percent}٪
                </span>
                <div className="w-full max-w-[44px] bg-purple-950/60 rounded-t-xl h-40 flex items-end justify-center overflow-hidden p-1">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${heightPx}px` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-purple-200 mt-1">
                  {st.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Insights summary */}
      <div className="neon-box p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-400 flex items-center justify-center shrink-0">
          <Zap className="w-7 h-7 text-purple-300" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-white">
            تحلیل هوشمند عملکرد (Smart Insight)
          </h4>
          <p className="text-sm text-purple-200 mt-1 leading-relaxed">
            شما تا این لحظه در طول هفته جاری <strong>{totalTasksCompleted}</strong> فعالیت و هدف را با موفقیت به اتمام رسانده‌اید. با حفظ نظم روزانه در <strong>{bestDayObj.day}</strong> بالاترین میزان تمرکز را داشته‌اید. برای رسیدن به قله، استمرار در عادت‌ها و بررسی روزانه برنامه‌ها کلید اصلی موفقیت شماست!
          </p>
        </div>
      </div>
    </div>
  );
};
