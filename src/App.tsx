import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import type { DayPlannerData, WeekdayName } from './types';
import { loadDayData, saveDayData, resetDayData } from './utils/storage';
import { getTodayWeekdayName, getJalaliStringForWeekday, getNextWeekdayName, ALL_WEEKDAYS } from './utils/jalali';
import { playCheckSound } from './utils/sound';
import { Header } from './components/Header';
import { Tabs, type TabId } from './components/Tabs';
import { DateWeekBar } from './components/DateWeekBar';
import { PrioritiesCard } from './components/PrioritiesCard';
import { GoalsCard } from './components/GoalsCard';
import { ScheduleCard } from './components/ScheduleCard';
import { LessonsCard } from './components/LessonsCard';
import { FooterBar } from './components/FooterBar';
import { StorageModal } from './components/StorageModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { HabitTrackerView } from './components/HabitTrackerView';
import { StatsAnalyticsView } from './components/StatsAnalyticsView';

const LAST_WEEKDAY_KEY = 'ascent_blueprint_last_weekday';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [activeWeekday, setActiveWeekday] = useState<WeekdayName>(() => {
    try {
      const last = localStorage.getItem(LAST_WEEKDAY_KEY) as WeekdayName;
      if (last && ALL_WEEKDAYS.includes(last)) return last;
    } catch {}
    return getTodayWeekdayName();
  });
  const [data, setData] = useState<DayPlannerData>(() => loadDayData(activeWeekday));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcuts for Laptop Users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setActiveTab('today');
      } else if (e.altKey && e.key === '2') {
        e.preventDefault();
        setActiveTab('habits');
      } else if (e.altKey && e.key === '3') {
        e.preventDefault();
        setActiveTab('stats');
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        saveDayData(data);
        setIsStorageModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data]);

  // When activeWeekday changes, load data from storage and ensure date matches that weekday
  useEffect(() => {
    try {
      localStorage.setItem(LAST_WEEKDAY_KEY, activeWeekday);
    } catch {}
    const loaded = loadDayData(activeWeekday);
    const expectedDate = getJalaliStringForWeekday(activeWeekday);
    setData({
      ...loaded,
      dateStr: loaded.dateStr || expectedDate,
    });
  }, [activeWeekday]);

  // AUTOMATIC BROWSER SAVING ON EVERY CHANGE
  useEffect(() => {
    saveDayData(data);
  }, [data]);

  // Calculate Progress Percent: Dedicated 100% to Today's Schedule (برنامه‌ی امروز) as requested
  const totalScheduleCount = data.schedule.length;
  const completedScheduleCount = data.schedule.filter((s) => s.completed).length;

  const progressPercent =
    totalScheduleCount > 0 ? Math.round((completedScheduleCount / totalScheduleCount) * 100) : 0;

  // Trigger Confetti when 100% of Today's Schedule is completed (if at least 1 schedule row completed)
  useEffect(() => {
    if (progressPercent === 100 && completedScheduleCount >= 1) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [progressPercent, completedScheduleCount]);

  // Handler: Change Date String manually
  const handleDateChange = (newDate: string) => {
    setData((prev) => ({ ...prev, dateStr: newDate }));
  };

  // Handler: Select Weekday
  const handleSelectWeekday = (day: WeekdayName) => {
    playCheckSound(soundEnabled);
    setActiveWeekday(day);
  };

  // Handler: Prev Day
  const handlePrevDay = () => {
    const prevDay = getNextWeekdayName(activeWeekday, -1);
    handleSelectWeekday(prevDay);
  };

  // Handler: Next Day
  const handleNextDay = () => {
    const nextDay = getNextWeekdayName(activeWeekday, 1);
    handleSelectWeekday(nextDay);
  };

  // Handler: Today
  const handleToday = () => {
    const todayDay = getTodayWeekdayName();
    handleSelectWeekday(todayDay);
  };

  // Handler: Toggle Priority Checkbox
  const handleTogglePriority = (id: string) => {
    playCheckSound(soundEnabled);
    setData((prev) => ({
      ...prev,
      priorities: prev.priorities.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  // Handler: Change Priority Text
  const handleChangePriorityText = (id: string, text: string) => {
    setData((prev) => ({
      ...prev,
      priorities: prev.priorities.map((item) =>
        item.id === id ? { ...item, text } : item
      ),
    }));
  };

  // Handler: Add Priority Task
  const handleAddPriority = () => {
    setData((prev) => ({
      ...prev,
      priorities: [
        ...prev.priorities,
        {
          id: `p_${Date.now()}`,
          text: '',
          completed: false,
        },
      ],
    }));
  };

  // Handler: Remove Priority Task
  const handleRemovePriority = (id: string) => {
    setData((prev) => ({
      ...prev,
      priorities: prev.priorities.filter((item) => item.id !== id),
    }));
  };

  // Handler: Toggle Goal Checkbox
  const handleToggleGoal = (id: string) => {
    playCheckSound(soundEnabled);
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  // Handler: Change Goal Text
  const handleChangeGoalText = (id: string, text: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((item) =>
        item.id === id ? { ...item, text } : item
      ),
    }));
  };

  // Handler: Add Goal Item
  const handleAddGoal = () => {
    setData((prev) => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          id: `g_${Date.now()}`,
          text: '',
          completed: false,
        },
      ],
    }));
  };

  // Handler: Remove Goal Item
  const handleRemoveGoal = (id: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((item) => item.id !== id),
    }));
  };

  // Handler: Toggle Schedule Slot
  const handleToggleSlot = (id: string) => {
    playCheckSound(soundEnabled);
    setData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((slot) =>
        slot.id === id ? { ...slot, completed: !slot.completed } : slot
      ),
    }));
  };

  // Handler: Change Schedule Task
  const handleChangeSlotTask = (id: string, task: string) => {
    setData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((slot) =>
        slot.id === id ? { ...slot, task } : slot
      ),
    }));
  };

  // Handler: Add Schedule Slot
  const handleAddSlot = () => {
    setData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          id: `slot_${Date.now()}`,
          time: '',
          task: '',
          completed: false,
        },
      ],
    }));
  };

  // Handler: Remove Schedule Slot
  const handleRemoveSlot = (id: string) => {
    setData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((s) => s.id !== id),
    }));
  };

  // Handler: Change Lesson Text
  const handleChangeLesson = (index: number, text: string) => {
    setData((prev) => {
      const newLessons = [...prev.lessons];
      newLessons[index] = text;
      return { ...prev, lessons: newLessons };
    });
  };

  // Handler: Add Lesson
  const handleAddLesson = () => {
    setData((prev) => ({
      ...prev,
      lessons: [...prev.lessons, ''],
    }));
  };

  // Handler: Remove Lesson
  const handleRemoveLesson = (index: number) => {
    setData((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index),
    }));
  };

  // Handler: Reset Today
  const handleReset = () => {
    if (window.confirm(`آیا از بازنشانی داده‌های روز ${activeWeekday} اطمینان دارید؟`)) {
      const reset = resetDayData(activeWeekday);
      setData(reset);
    }
  };

  // Handler: Export as PNG Poster
  const handleExportPng = async () => {
    if (!boardRef.current) return;
    setIsExporting(true);
    try {
      boardRef.current.classList.add('exporting-poster');
      const canvas = await html2canvas(boardRef.current, {
        backgroundColor: '#070514',
        scale: 2, // High resolution poster
        useCORS: true,
        logging: false,
      });
      boardRef.current.classList.remove('exporting-poster');

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Ascent-Blueprint-Planner-${activeWeekday}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handler: Reload when data restored from import
  const handleDataRestored = () => {
    const loaded = loadDayData(activeWeekday);
    setData(loaded);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center justify-start sm:justify-center p-3 sm:p-5 md:p-6">
      {/* Calm, Static Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#070514] overflow-hidden">
        <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[550px] h-[550px] bg-indigo-950/30 rounded-full blur-[160px]" />
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 w-[650px] h-[350px] bg-purple-800/10 rounded-full blur-[180px]" />
      </div>

      {/* Main Printable Planner Board Container: STABLE, SOLID, NO MOVEMENT/SHAKING */}
      <div
        ref={boardRef}
        className="w-full max-w-[1140px] bg-[#0c081e]/90 border-2 border-purple-500/50 rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(139,92,246,0.25)] backdrop-blur-2xl relative my-auto"
      >
        {/* Header & Controls */}
        <Header
          progressPercent={progressPercent}
          completedScheduleCount={completedScheduleCount}
          totalScheduleCount={totalScheduleCount}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onReset={handleReset}
          onExportPng={handleExportPng}
          onOpenStorageModal={() => setIsStorageModalOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        />

        {/* 3-Tab Navigation Switcher (No-print) */}
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: Today's Planner (برنامه‌ی روزانه) */}
        {activeTab === 'today' && (
          <div className="flex flex-col gap-5 animate-in fade-in">
            {/* Date & Weekday Bar with Navigation */}
            <DateWeekBar
              dateStr={data.dateStr}
              onDateChange={handleDateChange}
              activeWeekday={activeWeekday}
              onSelectWeekday={handleSelectWeekday}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              onToday={handleToday}
            />

            {/* Main Content Area: Full-width ScheduleCard, then Priorities & Goals side-by-side below it */}
            <div className="flex flex-col gap-5">
              {/* Top: Today's Schedule (برنامه‌ی امروز) */}
              <ScheduleCard
                schedule={data.schedule}
                onChangeTask={handleChangeSlotTask}
                onToggleSlot={handleToggleSlot}
                onAddSlot={handleAddSlot}
                onRemoveSlot={handleRemoveSlot}
              />

              {/* Below Today's Schedule: Priorities and Goals side by side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                <PrioritiesCard
                  priorities={data.priorities}
                  onToggle={handleTogglePriority}
                  onChangeText={handleChangePriorityText}
                  onAddPriority={handleAddPriority}
                  onRemovePriority={handleRemovePriority}
                />
                <GoalsCard
                  goals={data.goals}
                  onToggleGoal={handleToggleGoal}
                  onChangeText={handleChangeGoalText}
                  onAddGoal={handleAddGoal}
                  onRemoveGoal={handleRemoveGoal}
                />
              </div>
            </div>

            {/* Bottom Section (Lessons Learned Today) */}
            <LessonsCard
              lessons={data.lessons}
              onChangeLesson={handleChangeLesson}
              onAddLesson={handleAddLesson}
              onRemoveLesson={handleRemoveLesson}
            />
          </div>
        )}

        {/* Tab 2: Habit Tracker (ردیاب عادت‌ها) */}
        {activeTab === 'habits' && <HabitTrackerView />}

        {/* Tab 3: Statistics & Analytics (آمار و عملکرد) */}
        {activeTab === 'stats' && <StatsAnalyticsView />}

        {/* Poster Footer Bar */}
        <FooterBar />
      </div>

      {/* Persistent Storage Backup/Restore Modal */}
      <StorageModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        onDataRestored={handleDataRestored}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Export loading badge */}
      {isExporting && (
        <div className="fixed bottom-6 left-6 z-50 bg-purple-900/95 border border-purple-400 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-sm flex items-center gap-2.5">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>در حال تولید پوستر با کیفیت بالا...</span>
        </div>
      )}
    </div>
  );
}
