import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Globe, Link2, Lock, ListChecks, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AnalysisProgress, useAnalysisRunner } from "@/components/analysis-progress";
import { RiskBadge, RiskVerdict, ThreatGauge, riskTone } from "@/components/risk-visuals";
import { DownloadReportButton, IndicatorList, buildUrlReport } from "@/components/report-view";
import { scanUrl } from "@/services/api";
import { URL_ANALYSIS_STEPS, type UrlAnalysis } from "@/lib/threat-engine";
import { addUrlLog } from "@/lib/scan-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/link-scanner")({
  head: () => ({
    meta: [
      { title: "Fraud Link Detector — ThreatGuard AI" },
      {
        name: "description",
        content:
          "Scan any suspicious URL for domain age, SSL status, blacklist reports and a 0-100 threat score before you click.",
      },
      { property: "og:title", content: "Fraud Link Detector — ThreatGuard AI" },
      {
        property: "og:description",
        content: "Check domain reputation, SSL and blacklist status of any suspicious link.",
      },
    ],
  }),
  component: LinkScanner,
});

function LinkScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<UrlAnalysis | null>(null);
  const runner = useAnalysisRunner(URL_ANALYSIS_STEPS, 520);
  const busy = runner.running && runner.current < URL_ANALYSIS_STEPS.length;

  async function handleScan() {
    if (!url.trim()) {
      toast.error("Paste a URL to scan.");
      return;
    }
    setResult(null);
    runner.start();
    const [analysis] = await Promise.all([
      scanUrl(url),
      new Promise((r) => setTimeout(r, URL_ANALYSIS_STEPS.length * 520 + 200)),
    ]);
    runner.stop();
    setResult(analysis);
    addUrlLog(analysis);
    toast.success(`Scan complete — ${analysis.riskLevel}`);
  }

  const tone = result ? riskTone(result.riskLevel) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <Link2 className="size-3.5" /> URL analysis
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">Fraud Link Detector</h1>
        <p className="mt-3 text-muted-foreground">
          Paste a suspicious link. ThreatGuard inspects the domain, certificate, redirect chain and
          blacklist feeds, then returns a clear verdict.
        </p>
      </header>

      <div className="glass mt-8 rounded-2xl p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleScan();
            }}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-input bg-background/60 px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent"
          />
          <button
            type="button"
            onClick={handleScan}
            disabled={busy}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
          >
            <Sparkles className="size-4" />
            {busy ? "Scanning..." : "Scan URL"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Try:</span>
          {["http://secure-login-update.top/verify", "https://bit.ly/3xamPle", "https://github.com"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setUrl(s)}
              className="rounded-full border border-border px-2.5 py-1 font-mono transition-colors hover:bg-secondary"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {busy && (
        <div className="mt-8 max-w-md">
          <AnalysisProgress steps={URL_ANALYSIS_STEPS} current={runner.current} />
        </div>
      )}

      {result && !busy && tone && (
        <div className="mt-10 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <RiskVerdict risk={result.riskLevel} />

            <div className={cn("glass rounded-2xl border p-6", tone.border)}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    URL security report
                  </p>
                  <p className="mt-1 truncate font-mono text-sm text-foreground">{result.url}</p>
                  <div className="mt-3">
                    <RiskBadge risk={result.riskLevel} />
                  </div>
                </div>
                <ThreatGauge score={result.threatScore} risk={result.riskLevel} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Fact icon={Globe} label="Domain name" value={result.domain} />
                <Fact icon={CalendarClock} label="Domain age" value={result.domainAge} />
                <Fact icon={Lock} label="SSL status" value={result.sslStatus} />
                <Fact icon={ListChecks} label="Blacklist status" value={result.blacklistStatus} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-base font-semibold">AI decision</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.reason}</p>
              <p className={cn("mt-5 rounded-xl border p-3 text-sm font-medium", tone.bg, tone.border, tone.text)}>
                {result.recommendedAction}
              </p>
              <div className="mt-5">
                <DownloadReportButton
                  filename={`threatguard-url-report-${Date.now()}.txt`}
                  body={buildUrlReport(result)}
                />
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-base font-semibold">Detected indicators</h3>
              <div className="mt-3">
                <IndicatorList indicators={result.indicators} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Globe;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3">
      <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="mt-1.5 truncate text-sm font-medium">{value}</p>
    </div>
  );
}
