import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { format } from "date-fns";
import { ArrowRight, Check, Play, Pause, Sparkles } from "lucide-react";
import { useStore, actions } from "@/lib/store";
import { Mascot, MoodFace, Sparkle } from "@/components/brand";
import { MoodForm } from "@/components/mood-form";
import { Button } from "@/components/ui/button";
import { ENCOURAGEMENTS, HOBBIES, HOBBY_CATS, MOODS, CATEGORIES } from "@/lib/content";
import { dayKey, lastNDays, moodByDay } from "@/lib/insights";
import { useTimerTick, timerControls, fmt } from "@/hooks/use-timer";
import { cn } from "@/lib/utils";
import type { MoodLevel } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindPulse — Home" },
      { name: "description", content: "Your cosy daily dashboard: check in, focus gently and plan your day." },
      { property: "og:title", content: "MindPulse — Home" },
      { property: "og:description", content: "A gentle space for mood, focus and hobbies." },
    ],
  }),
  component: Home,
});

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Home() {
  const name = useStore((d) => d.settings.name);
  const moods = useStore((d) => d.moods);
  const tasks = useStore((d) => d.tasks);
  const sessions = useStore((d) => d.sessions);
  const today = dayKey(new Date());
  const todayTasks = tasks.filter((t) => t.date === today).sort((a, b) => (a.time ?? "99").localeCompare(b.time ?? "99"));
  const todayMood = moods.filter((m) => dayKey(m.at) === today).sort((a, b) => b.at.localeCompare(a.at))[0];
  const todaySessions = sessions.filter((s) => dayKey(s.completedAt) === today);
  const week = moodByDay(moods, lastNDays(7));
  const enc = ENCOURAGEMENTS[new Date().getDate() % ENCOURAGEMENTS.length];
  const hobby = useMemo(() => HOBBIES[new Date().getDate() % HOBBIES.length], []);

  return (
    <div className="grid gap-5 md:grid-cols-6">
      {/* Hero */}
      <section className="card-soft relative overflow-hidden bg-lavender/70 p-6 md:col-span-4 md:p-8">
        <Sparkle className="absolute right-10 top-6 h-4 w-4 animate-twinkle text-butter-deep" />
        <Sparkle className="absolute right-40 bottom-8 h-3 w-3 animate-twinkle text-card [animation-delay:-1.5s]" />
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <p className="font-bold text-lavender-deep">{format(new Date(), "EEEE, d MMMM")}</p>
            <h1 className="mt-1 text-3xl md:text-4xl">{greeting()}{name ? `, ${name}` : ""} ✿</h1>
            <p className="mt-2 text-lg">Hey, let's check in with you.</p>
            <p className="mt-4 inline-block rounded-full bg-card/80 px-4 py-1.5 text-sm font-semibold">{enc}</p>
          </div>
          <Mascot size={130} mood={todayMood?.mood ?? 4} className="hidden shrink-0 sm:block" />
        </div>
      </section>

      {/* Summary */}
      <section className="card-soft card-lift bg-sage/70 p-6 md:col-span-2" aria-labelledby="sum">
        <h2 id="sum" className="text-lg">Today so far</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card/80 p-3">
            <dt className="text-xs font-bold text-muted-foreground">Tasks done</dt>
            <dd className="font-display text-2xl">{todayTasks.filter((t) => t.done).length}<span className="text-base text-muted-foreground">/{todayTasks.length}</span></dd>
          </div>
          <div className="rounded-2xl bg-card/80 p-3">
            <dt className="text-xs font-bold text-muted-foreground">Focus</dt>
            <dd className="font-display text-2xl">{todaySessions.reduce((s, x) => s + x.minutes, 0)}<span className="text-base text-muted-foreground"> min</span></dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">
          {todayTasks.length === 0 && todaySessions.length === 0 ? "A blank page is fine. Start small, if you like." : "A little progress is still progress."}
        </p>
      </section>

      {/* Mood check-in */}
      <section className="card-soft p-6 md:col-span-3" aria-labelledby="mood">
        <div className="flex items-center justify-between">
          <h2 id="mood" className="text-xl">How are you feeling today?</h2>
          <Link to="/journal" className="text-sm font-bold text-lavender-deep hover:underline">Journal</Link>
        </div>
        {todayMood ? (
          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-muted p-4">
            <MoodFace level={todayMood.mood} size={56} />
            <div>
              <p className="font-bold">You felt {MOODS[todayMood.mood - 1].label.toLowerCase()} at {format(new Date(todayMood.at), "p")}</p>
              <p className="text-sm text-muted-foreground">Feel free to check in again anytime — feelings shift.</p>
            </div>
          </div>
        ) : null}
        <div className="mt-4"><MoodForm compact /></div>
      </section>

      {/* Focus */}
      <FocusCard />

      {/* Schedule preview */}
      <section className="card-soft p-6 md:col-span-3" aria-labelledby="sched">
        <div className="flex items-center justify-between">
          <h2 id="sched" className="text-xl">Today's plan</h2>
          <Link to="/schedule" className="text-sm font-bold text-lavender-deep hover:underline">Open planner</Link>
        </div>
        {todayTasks.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-butter/60 p-4 text-sm">Nothing planned yet. <Link to="/schedule" className="font-bold underline">Add a task</Link> — or enjoy the space.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {todayTasks.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-muted/70 p-2.5">
                <button onClick={() => actions.toggleTask(t.id)} aria-label={`Mark ${t.title} ${t.done ? "not done" : "done"}`}
                  className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition", t.done ? "border-sage-deep bg-sage" : "bg-card")}>
                  {t.done && <Check className="h-4 w-4" />}
                </button>
                <span className={cn("flex-1 font-semibold", t.done && "text-muted-foreground line-through")}>{t.title}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", CATEGORIES[t.category].tone)}>{t.time ?? `${t.minutes}m`}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Week mood */}
      <section className="card-soft p-6 md:col-span-2" aria-labelledby="wk">
        <h2 id="wk" className="text-xl">This week</h2>
        <ul className="mt-4 flex justify-between gap-1">
          {week.map((d) => (
            <li key={d.key} className="flex flex-col items-center gap-1 text-xs font-bold">
              {d.mood ? <MoodFace level={Math.round(d.mood) as MoodLevel} size={30} /> : <span className="h-[30px] w-[30px] rounded-full border-2 border-dashed" aria-hidden />}
              <span className="text-muted-foreground">{d.label[0]}</span>
              <span className="sr-only">{d.label}: {d.mood ? MOODS[Math.round(d.mood) - 1].label : "no check-in"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">Dashed circles are days without a check-in — that's okay.</p>
      </section>

      {/* Hobby */}
      <section className={cn("card-soft card-lift relative overflow-hidden p-6 md:col-span-1 md:col-start-auto", HOBBY_CATS[hobby.cat].tone)} aria-labelledby="hb">
        <Sparkles className="h-5 w-5" />
        <h2 id="hb" className="mt-2 text-lg leading-tight">{hobby.title}</h2>
        <p className="mt-1 text-sm">{hobby.minutes} min · {hobby.level}</p>
        <Link to="/explore" className="mt-3 inline-flex items-center gap-1 text-sm font-bold underline">Try something <ArrowRight className="h-3 w-3" /></Link>
      </section>
    </div>
  );
}

function FocusCard() {
  const { timer, remaining } = useTimerTick();
  const total = (timer.mode === "focus" ? timer.focusMin : timer.breakMin) * 60_000;
  const pct = 1 - remaining / total;
  return (
    <section className="card-soft relative overflow-hidden bg-sky/70 p-6 md:col-span-3" aria-labelledby="fc">
      <h2 id="fc" className="text-xl">Focus timer</h2>
      <div className="mt-4 flex items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="42" className="fill-card stroke-card" strokeWidth="10" />
            <circle cx="50" cy="50" r="42" fill="none" className="stroke-lavender-deep transition-[stroke-dashoffset] duration-300" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={264} strokeDashoffset={264 * (1 - pct)} />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-display text-2xl tabular-nums" aria-live="off">{fmt(remaining)}</span>
        </div>
        <div className="space-y-3">
          <p className="font-semibold">{timer.mode === "focus" ? (timer.task || "A gentle focus block") : "Break time ☁"}</p>
          <div className="flex flex-wrap gap-2">
            {timer.status === "running" ? (
              <Button onClick={timerControls.pause}><Pause /> Pause</Button>
            ) : (
              <Button onClick={timerControls.start}><Play /> {timer.status === "paused" ? "Resume" : "Start"}</Button>
            )}
            <Button asChild variant="soft"><Link to="/focus">Customise</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
