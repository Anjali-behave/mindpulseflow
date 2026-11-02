import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/app-shell";
import { MoodForm } from "@/components/mood-form";
import { MoodFace } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useStore, actions } from "@/lib/store";
import { MOODS } from "@/lib/content";
import { dayKey } from "@/lib/insights";
import { cn } from "@/lib/utils";
import type { MoodLevel } from "@/lib/types";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Mood journal — MindPulse" },
      { name: "description", content: "Check in with how you feel and look back on your entries." },
      { property: "og:title", content: "Mood journal — MindPulse" },
      { property: "og:description", content: "A private, gentle mood journal." },
    ],
  }),
  component: Journal,
});

function Journal() {
  const moods = useStore((d) => d.moods);
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const pad = (getDay(days[0]!) + 6) % 7;
  const list = [...moods]
    .filter((m) => (selected ? isSameDay(new Date(m.at), selected) : true))
    .sort((a, b) => b.at.localeCompare(a.at));

  return (
    <>
      <PageHeader title="Mood journal" sub="A private reflection space — not a diagnosis, just you, noticing." />
      <div className="grid gap-5 lg:grid-cols-5">
        <section className="card-soft p-6 lg:col-span-3" aria-labelledby="new">
          <h2 id="new" className="mb-4 text-xl">What feels true right now?</h2>
          <MoodForm />
        </section>

        <section className="card-soft bg-pink/40 p-6 lg:col-span-2" aria-labelledby="cal">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="cal" className="text-xl">{format(month, "MMMM yyyy")}</h2>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" aria-label="Previous month" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft /></Button>
              <Button size="icon" variant="ghost" aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight /></Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: pad }).map((_, i) => <span key={`p${i}`} />)}
            {days.map((d) => {
              const k = dayKey(d);
              const ms = moods.filter((m) => dayKey(m.at) === k);
              const avg = ms.length ? (Math.round(ms.reduce((s, m) => s + m.mood, 0) / ms.length) as MoodLevel) : null;
              const sel = selected && isSameDay(d, selected);
              return (
                <button key={k} onClick={() => setSelected(sel ? null : d)} aria-pressed={!!sel}
                  aria-label={`${format(d, "d MMMM")}: ${avg ? `${ms.length} check-in(s), mostly ${MOODS[avg - 1]!.label}` : "no check-ins"}`}
                  className={cn("grid aspect-square place-items-center rounded-xl text-xs font-bold transition hover:bg-card", sel && "ring-2 ring-ring bg-card", isSameDay(d, new Date()) && "underline")}>
                  {avg ? <MoodFace level={avg} size={26} /> : format(d, "d")}
                </button>
              );
            })}
          </div>
          {selected && <Button variant="link" className="mt-2 px-0" onClick={() => setSelected(null)}>Show all entries</Button>}
        </section>
      </div>

      <section className="mt-8" aria-labelledby="hist">
        <h2 id="hist" className="mb-4 text-2xl">{selected ? format(selected, "EEEE d MMMM") : "Your entries"}</h2>
        {list.length === 0 ? (
          <EmptyState title="No check-ins here yet" body="When you log a mood, it'll show up here. Only what you record is ever shown." />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {list.map((m) => (
              <li key={m.id} className="card-soft p-5">
                {editing === m.id ? (
                  <MoodForm initial={m} onDone={() => setEditing(null)} />
                ) : (
                  <div className="flex gap-4">
                    <MoodFace level={m.mood} size={48} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{MOODS[m.mood - 1]!.label}{m.energy ? <span className="font-normal text-muted-foreground"> · energy {m.energy}/5</span> : null}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(m.at), "EEE d MMM, p")}</p>
                      {m.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">{m.tags.map((t) => <span key={t} className="rounded-full bg-lavender px-2 py-0.5 text-xs font-semibold">{t}</span>)}</div>
                      )}
                      {m.note && <p className="mt-2 whitespace-pre-wrap break-words text-sm">{m.note}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="icon" variant="ghost" aria-label="Edit entry" onClick={() => setEditing(m.id)}><Pencil /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="ghost" aria-label="Delete entry"><Trash2 /></Button></AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                            <AlertDialogDescription>This removes it from your journal and insights. It can't be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
                            <AlertDialogAction className="rounded-full" onClick={() => actions.deleteMood(m.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
