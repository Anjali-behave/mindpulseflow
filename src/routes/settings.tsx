import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Download, ShieldCheck, Trash2, HardDrive } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useStore, actions } from "@/lib/store";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & privacy — MindPulse" },
      { name: "description", content: "Your name, motion preferences and full control over your data." },
      { property: "og:title", content: "Settings & privacy — MindPulse" },
      { property: "og:description", content: "Your data, your control." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const s = useStore((d) => d.settings);
  const counts = useStore((d) => `${d.moods.length} check-ins · ${d.sessions.length} focus sessions · ${d.tasks.length} tasks`);
  const [name, setName] = useState(s.name);

  const exportData = () => {
    const blob = new Blob([actions.exportJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mindpulse-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Your data was downloaded");
  };

  return (
    <>
      <PageHeader title="Settings & privacy" sub="Make this little space feel like yours." />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card-soft space-y-5 p-6">
          <h2 className="text-xl">About you</h2>
          <form onSubmit={(e) => { e.preventDefault(); actions.updateSettings({ name: name.trim().slice(0, 30) }); toast.success("Saved"); }} className="flex flex-wrap items-end gap-2">
            <label className="block flex-1 text-sm font-bold">What should we call you?
              <input value={name} maxLength={30} onChange={(e) => setName(e.target.value)} placeholder="Your first name"
                className="mt-2 h-11 w-full rounded-full border-2 border-input bg-card px-4 font-normal focus:border-ring focus:outline-none" />
            </label>
            <Button type="submit">Save</Button>
          </form>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted p-4">
            <label htmlFor="rm" className="text-sm"><span className="block font-bold">Reduce motion</span><span className="text-muted-foreground">Stop floating clouds and animations. We also follow your device setting.</span></label>
            <Switch id="rm" checked={s.reduceMotion} onCheckedChange={(v) => actions.updateSettings({ reduceMotion: v })} />
          </div>
        </section>

        <section className="card-soft space-y-4 bg-sage/50 p-6">
          <h2 className="flex items-center gap-2 text-xl"><ShieldCheck className="h-5 w-5" /> Your privacy</h2>
          <div className="flex gap-3 rounded-2xl bg-card p-4 text-sm">
            <HardDrive className="h-5 w-5 shrink-0" />
            <p><strong>Prototype mode:</strong> everything is stored only in this browser on this device. There's no account, no cloud sync and nothing is sent to a server. Clearing your browser data will erase it.</p>
          </div>
          <p className="text-sm">MindPulse is a reflection tool, not a medical or diagnostic service. If you're struggling, please reach out to someone you trust or a local support line.</p>
          <p className="text-sm text-muted-foreground">Stored: {counts}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="soft" onClick={exportData}><Download /> Export my data</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 /> Delete everything</Button></AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all MindPulse data?</AlertDialogTitle>
                  <AlertDialogDescription>All check-ins, sessions, tasks and favourites on this device will be permanently removed.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="rounded-full" onClick={() => { actions.clearAll(); setName(""); toast("All data deleted"); }}>Delete all</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </>
  );
}
