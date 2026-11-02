import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Play, Pause, RotateCcw, Trash2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/app-shell";
import { Mascot, Celebrate, Sparkle } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useStore, actions } from "@/lib/store";
import { useTimerTick, timerControls, fmt, onTimerComplete } from "@/hooks/use-timer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus timer — MindPulse" },
      { name: "description", content: "A gentle Pomodoro timer with custom focus and break lengths." },
      { property: "og:title", content: "Focus timer — MindPulse" },
      { property: "og:description", content: "Focus gently, one block at a time." },
    ],
  }),
  component: Focus,
});

function Focus() {
  const { timer, remaining } = useTimerTick();
  const sessions = useStore((d) => d.sessions);
  const [celebrate, setCelebrate] = useState(false);
  useEffect(() => onTimerComplete((m) => {
    if (m === "focus") { setCelebrate(true); setTimeout(() => setCelebrate(false), 1400); }
  }), []);
  const total = (timer.mode === "focus" ? timer.focusMin : timer.breakMin) * 60_000;
  const pct = 1 - remaining / total;
  const idle = timer.status === "idle";
  const C = 2 * Math.PI * 88;

  const setDur = (key: "focusMin" | "breakMin", v: number) => {
    const n = Math.min(key === "focusMin" ? 120 : 60, Math.max(1, Math.round(v || 1)));
    actions.setTimer((t) => {
      const next = { ...t, [key]: n };
      const active = (t.mode === "focus" && key === "focusMin") || (t.mode === "break" && key === "breakMin");
      return t.status === "idle" && active ? { ...next, remainingMs: n * 60_000 } : next;
    });
  };

  return (
    <>
      <PageHeader title="Focus timer" sub="One gentle block at a time. Breaks are part of it." />
      <div className="grid gap-5 lg:grid-cols-5">
        <section className={cn("card-soft relative flex flex-col items-center overflow-hidden p-6 lg:col-span-3 md:p-10", timer.mode === "focus" ? "bg-sky/60" : "bg-sage/60")}>
          <Sparkle className="absolute left-8 top-8 h-4 w-4 animate-twinkle text-butter-deep" />
          <Sparkle className="absolute bottom-10 right-10 h-3 w-3 animate-twinkle text-pink-deep [animation-delay:-2s]" />
          <div role="tablist" aria-label="Timer mode" className="mb-6 flex rounded-full bg-card p-1">
            {(["focus", "break"] as const).map((m) => (
              <button key={m} role="tab" aria-selected={timer.mode === m} disabled={!idle && timer.mode !== m}
                onClick={() => timerControls.switchMode(m)}
                className={cn("rounded-full px-5 py-2 text-sm font-bold capitalize transition disabled:opacity-40", timer.mode === m ? "bg-lavender" : "hover:bg-muted")}>
                {m}
              </button>
            ))}
          </div>
          <div className="relative h-64 w-64 md:h-72 md:w-72">
            <Celebrate show={celebrate} />
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden>
              <circle cx="100" cy="100" r="88" fill="none" className="stroke-card" strokeWidth="16" />
              <circle cx="100" cy="100" r="88" fill="none" strokeWidth="16" strokeLinecap="round"
                className={cn("transition-[stroke-dashoffset] duration-300", timer.mode === "focus" ? "stroke-lavender-deep" : "stroke-sage-deep")}
                strokeDasharray={C} strokeDashoffset={C * (1 - pct)} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-6xl tabular-nums" role="timer" aria-label={`${fmt(remaining)} remaining`}>{fmt(remaining)}</span>
              <span className="mt-1 text-sm font-semibold text-muted-foreground">
                {timer.status === "paused" ? "Paused" : timer.mode === "focus" ? "Focus" : "Breathe & rest"}
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            {timer.status === "running" ? (
              <Button size="lg" onClick={timerControls.pause}><Pause /> Pause</Button>
            ) : (
              <Button size="lg" onClick={timerControls.start}><Play /> {timer.status === "paused" ? "Resume" : "Start"}</Button>
            )}
            <Button size="lg" variant="soft" onClick={timerControls.reset} disabled={idle && remaining === total}><RotateCcw /> Reset</Button>
          </div>
          {celebrate && <p className="mt-4 font-display text-lg" role="status">You did it! Small steps count. ✦</p>}
        </section>

        <section className="card-soft space-y-5 p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Mascot size={70} mood={timer.status === "running" ? 3 : 4} />
            <p className="text-sm text-muted-foreground">I'll keep time — even if you switch tabs.</p>
          </div>
          <label className="block text-sm font-bold">
            What are you focusing on? <span className="font-normal text-muted-foreground">(optional)</span>
            <input value={timer.task} maxLength={80} onChange={(e) => actions.setTimer((t) => ({ ...t, task: e.target.value }))}
              placeholder="e.g. Read chapter 4" className="mt-2 h-11 w-full rounded-full border-2 border-input bg-card px-4 font-normal focus:border-ring focus:outline-none" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            {([["focusMin", "Focus (min)", 120], ["breakMin", "Break (min)", 60]] as const).map(([k, l, max]) => (
              <label key={k} className="block text-sm font-bold">
                {l}
                <input type="number" min={1} max={max} value={timer[k]} disabled={!idle}
                  onChange={(e) => setDur(k, Number(e.target.value))}
                  className="mt-2 h-11 w-full rounded-full border-2 border-input bg-card px-4 font-normal focus:border-ring focus:outline-none disabled:opacity-50" />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[[25, 5], [50, 10], [15, 3]].map(([f, b]) => (
              <Button key={f} size="sm" variant="outline" disabled={!idle} onClick={() => { setDur("focusMin", f); setDur("breakMin", b); }}>{f}/{b}</Button>
            ))}
          </div>
          {!idle && <p className="text-xs text-muted-foreground">Reset the timer to change durations.</p>}
        </section>
      </div>

      <section className="mt-8" aria-labelledby="hist">
        <h2 id="hist" className="mb-4 text-2xl">Completed sessions</h2>
        {sessions.length === 0 ? (
          <EmptyState title="No sessions yet" body="When a focus block finishes, it'll be gently noted here." />
        ) : (
          <ul className="card-soft divide-y">
            {[...sessions].reverse().slice(0, 30).map((s) => (
              <li key={s.id} className="flex items-center gap-3 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-sky font-display text-sm">{s.minutes}m</span>
                <div className="flex-1">
                  <p className="font-semibold">{s.task || "Focus block"}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(s.completedAt), "EEE d MMM, p")}</p>
                </div>
                <Button size="icon" variant="ghost" aria-label="Remove session" onClick={() => actions.deleteSession(s.id)}><Trash2 /></Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
