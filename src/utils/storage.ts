import type { DayPlannerData, WeekdayName } from '../types';
import { getDefaultPlannerData } from './defaultData';

const STORAGE_PREFIX = 'ascent_blueprint_day_v1_';

export function loadDayData(weekday: WeekdayName): DayPlannerData {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + weekday);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with default to ensure no missing fields
      const def = getDefaultPlannerData(weekday);
      return {
        ...def,
        ...parsed,
        activeWeekday: weekday,
      };
    }
  } catch {
    // fallback
  }
  return getDefaultPlannerData(weekday);
}

export function saveDayData(data: DayPlannerData): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + data.activeWeekday, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save day data:', err);
  }
}

export function resetDayData(weekday: WeekdayName): DayPlannerData {
  const def = getDefaultPlannerData(weekday);
  saveDayData(def);
  return def;
}
