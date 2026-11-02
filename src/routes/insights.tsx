import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { PageHeader, EmptyState } from "@/components/app-shell";
import { Mascot } from "@/components/brand";
import { useStore } from "@/lib/store";
import { focusByDay, focusMoodPattern, lastNDays, moodByDay, tasksByDay, topTags, MIN_DAYS_PER_GROUP } from "@/lib/insights";
import { HOBBIES } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — MindPulse" },
      { name: "description", content: "Gentle patterns from your own mood, focus and task records." },
      { property: "og:title", content: "Insights — MindPulse" },
      { property: "og:description", content: "Understand yourself a little better." },
    ],
  }),
  component: Insights,
});

const tip = { contentStyle: { borderRadius: 16, border: "1px solid var(--border)", fontFamily: "var(--font-sans)" } };

function Card({ title, sub, children, className }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("card-soft p-6", className)}>
      <h2 className="text-xl">{title}</h2>
      {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Insights() {
  const moods = useStore((d) => d.moods);
  const sessions = useStore((d) => d.sessions);
  const tasks = useStore((d) => d.tasks);
  const tried = useStore((d) => d.tried);
  const [range, setRange] = useState<7 | 30>(7);
  const days = lastNDays(range);
  const mood = moodByDay(moods, days);
  const focus = focusByDay(sessions, days);
  const tk = tasksByDay(tasks, days);
  const pattern = focusMoodPattern(moods, sessions);
  const tags = topTags(moods);
  const loggedDays = mood.filter((d) => d.mood !== null).length;
  const focusTotal = focus.reduce((s, d) => s + d.minutes, 0);
  const planned = tk.reduce((s, d) => s + d.planned, 0);
  const done = tk.reduce((s, d) => s + d.done, 0);
  const nothing = moods.length + sessions.length + tasks.length === 0;

  return (
    <>
      <PageHeader title="Insights" sub="Patterns from what you've recorded — never guesses, never judgments.">
        <div role="tablist" aria-label="Range" className="flex rounded-full bg-card p-1 shadow-[var(--shadow-soft)]">
          {([7, 30] as const).map((r) => (
            <button key={r} role="tab" aria-selected={range === r} onClick={() => setRange(r)} className={cn("rounded-full px-4 py-1.5 text-sm font-bold", range === r ? "bg-lavender" : "")}>
              {r === 7 ? "Week" : "Month"}
            </button>
          ))}
        </div>
      </PageHeader>

      {nothing ? (
        <div className="flex flex-col items-center gap-4">
          <Mascot size={140} mood={3} />
          <EmptyState title="Not enough to show yet" body="Once you log a few moods, focus sessions or tasks, gentle patterns will appear here. Nothing is ever made up." />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <dl className="grid grid-cols-2 gap-3 lg:col-span-2 md:grid-cols-4">
            {[
              ["Days checked in", `${loggedDays}/${range}`, "bg-pink"],
              ["Focus time", `${focusTotal} min`, "bg-sky"],
              ["Tasks done", `${done}/${planned}`, "bg-sage"],
              ["Hobbies tried", `${tried.length}`, "bg-butter"],
            ].map(([l, v, t]) => (
              <div key={l} className={cn("card-soft p-4", t)}>
                <dt className="text-xs font-bold">{l}</dt>
                <dd className="font-display text-2xl">{v}</dd>
              </div>
            ))}
          </dl>

          <Card title="Mood & energy" sub="1 = very low · 5 = great. Gaps are days without a check-in.">
            {loggedDays === 0 ? <p className="text-sm text-muted-foreground">No check-ins in this range yet.</p> : (
              <div className="h-56">
                <ResponsiveContainer>
                  <LineChart data={mood} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey={range === 7 ? "label" : "short"} tickLine={false} axisLine={false} fontSize={12} interval="preserveStartEnd" />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip {...tip} />
                    <Legend iconType="circle" />
                    <Line name="Mood" dataKey="mood" stroke="var(--lavender-deep)" strokeWidth={3} dot={{ r: 5, fill: "var(--lavender)" }} connectNulls={false} animationDuration={900} />
                    <Line name="Energy" dataKey="energy" stroke="var(--butter-deep)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: "var(--butter)" }} animationDuration={900} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card title="Focus time" sub="Minutes of completed focus sessions per day.">
            {focusTotal === 0 ? <p className="text-sm text-muted-foreground">No completed sessions in this range.</p> : (
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={focus} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey={range === 7 ? "label" : "short"} tickLine={false} axisLine={false} fontSize={12} interval="preserveStartEnd" />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                    <Tooltip {...tip} cursor={{ fill: "var(--muted)" }} />
                    <Bar name="Minutes" dataKey="minutes" fill="var(--chart-5)" radius={[10, 10, 10, 10]} animationDuration={900} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card title="Planned vs completed" sub="Tasks you planned for each day and how many you finished.">
            {planned === 0 ? <p className="text-sm text-muted-foreground">No tasks planned in this range.</p> : (
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={tk} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} interval="preserveStartEnd" />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                    <Tooltip {...tip} cursor={{ fill: "var(--muted)" }} />
                    <Legend iconType="circle" />
                    <Bar name="Planned" dataKey="planned" fill="var(--chart-4)" radius={[8, 8, 8, 8]} />
                    <Bar name="Completed" dataKey="done" fill="var(--chart-2)" radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card title="Little observations" sub="Based on all your records. Correlation isn't cause — just something to notice." className="bg-lavender/40">
            <ul className="space-y-3 text-sm">
              <li className="rounded-2xl bg-card p-3">
                {pattern ? (
                  pattern.withFocus === pattern.withoutFocus
                    ? <>Your mood looked about the same on days with and without focus sessions ({pattern.withFocus}/5).</>
                    : <>You logged {pattern.withFocus > pattern.withoutFocus ? "higher" : "lower"} moods on days with a focus session (avg {pattern.withFocus}/5 over {pattern.daysWith} days) than on days without ({pattern.withoutFocus}/5 over {pattern.daysWithout} days).</>
                ) : (
                  <span className="text-muted-foreground">Not enough data yet to compare mood on focus vs non-focus days — this needs at least {MIN_DAYS_PER_GROUP} check-in days of each kind.</span>
                )}
              </li>
              <li className="rounded-2xl bg-card p-3">
                {tags.length ? <>Feelings you've named most: {tags.map(([t, n]) => `${t} (${n})`).join(", ")}.</> : <span className="text-muted-foreground">Add feeling tags to check-ins to see which come up most.</span>}
              </li>
              <li className="rounded-2xl bg-card p-3">
                {sessions.length >= 3 ? (
                  <>Your sessions usually finish around {mostCommonHour(sessions.map((s) => s.completedAt))} — maybe that's a natural focus window for you.</>
                ) : <span className="text-muted-foreground">After 3+ focus sessions, we'll note when you tend to focus.</span>}
              </li>
              {tried.length > 0 && <li className="rounded-2xl bg-card p-3">You've made room for {tried.length} new {tried.length === 1 ? "activity" : "activities"}, like “{HOBBIES.find((h) => h.id === tried[tried.length - 1])?.title}”.</li>}
            </ul>
          </Card>
        </div>
      )}
    </>
  );
}

function mostCommonHour(isos: string[]) {
  const c = new Map<number, number>();
  isos.forEach((i) => { const h = new Date(i).getHours(); c.set(h, (c.get(h) ?? 0) + 1); });
  const h = [...c.entries()].sort((a, b) => b[1] - a[1])[0]![0];
  return new Date(2000, 0, 1, h).toLocaleTimeString([], { hour: "numeric" });
}
