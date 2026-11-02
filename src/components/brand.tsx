import type { MoodLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Pip — the MindPulse cloud mascot. */
export function Mascot({ size = 120, mood = 4, className, still }: { size?: number; mood?: MoodLevel; className?: string; still?: boolean }) {
  const mouth: Record<MoodLevel, string> = {
    1: "M50 74 Q60 66 70 74",
    2: "M51 72 Q60 69 69 72",
    3: "M51 71 L69 71",
    4: "M50 69 Q60 78 70 69",
    5: "M48 67 Q60 84 72 67 Z",
  };
  return (
    <svg viewBox="0 0 120 110" width={size} height={size * 0.92} className={cn(!still && "animate-float", className)} aria-hidden="true">
      <ellipse cx="60" cy="104" rx="30" ry="4" className="fill-lavender" opacity=".6" />
      <path
        d="M28 88 C10 88 6 66 20 58 C14 38 36 26 50 34 C56 18 82 16 88 36 C104 34 114 52 104 64 C114 76 104 90 90 88 Z"
        className="fill-lavender stroke-lavender-deep"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M36 50 C40 44 46 42 50 44" className="stroke-card" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".8" />
      <g className="animate-blink">
        <ellipse cx="47" cy="60" rx="4" ry="5" className="fill-foreground" />
        <ellipse cx="73" cy="60" rx="4" ry="5" className="fill-foreground" />
        <circle cx="48.5" cy="58" r="1.4" className="fill-card" />
        <circle cx="74.5" cy="58" r="1.4" className="fill-card" />
      </g>
      <ellipse cx="38" cy="70" rx="6" ry="3.5" className="fill-pink-deep" opacity=".35" />
      <ellipse cx="82" cy="70" rx="6" ry="3.5" className="fill-pink-deep" opacity=".35" />
      <path d={mouth[mood]} className={cn("stroke-foreground", mood === 5 ? "fill-pink-deep" : "fill-none")} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M100 22 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" className="fill-butter-deep animate-twinkle" opacity=".8" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="13" className="fill-lavender" />
        <path d="M7 22 h7 l3 -7 l5 13 l3 -6 h8" className="stroke-foreground" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31 7 l1.4 3.2 3.2 1.4 -3.2 1.4 -1.4 3.2 -1.4 -3.2 -3.2 -1.4 3.2 -1.4z" className="fill-butter-deep" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">MindPulse</span>
    </div>
  );
}

/** Expressive mood faces; labels always accompany them in UI. */
export function MoodFace({ level, size = 44 }: { level: MoodLevel; size?: number }) {
  const fill = { 1: "fill-sky", 2: "fill-lavender", 3: "fill-butter", 4: "fill-sage", 5: "fill-pink" }[level];
  const mouth = {
    1: <path d="M15 31 Q22 25 29 31" />,
    2: <path d="M16 30 Q22 27.5 28 30" />,
    3: <path d="M16 29 L28 29" />,
    4: <path d="M15 27 Q22 33 29 27" />,
    5: <path d="M14 26 Q22 37 30 26 Z" className="fill-pink-deep" />,
  }[level];
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true">
      <circle cx="22" cy="22" r="19" className={cn(fill, "stroke-foreground")} strokeWidth="2" />
      {level === 1 ? (
        <>
          <path d="M12 18 q3 2 6 0" className="stroke-foreground" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M26 18 q3 2 6 0" className="stroke-foreground" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M31 21 q2 4 0 6 q-2 -2 0 -6" className="fill-sky-deep" />
        </>
      ) : level === 5 ? (
        <>
          <path d="M12 19 q3 -4 6 0" className="stroke-foreground" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M26 19 q3 -4 6 0" className="stroke-foreground" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="15.5" cy="18" r="2.4" className="fill-foreground" />
          <circle cx="28.5" cy="18" r="2.4" className="fill-foreground" />
        </>
      )}
      <circle cx="11" cy="25" r="2.6" className="fill-pink-deep" opacity=".3" />
      <circle cx="33" cy="25" r="2.6" className="fill-pink-deep" opacity=".3" />
      <g className="stroke-foreground" strokeWidth="2.2" fill="none" strokeLinecap="round">{mouth}</g>
    </svg>
  );
}

export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 40" className={className} aria-hidden="true">
      <path d="M14 36 C2 36 2 22 13 21 C13 10 28 6 34 15 C38 4 58 4 60 18 C72 16 78 30 68 36 Z" className="fill-card" opacity=".9" />
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M10 1 l2.2 6.8 6.8 2.2 -6.8 2.2 -2.2 6.8 -2.2 -6.8 -6.8 -2.2 6.8 -2.2z" className="fill-current" />
    </svg>
  );
}

export function Celebrate({ show }: { show: boolean }) {
  if (!show) return null;
  const tones = ["text-butter-deep", "text-pink-deep", "text-lavender-deep", "text-sage-deep", "text-sky-deep"];
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r = 70 + (i % 3) * 30;
        return (
          <span
            key={i}
            className={cn("absolute h-4 w-4 animate-burst", tones[i % tones.length])}
            style={{ ["--dx" as string]: `${Math.cos(a) * r}px`, ["--dy" as string]: `${Math.sin(a) * r}px` }}
          >
            <Sparkle className="h-full w-full" />
          </span>
        );
      })}
    </div>
  );
}
