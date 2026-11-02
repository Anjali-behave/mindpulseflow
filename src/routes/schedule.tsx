import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, Pencil, Plus, Trash2, Lightbulb, X } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/app-shell";
import { Celebrate } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useStore, actions } from "@/lib/store";
import { CATEGORIES } from "@/lib/content";
import { dayKey } from "@/lib/insights";
import { getRecommendations } from "@/lib/recommendations";
import type { Task, Priority, Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "My schedule — MindPulse" },
      { name: "description", content: "A simple, kind daily planner with transparent suggestions." },
      { property: "og:title", content: "My schedule — MindPulse" },
      { property: "og:description", content: "Plan your day gently." },
    ],
  }),
  component: Schedule,
});

const PRIO: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };
type Draft = Partial<Task> & { date: string };

function Schedule() {
  const tasks = useStore((d) => d.tasks);
  const moods = useStore((d) => d.moods);
  const dismissed = useStore((d) => d.dismissedRecs);
  const [day, setDay] = useState(() => new Date());
  const [draft, setDraft] = useState<Draft | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const k = dayKey(day);
  const list = tasks.filter((t) => t.date === k).sort((a, b) => Number(a.done) - Number(b.done) || (a.time ?? "99").localeCompare(b.time ?? "99"));
  const done = list.filter((t) => t.done).length;
  const isToday = k === dayKey(new Date());
  const recs = isToday ? getRecommendations(tasks, moods).filter((r) => !dismissed.includes(r.id)) : [];

  const toggle = (t: Task) => {
    actions.toggleTask(t.id);
    if (!t.done && done + 1 === list.length) {
      setCelebrate(true); setTimeout(() => setCelebrate(false), 1300);
      toast.success("Everything planned is done!", { description: "Be proud — and rest." });
    }
  };

  return (
    <>
      <PageHeader title="My schedule" sub="You don't have to do it all today.">
        <Button onClick={() => setDraft({ date: k })}><Plus /> Add task</Button>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="card-soft relative p-6 lg:col-span-2">
          <Celebrate show={celebrate} />
          <div className="mb-4 flex items-center justify-between gap-2">
            <Button size="icon" variant="ghost" aria-label="Previous day" onClick={() => setDay(addDays(day, -1))}><ChevronLeft /></Button>
            <div className="text-center">
              <h2 className="text-xl">{isToday ? "Today" : format(day, "EEEE")}</h2>
              <p className="text-sm text-muted-foreground">{format(day, "d MMMM yyyy")}</p>
            </div>
            <Button size="icon" variant="ghost" aria-label="Next day" onClick={() => setDay(addDays(day, 1))}><ChevronRight /></Button>
          </div>
          {list.length > 0 && (
            <div className="mb-5">
              <div className="mb-1 flex justify-between text-sm font-bold"><span>{done} of {list.length} done</span><span className="text-muted-foreground">{list.reduce((s, t) => s + t.minutes, 0)} min planned</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={done} aria-valuemax={list.length} aria-label="Tasks completed">
                <div className="h-full rounded-full bg-sage-deep/70 transition-all duration-700" style={{ width: `${(done / list.length) * 100}%` }} />
              </div>
            </div>
          )}
          {list.length === 0 ? (
            <EmptyState title="A quiet day" body="Nothing planned. Add something small — or leave room to breathe.">
              <Button variant="secondary" className="mt-2" onClick={() => setDraft({ date: k })}><Plus /> Add a task</Button>
            </EmptyState>
          ) : (
            <ol className="relative space-y-3 border-l-2 border-dashed border-lavender pl-5">
              {list.map((t) => (
                <li key={t.id} className={cn("relative flex items-center gap-3 rounded-2xl border bg-card p-3 transition", t.done && "opacity-70")}>
                  <span className={cn("absolute -left-[29px] h-4 w-4 rounded-full border-2 border-card", CATEGORIES[t.category].tone)} aria-hidden />
                  <button onClick={() => toggle(t)} aria-label={`Mark ${t.title} ${t.done ? "not done" : "done"}`}
                    className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition", t.done ? "border-sage-deep bg-sage" : "hover:bg-sage/50")}>
                    {t.done && <Check className="h-4 w-4" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-bold", t.done && "line-through")}>{t.title}</p>
                    <p className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                      {t.time && <span>{t.time}</span>}<span>{t.minutes} min</span><span>{PRIO[t.priority]} priority</span>
                      {t.deadline && <span>Due {format(parseISO(t.deadline), "d MMM")}</span>}
                    </p>
                  </div>
                  <span className={cn("hidden rounded-full px-2.5 py-0.5 text-xs font-bold sm:inline", CATEGORIES[t.category].tone)}>{CATEGORIES[t.category].label}</span>
                  <Button size="icon" variant="ghost" aria-label={`Edit ${t.title}`} onClick={() => setDraft(t)}><Pencil /></Button>
                  <Button size="icon" variant="ghost" aria-label={`Delete ${t.title}`} onClick={() => { actions.deleteTask(t.id); toast("Task removed"); }}><Trash2 /></Button>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside className="card-soft bg-butter/50 p-6" aria-labelledby="recs">
          <h2 id="recs" className="flex items-center gap-2 text-xl"><Lightbulb className="h-5 w-5" /> Gentle suggestions</h2>
          <p className="mt-1 text-xs text-muted-foreground">Simple rules based only on what you entered. Each one says why.</p>
          {!isToday ? (
            <p className="mt-4 text-sm">Suggestions appear for today's plan.</p>
          ) : recs.length === 0 ? (
            <p className="mt-4 text-sm">Nothing to suggest right now — your day looks balanced.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recs.map((r) => (
                <li key={r.id} className="rounded-2xl bg-card p-4">
                  <p className="font-bold">{r.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground"><span className="font-semibold">Why: </span>{r.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => {
                      if (r.kind === "add-break" && r.draft) setDraft({ ...(r.draft as Draft) });
                      else if (r.kind === "lighten-day" && r.task && r.draft) { actions.updateTask({ ...r.task, date: r.draft.date! }); toast("Moved to tomorrow"); }
                      actions.dismissRec(r.id);
                    }}>{r.kind === "add-break" ? "Add & edit" : r.kind === "lighten-day" ? "Move it" : "Got it"}</Button>
                    {r.task && r.kind === "lighten-day" && <Button size="sm" variant="soft" onClick={() => { setDraft(r.task!); }}>Edit instead</Button>}
                    <Button size="sm" variant="ghost" onClick={() => actions.dismissRec(r.id)}><X /> No thanks</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <TaskDialog draft={draft} onClose={() => setDraft(null)} />
    </>
  );
}

function TaskDialog({ draft, onClose }: { draft: Draft | null; onClose: () => void }) {
  return (
    <Dialog open={!!draft} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display">{draft?.id ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>Keep it small and doable.</DialogDescription>
        </DialogHeader>
        {draft && <TaskForm key={draft.id ?? "new"} draft={draft} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

const field = "mt-1 h-11 w-full rounded-full border-2 border-input bg-card px-4 font-normal focus:border-ring focus:outline-none";

function TaskForm({ draft, onClose }: { draft: Draft; onClose: () => void }) {
  const [f, setF] = useState({
    title: draft.title ?? "", priority: draft.priority ?? ("medium" as Priority), category: draft.category ?? ("study" as Category),
    minutes: draft.minutes ?? 30, date: draft.date, deadline: draft.deadline ?? "", time: draft.time ?? "",
  });
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return setErr("Give your task a short name.");
    if (f.title.length > 100) return setErr("Keep the name under 100 characters.");
    if (!(f.minutes >= 5 && f.minutes <= 600)) return setErr("Estimated time should be 5–600 minutes.");
    if (!f.date) return setErr("Pick a day.");
    const data = { ...f, title: f.title.trim(), deadline: f.deadline || undefined, time: f.time || undefined };
    if (draft.id) actions.updateTask({ ...(draft as Task), ...data });
    else actions.addTask(data);
    toast.success(draft.id ? "Task updated" : "Task added");
    onClose();
  };
  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <label className="block text-sm font-bold">Title<input autoFocus className={field} value={f.title} maxLength={100} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-bold">Priority
          <select className={field} value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Priority })}>
            {Object.entries(PRIO).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="block text-sm font-bold">Category
          <select className={field} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })}>
            {Object.entries(CATEGORIES).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-bold">Est. minutes<input type="number" min={5} max={600} className={field} value={f.minutes} onChange={(e) => setF({ ...f, minutes: Number(e.target.value) })} /></label>
        <label className="block text-sm font-bold">Start time <span className="font-normal text-muted-foreground">(opt.)</span><input type="time" className={field} value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} /></label>
        <label className="block text-sm font-bold">Day<input type="date" className={field} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
        <label className="block text-sm font-bold">Deadline <span className="font-normal text-muted-foreground">(opt.)</span><input type="date" className={field} value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} /></label>
      </div>
      {err && <p role="alert" className="text-sm font-bold text-destructive">{err}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit">{draft.id ? "Save" : "Add task"}</Button>
      </div>
    </form>
  );
}
