import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";

import { RiskBadge, ThreatGauge, riskTone } from "@/components/risk-visuals";
import { DownloadReportButton } from "@/components/report-view";
import { useScanLogs, type ScanLog } from "@/lib/scan-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Security Reports — ThreatGuard AI" },
      {
        name: "description",
        content:
          "Browse every scan, review the AI decision and detected problems, and download a shareable security report.",
      },
      { property: "og:title", content: "Security Reports — ThreatGuard AI" },
      {
        property: "og:description",
        content: "Downloadable AI security reports for every scanned email and link.",
      },
    ],
  }),
  component: Reports,
});

function buildLogReport(l: ScanLog) {
  return [
    "THREATGUARD AI — SECURITY REPORT",
    "=================================",
    `Generated: ${new Date().toLocaleString()}`,
    `Scan date: ${new Date(l.date).toLocaleString()}`,
    `Type: ${l.type}`,
    `Source: ${l.sender}`,
    `Item: ${l.subject}`,
    "",
    "THREAT SUMMARY",
    `Category: ${l.category}`,
    `Risk score: ${l.score}/100`,
    `Risk level: ${l.risk}`,
    "",
    "AI DECISION",
    l.reason,
    "",
    "DETECTED PROBLEMS",
    ...(l.indicators.length ? l.indicators.map((i) => `- ${i}`) : ["- None detected"]),
    "",
    "SAFETY RECOMMENDATIONS",
    `- ${l.action}`,
    "- Never share passwords or OTPs in response to an email.",
    "- Confirm payment or access requests through a second trusted channel.",
  ].join("\n");
}

function Reports() {
  const logs = useScanLogs();
  const [selectedId, setSelectedId] = useState<string | null>(logs[0]?.id ?? null);
  const selected = logs.find((l) => l.id === selectedId) ?? logs[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">Security Reports</h1>
        <p className="mt-3 text-muted-foreground">
          Every scan is archived with its evidence trail. Open a report to review the AI decision
          and download a shareable copy.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="glass max-h-[640px] overflow-y-auto rounded-2xl p-3">
          {logs.map((l) => {
            const tone = riskTone(l.risk);
            const active = selected?.id === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setSelectedId(l.id)}
                className={cn(
                  "mb-2 block w-full rounded-xl border p-3 text-left transition-colors",
                  active ? "border-primary/40 bg-secondary" : "border-transparent hover:bg-secondary/50",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{l.subject}</span>
                  <span className={cn("font-mono text-xs", tone.text)}>{l.score}</span>
                </div>
                <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{l.sender}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {l.type} · {new Date(l.date).toLocaleDateString()}
                </p>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="space-y-6">
            <div className={cn("glass rounded-2xl border p-6", riskTone(selected.risk).border)}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <FileText className="size-3.5" /> Threat summary
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold">{selected.category}</h2>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{selected.subject}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{selected.sender}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <RiskBadge risk={selected.risk} />
                    <DownloadReportButton
                      filename={`threatguard-report-${selected.id}.txt`}
                      body={buildLogReport(selected)}
                    />
                  </div>
                </div>
                <ThreatGauge score={selected.score} risk={selected.risk} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-base font-semibold">AI decision</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{selected.reason}</p>
                <h3 className="mt-6 font-display text-base font-semibold">Safety recommendations</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-safe" />{selected.action}</li>
                  <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-safe" />Never share passwords or OTPs in response to an email.</li>
                  <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-safe" />Confirm payment or access requests through a second trusted channel.</li>
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-base font-semibold">Detected problems</h3>
                {selected.indicators.length ? (
                  <ul className="mt-3 space-y-2">
                    {selected.indicators.map((i) => (
                      <li key={i} className="rounded-xl border border-danger/30 bg-danger/8 p-3 text-sm">
                        {i}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 rounded-xl border border-safe/30 bg-safe/10 p-3 text-sm text-safe">
                    No suspicious indicators were detected in this item.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
