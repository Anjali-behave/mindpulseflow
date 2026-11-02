import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Home, NotebookPen, Timer, CalendarDays, Compass, BarChart3, Settings } from "lucide-react";
import { Logo, Cloud, Sparkle } from "./brand";
import { useStore } from "@/lib/store";
import { useTimerWatcher, useTimerTick, fmt } from "@/hooks/use-timer";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home, tone: "bg-lavender" },
  { to: "/journal", label: "Mood journal", icon: NotebookPen, tone: "bg-pink" },
  { to: "/focus", label: "Focus", icon: Timer, tone: "bg-sky" },
  { to: "/schedule", label: "My schedule", icon: CalendarDays, tone: "bg-butter" },
  { to: "/explore", label: "Explore", icon: Compass, tone: "bg-sage" },
  { to: "/insights", label: "Insights", icon: BarChart3, tone: "bg-lavender" },
  { to: "/settings", label: "Settings", icon: Settings, tone: "bg-muted" },
] as const;

function TimerPill() {
  const { timer, remaining } = useTimerTick();
  if (timer.status === "idle") return null;
  return (
    <Link to="/focus" className="mx-3 mb-3 flex items-center gap-2 rounded-full bg-sky px-3 py-2 text-sm font-semibold">
      <Timer className="h-4 w-4" /> {timer.mode === "focus" ? "Focusing" : "Break"} · {fmt(remaining)}
      {timer.status === "paused" && <span className="text-muted-foreground">(paused)</span>}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  useTimerWatcher();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const name = useStore((d) => d.settings.name);
  const reduce = useStore((d) => d.settings.reduceMotion);
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduce);
  }, [reduce]);

  return (
    <div className="relative min-h-screen md:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-full focus:bg-card focus:px-4 focus:py-2">
        Skip to content
      </a>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar backdrop-blur md:flex">
        <div className="px-5 pb-6 pt-6">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-full px-3 py-2 text-[15px] font-semibold transition-colors",
                  active ? "bg-card shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                )}
              >
                <span className={cn("grid h-8 w-8 place-items-center rounded-full transition-transform group-hover:scale-110", n.tone)}>
                  <n.icon className="h-4 w-4 text-foreground" />
                </span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <TimerPill />
        <Link to="/settings" className="m-3 flex items-center gap-3 rounded-[var(--radius)] bg-pink/60 p-3 hover:bg-pink">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-card font-display text-lg">{(name || "You")[0].toUpperCase()}</span>
          <span className="text-sm">
            <span className="block font-bold">{name || "Hello, friend"}</span>
            <span className="text-muted-foreground">Saved on this device</span>
          </span>
        </Link>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/85 px-4 py-3 backdrop-blur md:hidden">
        <Logo />
      </header>

      <main id="main" className="relative flex-1 overflow-x-hidden pb-28 md:pb-10">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
          <Cloud className="absolute left-[8%] top-6 w-24 animate-drift" />
          <Cloud className="absolute right-[12%] top-14 w-16 animate-drift [animation-delay:-6s]" />
          <Sparkle className="absolute right-[30%] top-8 h-3 w-3 animate-twinkle text-butter-deep" />
        </div>
        <div key={path} className="relative mx-auto max-w-6xl animate-rise px-4 py-6 md:px-8 md:py-10">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav aria-label="Main" className="fixed inset-x-2 bottom-2 z-40 flex justify-between rounded-full border bg-card/95 px-2 py-1.5 shadow-[var(--shadow-lift)] backdrop-blur md:hidden">
        {NAV.map((n) => {
          const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} aria-label={n.label} aria-current={active ? "page" : undefined}
              className={cn("grid h-11 w-11 place-items-center rounded-full transition", active ? n.tone : "text-muted-foreground")}>
              <n.icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        {sub && <p className="mt-1 text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius)] border-2 border-dashed bg-card/50 p-8 text-center">
      <svg viewBox="0 0 60 40" className="w-16" aria-hidden="true"><path d="M12 36 C2 36 2 22 12 21 C12 10 26 6 30 15 C34 4 52 6 50 18 C60 18 60 34 50 36 Z" className="fill-lavender" /><circle cx="24" cy="25" r="2" className="fill-foreground" /><circle cx="36" cy="25" r="2" className="fill-foreground" /></svg>
      <p className="font-display text-lg">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      {children}
    </div>
  );
}
