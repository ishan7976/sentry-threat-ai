import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type { RiskLevel } from "@/lib/threat-engine";
import { cn } from "@/lib/utils";

export function riskTone(risk: RiskLevel) {
  if (risk === "HIGH RISK")
    return {
      text: "text-danger",
      bg: "bg-danger/12",
      border: "border-danger/40",
      ring: "stroke-danger",
      Icon: ShieldAlert,
      label: "DANGEROUS",
    };
  if (risk === "MEDIUM RISK")
    return {
      text: "text-warn",
      bg: "bg-warn/12",
      border: "border-warn/40",
      ring: "stroke-warn",
      Icon: AlertTriangle,
      label: "SUSPICIOUS",
    };
  return {
    text: "text-safe",
    bg: "bg-safe/12",
    border: "border-safe/40",
    ring: "stroke-safe",
    Icon: ShieldCheck,
    label: "SAFE",
  };
}

export function RiskBadge({ risk, className }: { risk: RiskLevel; className?: string }) {
  const tone = riskTone(risk);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        tone.text,
        tone.bg,
        tone.border,
        className,
      )}
    >
      <tone.Icon className="size-3.5" />
      {risk}
    </span>
  );
}

export function ThreatGauge({ score, risk }: { score: number; risk: RiskLevel }) {
  const tone = riskTone(risk);
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, score)) / 100) * c;

  return (
    <div className="relative flex size-36 items-center justify-center">
      <svg viewBox="0 0 120 120" className="size-36 -rotate-90">
        <circle cx="60" cy="60" r={r} className="fill-none stroke-border" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          className={cn("fill-none transition-[stroke-dashoffset] duration-1000 ease-out", tone.ring)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("font-display text-3xl font-bold", tone.text)}>{score}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Threat score</span>
      </div>
    </div>
  );
}

export function RiskVerdict({ risk }: { risk: RiskLevel }) {
  const tone = riskTone(risk);
  return (
    <div className={cn("relative flex flex-col items-center justify-center rounded-2xl border p-8", tone.bg, tone.border)}>
      <span className="relative flex items-center justify-center">
        <span className={cn("absolute size-20 rounded-full pulse-ring", tone.bg)} />
        <tone.Icon className={cn("size-16", tone.text)} />
      </span>
      <p className={cn("mt-4 font-display text-2xl font-bold tracking-tight", tone.text)}>{tone.label}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{risk}</p>
    </div>
  );
}
