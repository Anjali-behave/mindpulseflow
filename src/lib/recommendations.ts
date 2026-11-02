import { addDays, format } from "date-fns";
import type { MoodEntry, Task } from "./types";
import { dayKey } from "./insights";

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  kind: "start-first" | "add-break" | "lighten-day";
  task?: Task | undefined;
  draft?: Partial<Task> | undefined;
}

const prioRank = { high: 0, medium: 1, low: 2 } as const;
export const HEAVY_DAY_MINUTES = 360;

/** Transparent, rule-based suggestions. Every rule explains itself in `reason`. */
export function getRecommendations(tasks: Task[], moods: MoodEntry[], now = new Date()): Recommendation[] {
  const today = dayKey(now);
  const open = tasks.filter((t) => t.date === today && !t.done);
  const recs: Recommendation[] = [];

  const dueToday = open.filter((t) => t.deadline === today).sort((a, b) => prioRank[a.priority] - prioRank[b.priority]);
  if (dueToday[0]) {
    recs.push({
      id: `start-${today}-${dueToday[0].id}`,
      kind: "start-first",
      task: dueToday[0],
      title: `Maybe start with "${dueToday[0].title}"`,
      reason: `Its deadline is today and you marked it ${dueToday[0].priority} priority.`,
    });
  }

  const todayMoods = moods.filter((m) => dayKey(m.at) === today);
  const latest = todayMoods.sort((a, b) => b.at.localeCompare(a.at))[0];
  if (latest && latest.mood <= 2) {
    recs.push({
      id: `break-${today}`,
      kind: "add-break",
      title: "Add a 10-minute gentle pause",
      reason: "You checked in feeling low today. A short, kind break could fit between tasks — only if it feels right.",
      draft: { title: "Gentle pause: stretch or a short walk", minutes: 10, category: "self-care", priority: "low", date: today },
    });
  }

  const total = open.reduce((s, t) => s + t.minutes, 0);
  if (total > HEAVY_DAY_MINUTES) {
    const lowest = [...open].sort((a, b) => prioRank[b.priority] - prioRank[a.priority])[0]!;
    recs.push({
      id: `lighten-${today}-${lowest.id}`,
      kind: "lighten-day",
      task: lowest,
      title: `Move "${lowest.title}" to tomorrow?`,
      reason: `Today's open tasks add up to about ${Math.round(total / 60)}h, and this one has the lowest priority.`,
      draft: { date: format(addDays(now, 1), "yyyy-MM-dd") },
    });
  }
  return recs;
}
