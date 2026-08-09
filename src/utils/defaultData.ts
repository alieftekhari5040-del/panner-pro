import type { DayPlannerData, WeekdayName } from '../types';
import { getTodayJalaliString, getTodayWeekdayName } from './jalali';

export function getDefaultPlannerData(weekday?: WeekdayName): DayPlannerData {
  return {
    dateStr: getTodayJalaliString(),
    activeWeekday: weekday || getTodayWeekdayName(),
    priorities: [
      { id: 'p1', text: '', completed: false },
      { id: 'p2', text: '', completed: false },
      { id: 'p3', text: '', completed: false },
      { id: 'p4', text: '', completed: false },
      { id: 'p5', text: '', completed: false },
    ],
    goals: [
      { id: 'g1', text: '' },
      { id: 'g2', text: '' },
      { id: 'g3', text: '' },
      { id: 'g4', text: '' },
    ],
    habits: [
      { id: 'h1', text: 'مطالعه', icon: 'book', completed: false },
      { id: 'h2', text: 'تسک رشد فردی', icon: 'growth', completed: false },
      { id: 'h3', text: 'تمرین / بدنسازی', icon: 'workout', completed: false },
    ],
    schedule: [
      { id: 's1', time: '', task: '', completed: false },
      { id: 's2', time: '', task: '', completed: false },
      { id: 's3', time: '', task: '', completed: false },
      { id: 's4', time: '', task: '', completed: false },
      { id: 's5', time: '', task: '', completed: false },
      { id: 's6', time: '', task: '', completed: false },
      { id: 's7', time: '', task: '', completed: false },
      { id: 's8', time: '', task: '', completed: false },
      { id: 's9', time: '', task: '', completed: false },
      { id: 's10', time: '', task: '', completed: false },
      { id: 's11', time: '', task: '', completed: false },
    ],
    lessons: [
      '',
      '',
      '',
    ],
  };
}
