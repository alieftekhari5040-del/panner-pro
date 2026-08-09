import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import type { DayPlannerData, WeekdayName } from './types';
import { loadDayData, saveDayData, resetDayData } from './utils/storage';
import { getTodayWeekdayName } from './utils/jalali';
import { playCheckSound } from './utils/sound';
import { Header } from './components/Header';
import { DateWeekBar } from './components/DateWeekBar';
import { PrioritiesCard } from './components/PrioritiesCard';
import { GoalsCard } from './components/GoalsCard';
import { ScheduleCard } from './components/ScheduleCard';
import { LessonsCard } from './components/LessonsCard';
import { FooterBar } from './components/FooterBar';
import { InstallModal } from './components/InstallModal';

export default function App() {
  const [activeWeekday, setActiveWeekday] = useState<WeekdayName>(() => getTodayWeekdayName());
  const [data, setData] = useState<DayPlannerData>(() => loadDayData(activeWeekday));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Listen for PWA desktop install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // When activeWeekday changes, load data from storage
  useEffect(() => {
    const loaded = loadDayData(activeWeekday);
    setData(loaded);
  }, [activeWeekday]);

  // Auto-save data on every change
  useEffect(() => {
    saveDayData(data);
  }, [data]);

  // Calculate Progress Percent
  const totalItems =
    data.priorities.length +
    data.schedule.filter((s) => s.task.trim().length > 0).length;

  const completedItems =
    data.priorities.filter((p) => p.completed).length +
    data.schedule.filter((s) => s.task.trim().length > 0 && s.completed).length;

  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Trigger Confetti when 100% complete (if at least 3 items completed)
  useEffect(() => {
    if (progressPercent === 100 && completedItems >= 3) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [progressPercent, completedItems]);

  // Handler: Change Date String
  const handleDateChange = (newDate: string) => {
    setData((prev) => ({ ...prev, dateStr: newDate }));
  };

  // Handler: Select Weekday
  const handleSelectWeekday = (day: WeekdayName) => {
    playCheckSound(soundEnabled);
    setActiveWeekday(day);
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

  // Handler: Print / Save PDF
  const handlePrint = () => {
    window.print();
  };

  // Handler: Trigger Native Desktop Install
  const handleTriggerNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice && choice.outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Dynamic Animated Ambient Aurora & Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#070514] overflow-hidden">
        <div className="absolute top-[-15%] right-[15%] w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[140px] animate-aurora" />
        <div className="absolute bottom-[-15%] left-[10%] w-[550px] h-[550px] bg-indigo-900/25 rounded-full blur-[160px] animate-aurora" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 w-[650px] h-[350px] bg-purple-600/15 rounded-full blur-[180px] animate-aurora" style={{ animationDelay: '8s' }} />
      </div>

      {/* Main Printable Planner Board Container */}
      <div
        ref={boardRef}
        className="w-full max-w-[1180px] bg-[#0c081e]/85 border-2 border-purple-500/60 rounded-3xl p-4 sm:p-7 md:p-9 shadow-[0_0_60px_rgba(139,92,246,0.3)] backdrop-blur-2xl relative transition-all animate-float"
      >
        {/* Header & Controls */}
        <Header
          progressPercent={progressPercent}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onReset={handleReset}
          onExportPng={handleExportPng}
          onPrint={handlePrint}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          isInstallReady={!!deferredPrompt}
        />

        {/* Date & Weekday Bar */}
        <DateWeekBar
          dateStr={data.dateStr}
          onDateChange={handleDateChange}
          activeWeekday={activeWeekday}
          onSelectWeekday={handleSelectWeekday}
        />

        {/* Main Content Area: Full-width ScheduleCard, then Priorities & Goals side-by-side below it */}
        <div className="flex flex-col gap-6 mb-6">
          {/* Top: Today's Schedule (برنامه‌ی امروز) */}
          <ScheduleCard
            schedule={data.schedule}
            onChangeTask={handleChangeSlotTask}
            onToggleSlot={handleToggleSlot}
            onAddSlot={handleAddSlot}
            onRemoveSlot={handleRemoveSlot}
          />

          {/* Below Today's Schedule: Priorities and Goals side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PrioritiesCard
              priorities={data.priorities}
              onToggle={handleTogglePriority}
              onChangeText={handleChangePriorityText}
              onAddPriority={handleAddPriority}
              onRemovePriority={handleRemovePriority}
            />
            <GoalsCard
              goals={data.goals}
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

        {/* Poster Footer Bar */}
        <FooterBar />
      </div>

      {/* Install on Desktop PWA Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onTriggerNativeInstall={handleTriggerNativeInstall}
        isNativePromptReady={!!deferredPrompt}
      />

      {/* Export loading badge */}
      {isExporting && (
        <div className="fixed bottom-6 left-6 z-50 bg-purple-900/95 border border-purple-400 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-sm flex items-center gap-2.5 animate-bounce">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>در حال تولید پوستر با کیفیت بالا...</span>
        </div>
      )}
    </div>
  );
}
