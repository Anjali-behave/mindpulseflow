import { format, subDays, parseISO } from "date-fns";
import type { MoodEntry, FocusSession, Task } from "./types";

export const dayKey = (d: Date | string) => format(typeof d === "string" ? parseISO(d) : d, "yyyy-MM-dd");

export function lastNDays(n: number, today = new Date()) {
  return Array.from({ length: n }, (_, i) => subDays(today, n - 1 - i));
}

/** Average mood per day; null when nothing was logged (never invented). */
export function moodByDay(moods: MoodEntry[], days: Date[]) {
  return days.map((d) => {
    const k = dayKey(d);
    const list = moods.filter((m) => dayKey(m.at) === k);
    const avg = list.length ? list.reduce((s, m) => s + m.mood, 0) / list.length : null;
    const en = list.filter((m) => m.energy);
    return {
      key: k,
      label: format(d, "EEE"),
      short: format(d, "d MMM"),
      mood: avg === null ? null : Math.round(avg * 10) / 10,
      energy: en.length ? Math.round((en.reduce((s, m) => s + (m.energy ?? 0), 0) / en.length) * 10) / 10 : null,
      count: list.length,
    };
  });
}

export function focusByDay(sessions: FocusSession[], days: Date[]) {
  return days.map((d) => {
    const k = dayKey(d);
    const list = sessions.filter((s) => dayKey(s.completedAt) === k);
    return { key: k, label: format(d, "EEE"), short: format(d, "d MMM"), minutes: list.reduce((s, x) => s + x.minutes, 0), count: list.length };
  });
}

export function tasksByDay(tasks: Task[], days: Date[]) {
  return days.map((d) => {
    const k = dayKey(d);
    const list = tasks.filter((t) => t.date === k);
    return { key: k, label: format(d, "EEE"), planned: list.length, done: list.filter((t) => t.done).length };
  });
}

export const MIN_DAYS_PER_GROUP = 3;

/**
 * Compares mood on days with vs without focus sessions.
 * Returns null when there are fewer than MIN_DAYS_PER_GROUP days in either group.
 */
export function focusMoodPattern(moods: MoodEntry[], sessions: FocusSession[]) {
  const moodDays = new Map<string, number[]>();
  moods.forEach((m) => {
    const k = dayKey(m.at);
    moodDays.set(k, [...(moodDays.get(k) ?? []), m.mood]);
  });
  const focusDays = new Set(sessions.map((s) => dayKey(s.completedAt)));
  const withF: number[] = [];
  const without: number[] = [];
  moodDays.forEach((v, k) => {
    const avg = v.reduce((a, b) => a + b, 0) / v.length;
    (focusDays.has(k) ? withF : without).push(avg);
  });
  if (withF.length < MIN_DAYS_PER_GROUP || without.length < MIN_DAYS_PER_GROUP) return null;
  const a = withF.reduce((x, y) => x + y, 0) / withF.length;
  const b = without.reduce((x, y) => x + y, 0) / without.length;
  return { withFocus: Math.round(a * 10) / 10, withoutFocus: Math.round(b * 10) / 10, daysWith: withF.length, daysWithout: without.length };
}

export function topTags(moods: MoodEntry[], n = 5) {
  const c = new Map<string, number>();
  moods.forEach((m) => m.tags.forEach((t) => c.set(t, (c.get(t) ?? 0) + 1)));
  return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}
