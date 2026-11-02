import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, Clock, CheckCircle2, Palette, Music, BookOpen, Languages, TreePine, Wrench, FlaskConical, Flower2, type LucideIcon } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useStore, actions } from "@/lib/store";
import { HOBBIES, HOBBY_CATS, type HobbyCat, type Hobby } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore hobbies — MindPulse" },
      { name: "description", content: "Little low-pressure activities to try outside of studying." },
      { property: "og:title", content: "Explore hobbies — MindPulse" },
      { property: "og:description", content: "Discover small, delightful things to try." },
    ],
  }),
  component: Explore,
});

const ICONS: Record<HobbyCat, LucideIcon> = { art: Palette, music: Music, reading: BookOpen, languages: Languages, movement: TreePine, practical: Wrench, science: FlaskConical, mindful: Flower2 };

function Explore() {
  const favs = useStore((d) => d.favorites);
  const tried = useStore((d) => d.tried);
  const [cat, setCat] = useState<HobbyCat | "all" | "saved">("all");
  const [open, setOpen] = useState<Hobby | null>(null);
  const list = HOBBIES.filter((h) => (cat === "all" ? true : cat === "saved" ? favs.includes(h.id) : h.cat === cat));

  return (
    <>
      <PageHeader title="Explore" sub="Little surprises for the parts of you outside of studying." />
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {(["all", "saved"] as const).map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={cn("rounded-full border px-4 py-1.5 text-sm font-bold capitalize transition", cat === c ? "bg-foreground text-background" : "bg-card hover:bg-muted")}>
            {c === "saved" ? `Saved (${favs.length})` : "All"}
          </button>
        ))}
        {(Object.keys(HOBBY_CATS) as HobbyCat[]).map((c) => {
          const I = ICONS[c];
          return (
            <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={cn("flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-bold transition", cat === c ? cn(HOBBY_CATS[c].tone, "border-foreground/40") : "bg-card hover:bg-muted")}>
              <I className="h-4 w-4" />{HOBBY_CATS[c].label}
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <EmptyState title="Nothing saved yet" body="Tap the heart on any activity to keep it here for later." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((h, i) => {
            const I = ICONS[h.cat];
            const fav = favs.includes(h.id);
            const done = tried.includes(h.id);
            return (
              <li key={h.id} className="card-soft card-lift relative flex flex-col overflow-hidden p-5 animate-rise" style={{ animationDelay: `${i * 40}ms` }}>
                <div className={cn("absolute -right-8 -top-8 h-28 w-28 rounded-[40%_60%_55%_45%]", HOBBY_CATS[h.cat].tone)} aria-hidden />
                <div className="relative flex items-start justify-between">
                  <span className={cn("grid h-12 w-12 place-items-center rounded-2xl border-2 border-card", HOBBY_CATS[h.cat].tone)}><I className="h-6 w-6" /></span>
                  <button onClick={() => actions.toggleFavorite(h.id)} aria-pressed={fav} aria-label={fav ? `Unsave ${h.title}` : `Save ${h.title}`}
                    className={cn("grid h-10 w-10 place-items-center rounded-full bg-card transition hover:scale-110", fav && "animate-pop")}>
                    <Heart className={cn("h-5 w-5", fav && "fill-pink-deep text-pink-deep")} />
                  </button>
                </div>
                <p className="relative mt-3 text-xs font-bold text-muted-foreground">{HOBBY_CATS[h.cat].label}</p>
                <h2 className="relative text-lg">{h.title}</h2>
                <p className="relative mt-1 flex-1 text-sm">{h.desc}</p>
                <div className="mt-3 flex items-center gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{h.minutes} min</span>
                  <span className="rounded-full bg-muted px-2 py-0.5">{h.level}</span>
                  {done && <span className="flex items-center gap-1 text-sage-deep"><CheckCircle2 className="h-3.5 w-3.5" />Tried</span>}
                </div>
                <Button variant="secondary" className="mt-4" onClick={() => setOpen(h)}>Try this</Button>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="rounded-3xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{open.title}</DialogTitle>
                <DialogDescription>About {open.minutes} minutes · no pressure to finish.</DialogDescription>
              </DialogHeader>
              <ol className="space-y-2">
                {open.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 rounded-2xl bg-muted p-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lavender text-xs font-bold">{i + 1}</span>{s}</li>
                ))}
              </ol>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(null)}>Maybe later</Button>
                <Button onClick={() => {
                  if (!tried.includes(open.id)) actions.toggleTried(open.id);
                  toast.success("Marked as tried ✿", { description: "How lovely that you made room for this." });
                  setOpen(null);
                }}>{tried.includes(open.id) ? "Tried it again" : "I tried it!"}</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
