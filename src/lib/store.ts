/**
 * Local prototype data layer. All data lives in this browser's localStorage.
 * Swap `load`/`persist` for a backend adapter later; components only use
 * `useStore` + `actions`.
 */
import { useSyncExternalStore } from "react";
import type { AppData, MoodEntry, Task, FocusSession, TimerState, Settings } from "./types";

const KEY = "mindpulse.v1";

export const defaultTimer = (focusMin = 25, breakMin = 5): TimerState => ({
  mode: "focus",
  status: "idle",
  remainingMs: focusMin * 60_000,
  task: "",
  focusMin,
  breakMin,
});

export const emptyData = (): AppData => ({
  version: 1,
  moods: [],
  sessions: [],
  tasks: [],
  favorites: [],
  tried: [],
  dismissedRecs: [],
  timer: defaultTimer(),
  settings: { name: "", reduceMotion: false, sound: true },
});

const SERVER_SNAPSHOT = emptyData();
let state: AppData | null = null;
let loadError = false;
const listeners = new Set<() => void>();

function load(): AppData {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? { ...emptyData(), ...JSON.parse(raw) } : emptyData();
  } catch {
    loadError = true;
    state = emptyData();
  }
  return state!;
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    loadError = true;
  }
}

function set(fn: (d: AppData) => AppData) {
  state = fn(load());
  persist();
  listeners.forEach((l) => l());
}

export function hadStorageError() {
  return loadError;
}

export function useStore<T>(selector: (d: AppData) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(load()),
    () => selector(SERVER_SNAPSHOT),
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const actions = {
  addMood: (m: Omit<MoodEntry, "id">) => set((d) => ({ ...d, moods: [...d.moods, { ...m, id: uid() }] })),
  updateMood: (m: MoodEntry) => set((d) => ({ ...d, moods: d.moods.map((x) => (x.id === m.id ? m : x)) })),
  deleteMood: (id: string) => set((d) => ({ ...d, moods: d.moods.filter((x) => x.id !== id) })),

  addTask: (t: Omit<Task, "id" | "done">) => set((d) => ({ ...d, tasks: [...d.tasks, { ...t, id: uid(), done: false }] })),
  updateTask: (t: Task) => set((d) => ({ ...d, tasks: d.tasks.map((x) => (x.id === t.id ? t : x)) })),
  toggleTask: (id: string) =>
    set((d) => ({
      ...d,
      tasks: d.tasks.map((x) =>
        x.id === id ? { ...x, done: !x.done, doneAt: !x.done ? new Date().toISOString() : undefined } : x,
      ),
    })),
  deleteTask: (id: string) => set((d) => ({ ...d, tasks: d.tasks.filter((x) => x.id !== id) })),

  addSession: (s: Omit<FocusSession, "id">) => set((d) => ({ ...d, sessions: [...d.sessions, { ...s, id: uid() }] })),
  deleteSession: (id: string) => set((d) => ({ ...d, sessions: d.sessions.filter((x) => x.id !== id) })),

  setTimer: (fn: (t: TimerState) => TimerState) => set((d) => ({ ...d, timer: fn(d.timer) })),

  toggleFavorite: (id: string) =>
    set((d) => ({ ...d, favorites: d.favorites.includes(id) ? d.favorites.filter((x) => x !== id) : [...d.favorites, id] })),
  toggleTried: (id: string) =>
    set((d) => ({ ...d, tried: d.tried.includes(id) ? d.tried.filter((x) => x !== id) : [...d.tried, id] })),
  dismissRec: (id: string) => set((d) => ({ ...d, dismissedRecs: [...d.dismissedRecs, id] })),

  updateSettings: (s: Partial<Settings>) => set((d) => ({ ...d, settings: { ...d.settings, ...s } })),
  exportJson: () => JSON.stringify(load(), null, 2),
  clearAll: () => set(() => emptyData()),
};
