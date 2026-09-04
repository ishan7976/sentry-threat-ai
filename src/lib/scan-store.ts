import { useSyncExternalStore } from "react";
import type { EmailAnalysis, RiskLevel, ThreatCategory, UrlAnalysis } from "./threat-engine";

export interface ScanLog {
  id: string;
  date: string;
  type: "Email" | "URL";
  subject: string;
  sender: string;
  category: ThreatCategory | "Malicious Link" | "Safe Email";
  score: number;
  risk: RiskLevel;
  action: string;
  reason: string;
  indicators: string[];
}

const seed: ScanLog[] = [
  {
    id: "log-1",
    date: "2026-09-04T09:12:00.000Z",
    type: "Email",
    subject: "Urgent: Your account will be suspended",
    sender: "security@paypa1-verify.xyz",
    category: "Phishing Attack",
    score: 94,
    risk: "HIGH RISK",
    action: "Block and report",
    reason: "Credential request combined with urgency language from a look-alike domain.",
    indicators: ["Suspicious sender domain", "Urgency / pressure language", "Credential or OTP request"],
  },
  {
    id: "log-2",
    date: "2026-09-04T08:41:00.000Z",
    type: "Email",
    subject: "Invoice #48211 attached",
    sender: "billing@acme-suppliers.com",
    category: "Malicious Attachment",
    score: 77,
    risk: "HIGH RISK",
    action: "Block and report",
    reason: "Archive attachment referencing an executable payload.",
    indicators: ["Dangerous attachment type", "Financial or reward bait"],
  },
  {
    id: "log-3",
    date: "2026-09-03T17:05:00.000Z",
    type: "URL",
    subject: "http://secure-login-update.top/verify",
    sender: "secure-login-update.top",
    category: "Malicious Link",
    score: 88,
    risk: "HIGH RISK",
    action: "Do not visit",
    reason: "Unencrypted host on an abused TLD with a credential-harvesting path.",
    indicators: ["No secure HTTPS connection", "Low-reputation top-level domain"],
  },
  {
    id: "log-4",
    date: "2026-09-03T14:20:00.000Z",
    type: "Email",
    subject: "Team offsite agenda",
    sender: "priya@company.com",
    category: "Safe Email",
    score: 6,
    risk: "LOW RISK",
    action: "Safe to open",
    reason: "Normal internal communication with no risk signals.",
    indicators: [],
  },
  {
    id: "log-5",
    date: "2026-09-03T11:02:00.000Z",
    type: "Email",
    subject: "You have won a ₹50,000 reward",
    sender: "rewards@lucky-draw-win.click",
    category: "Financial Scam",
    score: 71,
    risk: "HIGH RISK",
    action: "Block and report",
    reason: "Prize bait from an unknown low-reputation domain.",
    indicators: ["Financial or reward bait", "Suspicious sender domain"],
  },
  {
    id: "log-6",
    date: "2026-09-02T19:44:00.000Z",
    type: "Email",
    subject: "Re: Contract review — quick question",
    sender: "ceo@company-hr-portal.com",
    category: "Social Engineering",
    score: 52,
    risk: "MEDIUM RISK",
    action: "Open with caution",
    reason: "Authority impersonation with time pressure but no direct payload.",
    indicators: ["Fake identity / impersonation", "Urgency / pressure language"],
  },
  {
    id: "log-7",
    date: "2026-09-02T10:31:00.000Z",
    type: "Email",
    subject: "50% off — limited time deal",
    sender: "promo@shopmailer.net",
    category: "Spam",
    score: 21,
    risk: "LOW RISK",
    action: "Safe to open",
    reason: "Bulk promotional mail with no malicious payload.",
    indicators: ["Bulk marketing signals"],
  },
  {
    id: "log-8",
    date: "2026-09-01T15:12:00.000Z",
    type: "Email",
    subject: "Password reset requested",
    sender: "no-reply@accounts.google.com",
    category: "Safe Email",
    score: 12,
    risk: "LOW RISK",
    action: "Safe to open",
    reason: "Verified sender infrastructure with matching domain alignment.",
    indicators: [],
  },
];

let logs: ScanLog[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLogs() {
  return logs;
}

export function useScanLogs(): ScanLog[] {
  return useSyncExternalStore(subscribe, getLogs, getLogs);
}

export function addEmailLog(result: EmailAnalysis) {
  logs = [
    {
      id: `log-${Date.now()}`,
      date: result.scannedAt,
      type: "Email",
      subject: result.subject,
      sender: result.sender,
      category: result.category,
      score: result.threatScore,
      risk: result.riskLevel,
      action: result.recommendedAction,
      reason: result.reason,
      indicators: result.indicators.filter((i) => i.detected).map((i) => i.label),
    },
    ...logs,
  ];
  emit();
}

export function addUrlLog(result: UrlAnalysis) {
  logs = [
    {
      id: `log-${Date.now()}`,
      date: result.scannedAt,
      type: "URL",
      subject: result.url,
      sender: result.domain,
      category: "Malicious Link",
      score: result.threatScore,
      risk: result.riskLevel,
      action: result.recommendedAction,
      reason: result.reason,
      indicators: result.indicators.filter((i) => i.detected).map((i) => i.label),
    },
    ...logs,
  ];
  emit();
}

export function stats(all: ScanLog[]) {
  const emails = all.filter((l) => l.type === "Email");
  const threats = all.filter((l) => l.risk !== "LOW RISK");
  return {
    scanned: all.length,
    emails: emails.length,
    threats: threats.length,
    safe: all.length - threats.length,
    blocked: all.filter((l) => l.risk === "HIGH RISK").length,
    low: all.filter((l) => l.risk === "LOW RISK").length,
    medium: all.filter((l) => l.risk === "MEDIUM RISK").length,
    high: all.filter((l) => l.risk === "HIGH RISK").length,
  };
}
