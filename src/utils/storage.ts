import type { DayPlannerData } from '../types';
import { getDefaultPlannerData } from './defaultData';
import { toIsoDateString, formatJalaliDate, parseIsoDate, getWeekdayNameOfDate } from './jalali';

const STORAGE_PREFIX = 'ascent_blueprint_day_v3_';

export function loadDayDataByIso(isoDate: string): DayPlannerData {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + isoDate);
    if (raw) {
      const parsed = JSON.parse(raw);
      const def = getDefaultPlannerData(isoDate);
      return {
        ...def,
        ...parsed,
        isoDate,
        dateStr: parsed.dateStr || formatJalaliDate(parseIsoDate(isoDate)),
        activeWeekday: getWeekdayNameOfDate(parseIsoDate(isoDate)),
      };
    }
  } catch {
    // fallback
  }
  return getDefaultPlannerData(isoDate);
}

// Backwards-compatible loader if old callers pass weekday name
export function loadDayData(isoOrWeekday: string): DayPlannerData {
  if (isoOrWeekday && isoOrWeekday.includes('-')) {
    return loadDayDataByIso(isoOrWeekday);
  }
  return getDefaultPlannerData(toIsoDateString());
}

export function saveDayData(data: DayPlannerData): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + data.isoDate, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save day data:', err);
  }
}

export function resetDayData(isoDate: string): DayPlannerData {
  const def = getDefaultPlannerData(isoDate);
  saveDayData(def);
  return def;
}
