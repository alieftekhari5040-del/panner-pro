export type WeekdayName = 
  | 'شنبه'
  | 'یکشنبه'
  | 'دوشنبه'
  | 'سه‌شنبه'
  | 'چهارشنبه'
  | 'پنج‌شنبه'
  | 'جمعه';

export interface PriorityTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface GoalItem {
  id: string;
  text: string;
  completed?: boolean;
}

export interface DailyHabit {
  id: string;
  text: string;
  icon: 'book' | 'growth' | 'workout' | 'custom';
  completed: boolean;
}

export interface ScheduleSlot {
  id: string;
  time: string;
  task: string;
  completed: boolean;
}

export interface DayPlannerData {
  dateStr: string; // Jalali formatted date e.g. "۱۸ مرداد ۱۴۰۵"
  activeWeekday: WeekdayName;
  priorities: PriorityTask[];
  goals: GoalItem[];
  habits: DailyHabit[];
  schedule: ScheduleSlot[];
  lessons: string[];
}
