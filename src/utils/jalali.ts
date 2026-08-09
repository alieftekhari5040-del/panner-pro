import type { WeekdayName } from '../types';
import { format } from 'date-fns-jalali';

export const ALL_WEEKDAYS: WeekdayName[] = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه'
];

// Map weekday name to Persian week index (Saturday = 0, Friday = 6)
export const WEEKDAY_TO_INDEX: Record<WeekdayName, number> = {
  'شنبه': 0,
  'یکشنبه': 1,
  'دوشنبه': 2,
  'سه‌شنبه': 3,
  'چهارشنبه': 4,
  'پنج‌شنبه': 5,
  'جمعه': 6,
};

export const INDEX_TO_WEEKDAY: Record<number, WeekdayName> = {
  0: 'شنبه',
  1: 'یکشنبه',
  2: 'دوشنبه',
  3: 'سه‌شنبه',
  4: 'چهارشنبه',
  5: 'پنج‌شنبه',
  6: 'جمعه',
};

// Get Persian index (0..6) from a JavaScript Date object
export function getPersianWeekIndexOfDate(date: Date = new Date()): number {
  const jsDay = date.getDay(); // 0 = Sunday, 6 = Saturday
  if (jsDay === 6) return 0; // Saturday
  return jsDay + 1; // Sunday (0) -> 1, Monday (1) -> 2, ..., Friday (5) -> 6
}

// Format a date object to Persian Jalali string like "۱۸ مرداد ۱۴۰۵"
export function formatJalaliDate(date: Date = new Date()): string {
  try {
    return format(date, 'dd MMMM yyyy');
  } catch {
    const fallback = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return fallback.format(date);
  }
}

// Get today's weekday name in Persian
export function getTodayWeekdayName(): WeekdayName {
  const index = getPersianWeekIndexOfDate(new Date());
  return INDEX_TO_WEEKDAY[index] || 'شنبه';
}

// Get the actual Date object for any weekday in the current Persian week
export function getDateForWeekday(targetDay: WeekdayName): Date {
  const today = new Date();
  const currentIndex = getPersianWeekIndexOfDate(today);
  const targetIndex = WEEKDAY_TO_INDEX[targetDay] ?? 0;
  const deltaDays = targetIndex - currentIndex;
  const targetDate = new Date(today.getTime() + deltaDays * 86400000);
  return targetDate;
}

// Get the formatted Jalali date string for any weekday in the current Persian week
export function getJalaliStringForWeekday(targetDay: WeekdayName): string {
  const targetDate = getDateForWeekday(targetDay);
  return formatJalaliDate(targetDate);
}

// Navigate +/- delta days from a target weekday
export function getNextWeekdayName(currentDay: WeekdayName, delta: number): WeekdayName {
  const currentIndex = WEEKDAY_TO_INDEX[currentDay] ?? 0;
  const nextIndex = (currentIndex + delta + 7) % 7;
  return INDEX_TO_WEEKDAY[nextIndex] || 'شنبه';
}
