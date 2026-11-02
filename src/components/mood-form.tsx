import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { MOODS, EMOTION_TAGS } from "@/lib/content";
import { actions } from "@/lib/store";
import type { MoodEntry, MoodLevel } from "@/lib/types";
import { MoodFace, Celebrate } from "./brand";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function MoodPicker({ value, onChange, size = 48 }: { value?: MoodLevel; onChange: (m: MoodLevel) => void; size?: number }) {
  return (
    <div role="radiogroup" aria-label="How are you feeling?" className="flex flex-wrap justify-between gap-2">
      {MOODS.map((m) => {
        const sel = value === m.level;
        return (
          <button
            key={m.level}
            type="button"
            role="radio"
            aria-checked={sel}
            onClick={() => onChange(m.level)}
            className={cn(
              "flex flex-1 basis-14 flex-col items-center gap-1 rounded-2xl border-2 px-1 py-2 text-xs font-bold transition-all hover:-translate-y-0.5",
              sel ? cn(m.tone, "border-foreground/60 animate-pop") : "border-transparent hover:bg-muted",
            )}
          >
            <MoodFace level={m.level} size={size} />
            <span>{m.label}</span>
            {sel && <span className="sr-only">(selected)</span>}
          </button>
        );
      })}
    </div>
  );
}

export function MoodForm({ initial, onDone, compact }: { initial?: MoodEntry; onDone?: () => void; compact?: boolean }) {
  const [mood, setMood] = useState<MoodLevel | undefined>(initial?.mood);
  const [energy, setEnergy] = useState<number | undefined>(initial?.energy);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [note, setNote] = useState(initial?.note ?? "");
  const [at, setAt] = useState(() => format(initial ? new Date(initial.at) : new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [error, setError] = useState("");
  const [celebrate, setCelebrate] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return setError("Pick the face that feels closest — any answer is okay.");
    const when = new Date(at);
    if (isNaN(when.getTime())) return setError("That date doesn't look right.");
    if (when.getTime() > Date.now() + 60_000) return setError("Check-ins can't be in the future.");
    if (note.length > 1000) return setError("Notes can be up to 1000 characters.");
    const entry = { mood, energy, tags, note: note.trim() || undefined, at: when.toISOString() };
    if (initial) actions.updateMood({ ...initial, ...entry });
    else actions.addMood(entry);
    setError("");
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 1200);
    toast.success(initial ? "Entry updated" : "Thanks for checking in 💜", { description: "Saved to your journal." });
    if (!initial) {
      setMood(undefined); setEnergy(undefined); setTags([]); setNote("");
      setAt(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    }
    onDone?.();
  };

  return (
    <form onSubmit={save} className="relative space-y-5" noValidate>
      <Celebrate show={celebrate} />
      <MoodPicker value={mood} onChange={(m) => { setMood(m); setError(""); }} size={compact ? 40 : 48} />
      {!compact && (
        <>
          <fieldset>
            <legend className="mb-2 text-sm font-bold">Energy <span className="font-normal text-muted-foreground">(optional)</span></legend>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" aria-pressed={energy === n} onClick={() => setEnergy(energy === n ? undefined : n)}
                  className={cn("h-10 flex-1 rounded-full border-2 text-sm font-bold transition", energy === n ? "border-foreground/50 bg-butter" : "border-border bg-card hover:bg-muted")}>
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>Drained</span><span>Buzzing</span></div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-bold">Feelings <span className="font-normal text-muted-foreground">(optional)</span></legend>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((t) => {
                const on = tags.includes(t);
                return (
                  <button key={t} type="button" aria-pressed={on} onClick={() => setTags(on ? tags.filter((x) => x !== t) : [...tags, t])}
                    className={cn("rounded-full border px-3 py-1 text-sm transition", on ? "border-foreground/40 bg-pink font-bold" : "bg-card hover:bg-muted")}>
                    {t}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block text-sm font-bold">
              A little note <span className="font-normal text-muted-foreground">(optional, private)</span>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={1000}
                placeholder="Anything on your mind?" className="mt-2 w-full rounded-2xl border-2 border-input bg-card p-3 font-normal focus:border-ring focus:outline-none" />
            </label>
            <label className="block text-sm font-bold">
              When
              <input type="datetime-local" value={at} onChange={(e) => setAt(e.target.value)}
                className="mt-2 block h-11 rounded-full border-2 border-input bg-card px-4 font-normal focus:border-ring focus:outline-none" />
            </label>
          </div>
        </>
      )}
      {error && <p role="alert" className="text-sm font-bold text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit">{initial ? "Save changes" : "Save check-in"}</Button>
        {onDone && initial && <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>}
      </div>
    </form>
  );
}
