export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  mood: MoodLevel;
  energy?: number; // 1-5
  tags: string[];
  note?: string;
  at: string; // ISO datetime
}

export interface FocusSession {
  id: string;
  task?: string;
  minutes: number;
  completedAt: string;
}

export type Priority = "low" | "medium" | "high";
export type Category = "study" | "self-care" | "chores" | "social" | "hobby";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  category: Category;
  minutes: number;
  date: string; // yyyy-MM-dd planned day
  deadline?: string; // yyyy-MM-dd
  time?: string; // HH:mm
  done: boolean;
  doneAt?: string;
}

export interface TimerState {
  mode: "focus" | "break";
  status: "idle" | "running" | "paused";
  endsAt?: number; // epoch ms, source of truth while running
  remainingMs: number; // used while paused/idle
  task: string;
  focusMin: number;
  breakMin: number;
}

export interface Settings {
  name: string;
  reduceMotion: boolean;
  sound: boolean;
}

export interface AppData {
  version: 1;
  moods: MoodEntry[];
  sessions: FocusSession[];
  tasks: Task[];
  favorites: string[];
  tried: string[];
  dismissedRecs: string[];
  timer: TimerState;
  settings: Settings;
}
