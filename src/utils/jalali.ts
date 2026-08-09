import type { WeekdayName } from '../types';

export const ALL_WEEKDAYS: WeekdayName[] = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه'
];

export function getTodayJalaliString(): string {
  // Using Intl.DateTimeFormat for accurate Jalali formatting
  try {
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return formatter.format(new Date());
  } catch {
    return '۱۸ مرداد ۱۴۰۵';
  }
}

export function getTodayWeekdayName(): WeekdayName {
  try {
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      weekday: 'long'
    });
    const name = formatter.format(new Date()).trim();
    if (ALL_WEEKDAYS.includes(name as WeekdayName)) {
      return name as WeekdayName;
    }
  } catch {
    // fallback
  }
  return 'شنبه';
}
