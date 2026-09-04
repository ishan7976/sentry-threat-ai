import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileUp, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AnalysisProgress, useAnalysisRunner } from "@/components/analysis-progress";
import { EmailReportCard } from "@/components/report-view";
import { analyzeEmail } from "@/services/api";
import { ANALYSIS_STEPS, type EmailAnalysis } from "@/lib/threat-engine";
import { addEmailLog } from "@/lib/scan-store";

export const Route = createFileRoute("/email-scanner")({
  head: () => ({
    meta: [
      { title: "AI Email Scanner — ThreatGuard AI" },
      {
        name: "description",
        content:
          "Paste or upload an email and get an AI threat category, 0-100 score, detected indicators and a recommended action.",
      },
      { property: "og:title", content: "AI Email Scanner — ThreatGuard AI" },
      {
        property: "og:description",
        content: "Analyze any email for phishing, spoofing, scams and malicious attachments.",
      },
    ],
  }),
  component: EmailScanner,
});

const SAMPLE = {
  sender: "security@paypa1-verify.xyz",
  subject: "Urgent: your account will be suspended within 24 hours",
  content: `Dear customer,

We detected unusual activity on your account. Your access will be suspended immediately unless you verify your account now.

Please confirm your password and OTP here: http://bit.ly/secure-verify-login

Failure to act today will result in permanent closure.

PayPal Security Team`,
};

function EmailScanner() {
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<EmailAnalysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const runner = useAnalysisRunner(ANALYSIS_STEPS);

  const busy = runner.running && runner.current < ANALYSIS_STEPS.length;

  async function handleScan() {
    if (!content.trim() && !subject.trim()) {
      toast.error("Add the email content or subject before scanning.");
      return;
    }
    setResult(null);
    runner.start();
    const [analysis] = await Promise.all([
      analyzeEmail({ sender, subject, content }),
      new Promise((r) => setTimeout(r, ANALYSIS_STEPS.length * 620 + 200)),
    ]);
    runner.stop();
    setResult(analysis);
    addEmailLog(analysis);
    toast.success(`Analysis complete — ${analysis.category}`);
  }

  async function handleFile(file: File) {
    const text = await file.text();
    setContent(text);
    const from = text.match(/^From:\s*(.+)$/im)?.[1];
    const subj = text.match(/^Subject:\s*(.+)$/im)?.[1];
    if (from) setSender(from.replace(/.*<|>.*/g, "").trim());
    if (subj) setSubject(subj.trim());
    toast.success(`Loaded ${file.name}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Mail className="size-3.5" /> Email analysis
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">AI Email Scanner</h1>
        <p className="mt-3 text-muted-foreground">
          Paste the message, upload an .eml/.txt file or fill in the header fields. The engine
          returns a threat category, score, the indicators it found and what to do next.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Sender email
              </span>
              <input
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="alerts@bank-secure.xyz"
                className="mt-2 w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Subject
              </span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Action required on your account"
                className="mt-2 w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Email content
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Paste the full email body here, including any links..."
              className="mt-2 w-full resize-y rounded-xl border border-input bg-background/60 px-3 py-2.5 font-mono text-sm leading-relaxed outline-none transition-colors focus:border-primary"
            />
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleScan}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
            >
              <Sparkles className="size-4" />
              {busy ? "Analyzing..." : "Run AI scan"}
            </button>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <FileUp className="size-4" /> Upload email file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".eml,.txt,.msg,message/rfc822,text/plain"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
            />

            <button
              type="button"
              onClick={() => {
                setSender(SAMPLE.sender);
                setSubject(SAMPLE.subject);
                setContent(SAMPLE.content);
              }}
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Load phishing sample
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {(busy || result) && (
            <AnalysisProgress steps={ANALYSIS_STEPS} current={busy ? runner.current : ANALYSIS_STEPS.length} />
          )}
          {!busy && !result && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-base font-semibold">What gets checked</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {ANALYSIS_STEPS.map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {result && !busy && (
        <div className="mt-10">
          <EmailReportCard result={result} />
        </div>
      )}
    </div>
  );
}
