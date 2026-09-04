import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function useAnalysisRunner(steps: readonly string[], stepMs = 620) {
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (current >= steps.length) return;
    const t = setTimeout(() => setCurrent((c) => c + 1), stepMs);
    return () => clearTimeout(t);
  }, [running, current, steps.length, stepMs]);

  const start = () => {
    setCurrent(0);
    setRunning(true);
  };
  const stop = () => setRunning(false);

  return { running, current, start, stop, total: steps.length };
}

export function AnalysisProgress({
  steps,
  current,
}: {
  steps: readonly string[];
  current: number;
}) {
  const pct = Math.min(100, Math.round((current / steps.length) * 100));

  return (
    <div className="glass scan-line rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          AI Analysis Engine
        </h3>
        <span className="font-mono text-sm text-accent">{pct}%</span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="mt-6 space-y-3">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-xs",
                  done && "border-safe/40 bg-safe/15 text-safe",
                  active && "border-primary/50 bg-primary/15 text-primary",
                  !done && !active && "border-border bg-secondary/50 text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" /> : active ? <Loader2 className="size-3.5 animate-spin" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm transition-colors",
                  done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
