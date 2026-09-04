import { CheckCircle2, Download, Minus, ShieldQuestion } from "lucide-react";
import type { EmailAnalysis, UrlAnalysis } from "@/lib/threat-engine";
import { RiskBadge, ThreatGauge, riskTone } from "@/components/risk-visuals";
import { cn } from "@/lib/utils";

function downloadText(filename: string, body: string) {
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildEmailReport(r: EmailAnalysis) {
  const detected = r.indicators.filter((i) => i.detected);
  return [
    "THREATGUARD AI — EMAIL SECURITY REPORT",
    "=======================================",
    `Generated: ${new Date(r.scannedAt).toLocaleString()}`,
    `Sender: ${r.sender}`,
    `Subject: ${r.subject}`,
    "",
    "THREAT SUMMARY",
    `Category: ${r.category}`,
    `Threat score: ${r.threatScore}/100`,
    `Risk level: ${r.riskLevel}`,
    "",
    "AI DECISION",
    r.reason,
    "",
    "DETECTED PROBLEMS",
    ...(detected.length ? detected.map((i) => `- ${i.label}: ${i.detail}`) : ["- None detected"]),
    "",
    "SAFETY RECOMMENDATIONS",
    `- ${r.recommendedAction}`,
    "- Never enter credentials or OTPs from a link inside an email.",
    "- Verify unusual payment or access requests through a separate trusted channel.",
    "- Report confirmed threats to your security team.",
  ].join("\n");
}

export function buildUrlReport(r: UrlAnalysis) {
  const detected = r.indicators.filter((i) => i.detected);
  return [
    "THREATGUARD AI — URL SECURITY REPORT",
    "=====================================",
    `Generated: ${new Date(r.scannedAt).toLocaleString()}`,
    `URL: ${r.url}`,
    `Domain: ${r.domain}`,
    `Domain age: ${r.domainAge}`,
    `SSL: ${r.sslStatus}`,
    `Blacklist: ${r.blacklistStatus}`,
    "",
    "THREAT SUMMARY",
    `Threat score: ${r.threatScore}/100`,
    `Risk level: ${r.riskLevel}`,
    "",
    "AI DECISION",
    r.reason,
    "",
    "DETECTED PROBLEMS",
    ...(detected.length ? detected.map((i) => `- ${i.label}: ${i.detail}`) : ["- None detected"]),
    "",
    "SAFETY RECOMMENDATIONS",
    `- ${r.recommendedAction}`,
  ].join("\n");
}

export function DownloadReportButton({ filename, body }: { filename: string; body: string }) {
  return (
    <button
      type="button"
      onClick={() => downloadText(filename, body)}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
    >
      <Download className="size-4" />
      Download report
    </button>
  );
}

export function IndicatorList({
  indicators,
}: {
  indicators: { label: string; detected: boolean; detail: string }[];
}) {
  return (
    <ul className="space-y-2.5">
      {indicators.map((i) => (
        <li
          key={i.label}
          className={cn(
            "flex gap-3 rounded-xl border p-3",
            i.detected ? "border-danger/30 bg-danger/8" : "border-border bg-secondary/30",
          )}
        >
          {i.detected ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-danger" />
          ) : (
            <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          )}
          <div>
            <p className={cn("text-sm font-medium", i.detected ? "text-foreground" : "text-muted-foreground")}>
              {i.label}
            </p>
            <p className="text-xs text-muted-foreground">{i.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EmailReportCard({ result }: { result: EmailAnalysis }) {
  const tone = riskTone(result.riskLevel);
  const detected = result.indicators.filter((i) => i.detected);

  return (
    <div className="space-y-6">
      <div className={cn("glass rounded-2xl border p-6", tone.border)}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">AI Security Report</p>
            <h2 className="mt-1 font-display text-2xl font-bold">{result.category}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.sender} · {result.subject}
            </p>
          </div>
          <ThreatGauge score={result.threatScore} risk={result.riskLevel} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <RiskBadge risk={result.riskLevel} />
          <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
            {detected.length} indicator{detected.length === 1 ? "" : "s"} detected
          </span>
          <DownloadReportButton
            filename={`threatguard-email-report-${Date.now()}.txt`}
            body={buildEmailReport(result)}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold">
            <ShieldQuestion className="size-4 text-primary" /> Why the AI flagged this
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.reason}</p>

          <h4 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Recommended action
          </h4>
          <p className={cn("mt-2 rounded-xl border p-3 text-sm font-medium", tone.bg, tone.border, tone.text)}>
            {result.recommendedAction}
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-base font-semibold">Detected indicators</h3>
          <div className="mt-3">
            <IndicatorList indicators={result.indicators} />
          </div>
        </div>
      </div>
    </div>
  );
}
