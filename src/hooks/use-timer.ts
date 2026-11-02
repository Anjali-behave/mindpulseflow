import { useEffect, useState } from "react";
import { actions, useStore } from "@/lib/store";
import { toast } from "sonner";

/** Remaining ms derived from wall-clock `endsAt`, so tab switches don't drift. */
export function remainingOf(t: { status: string; endsAt?: number; remainingMs: number }, now = Date.now()) {
  return t.status === "running" && t.endsAt ? Math.max(0, t.endsAt - now) : t.remainingMs;
}

export function useTimerTick() {
  const timer = useStore((d) => d.timer);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (timer.status !== "running") return;
    const id = setInterval(() => setNow(Date.now()), 250);
    const onVis = () => setNow(Date.now());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [timer.status]);
  return { timer, remaining: remainingOf(timer, now) };
}

export const timerControls = {
  start: () =>
    actions.setTimer((t) => ({ ...t, status: "running", endsAt: Date.now() + t.remainingMs })),
  pause: () =>
    actions.setTimer((t) => ({ ...t, status: "paused", remainingMs: remainingOf(t), endsAt: undefined })),
  reset: () =>
    actions.setTimer((t) => ({ ...t, status: "idle", endsAt: undefined, remainingMs: (t.mode === "focus" ? t.focusMin : t.breakMin) * 60_000 })),
  switchMode: (mode: "focus" | "break") =>
    actions.setTimer((t) => ({ ...t, mode, status: "idle", endsAt: undefined, remainingMs: (mode === "focus" ? t.focusMin : t.breakMin) * 60_000 })),
};

let completeListeners = new Set<(mode: "focus" | "break") => void>();
export function onTimerComplete(fn: (mode: "focus" | "break") => void) {
  completeListeners.add(fn);
  return () => void completeListeners.delete(fn);
}

/** Mounted once in the app shell: completes sessions even when on another page. */
export function useTimerWatcher() {
  const { timer, remaining } = useTimerTick();
  useEffect(() => {
    if (timer.status !== "running" || remaining > 0) return;
    const mode = timer.mode;
    if (mode === "focus") {
      actions.addSession({ task: timer.task || undefined, minutes: timer.focusMin, completedAt: new Date(timer.endsAt ?? Date.now()).toISOString() });
      toast.success("Focus session complete — lovely work!", { description: "Time for a little break." });
    } else {
      toast("Break's over", { description: "Ready when you are." });
    }
    const next = mode === "focus" ? "break" : "focus";
    timerControls.switchMode(next);
    completeListeners.forEach((l) => l(mode));
  }, [timer, remaining]);
}

export const fmt = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};
