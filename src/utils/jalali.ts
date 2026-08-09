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

// Convert a Date object to YYYY-MM-DD ISO string in local time
export function toIsoDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Parse YYYY-MM-DD local ISO string to Date object
export function parseIsoDate(isoStr: string): Date {
  const parts = isoStr.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0])) {
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  }
  return new Date();
}

// Get Persian index (0=Saturday .. 6=Friday) from Date object
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

// Format short Jalali date like "۱۸ مرداد"
export function formatShortJalaliDate(date: Date = new Date()): string {
  try {
    return format(date, 'dd MMMM');
  } catch {
    return formatJalaliDate(date).split(' ').slice(0, 2).join(' ');
  }
}

// Get Persian weekday name of a Date object
export function getWeekdayNameOfDate(date: Date = new Date()): WeekdayName {
  const index = getPersianWeekIndexOfDate(date);
  return INDEX_TO_WEEKDAY[index] || 'شنبه';
}

// Get today's weekday name in Persian
export function getTodayWeekdayName(): WeekdayName {
  return getWeekdayNameOfDate(new Date());
}

// Get the formatted Jalali date string for any weekday in the current Persian week
export function getJalaliStringForWeekday(targetDay: WeekdayName): string {
  const targetIndex = WEEKDAY_TO_INDEX[targetDay] ?? 0;
  const currentIndex = getPersianWeekIndexOfDate(new Date());
  const delta = targetIndex - currentIndex;
  const targetDate = new Date(Date.now() + delta * 86400000);
  return formatJalaliDate(targetDate);
}

// Navigate +/- delta days from a target weekday
export function getNextWeekdayName(currentDay: WeekdayName, delta: number): WeekdayName {
  const currentIndex = WEEKDAY_TO_INDEX[currentDay] ?? 0;
  const nextIndex = (currentIndex + delta + 7) % 7;
  return INDEX_TO_WEEKDAY[nextIndex] || 'شنبه';
}

// Add/subtract deltaDays from an ISO string
export function addDaysToIso(isoStr: string, deltaDays: number): string {
  const date = parseIsoDate(isoStr);
  date.setDate(date.getDate() + deltaDays);
  return toIsoDateString(date);
}

// Get the 7 ISO dates (Saturday to Friday) of the Persian week containing baseIso
export function getWeekIsoDates(baseIso: string): { day: WeekdayName; iso: string; label: string }[] {
  const baseDate = parseIsoDate(baseIso);
  const currentIndex = getPersianWeekIndexOfDate(baseDate);

  return ALL_WEEKDAYS.map((dayName, idx) => {
    const delta = idx - currentIndex;
    const targetDate = new Date(baseDate.getTime() + delta * 86400000);
    const iso = toIsoDateString(targetDate);
    const label = formatShortJalaliDate(targetDate);
    return {
      day: dayName,
      iso,
      label,
    };
  });
}
