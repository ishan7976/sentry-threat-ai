/**
 * ThreatGuard AI — API service layer.
 *
 * Designed to plug into an n8n workflow. Set VITE_THREAT_API_BASE_URL to the
 * n8n webhook base (e.g. https://n8n.example.com/webhook) and the app will POST:
 *
 *   POST /analyze-email
 *   POST /scan-url
 *
 * Expected response shape:
 * {
 *   category: "",
 *   threat_score: 0,
 *   risk_level: "",
 *   reason: "",
 *   recommended_action: ""
 * }
 *
 * When no base URL is configured, the local AI heuristic engine is used so the
 * product stays fully demonstrable offline.
 */

import {
  analyzeEmailLocally,
  analyzeUrlLocally,
  type EmailAnalysis,
  type EmailScanInput,
  type UrlAnalysis,
} from "@/lib/threat-engine";

export const API_BASE_URL: string =
  (import.meta.env["VITE_THREAT_API_BASE_URL"] as string | undefined) ?? "";

export const ENDPOINTS = {
  analyzeEmail: "/analyze-email",
  scanUrl: "/scan-url",
} as const;

export interface ThreatApiResponse {
  category: string;
  threat_score: number;
  risk_level: string;
  reason: string;
  recommended_action: string;
  indicators?: string[];
  details?: Record<string, string>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return (await res.json()) as T;
}

export async function analyzeEmail(input: EmailScanInput): Promise<EmailAnalysis> {
  const local = analyzeEmailLocally(input);
  if (!API_BASE_URL) return local;

  try {
    const remote = await post<ThreatApiResponse>(ENDPOINTS.analyzeEmail, input);
    return mergeEmail(local, remote);
  } catch {
    return local;
  }
}

export async function scanUrl(url: string): Promise<UrlAnalysis> {
  const local = analyzeUrlLocally(url);
  if (!API_BASE_URL) return local;

  try {
    const remote = await post<ThreatApiResponse>(ENDPOINTS.scanUrl, { url });
    return {
      ...local,
      threatScore: remote.threat_score ?? local.threatScore,
      riskLevel: (remote.risk_level as UrlAnalysis["riskLevel"]) || local.riskLevel,
      reason: remote.reason || local.reason,
      recommendedAction: remote.recommended_action || local.recommendedAction,
    };
  } catch {
    return local;
  }
}

function mergeEmail(local: EmailAnalysis, remote: ThreatApiResponse): EmailAnalysis {
  return {
    ...local,
    category: (remote.category as EmailAnalysis["category"]) || local.category,
    threatScore: remote.threat_score ?? local.threatScore,
    riskLevel: (remote.risk_level as EmailAnalysis["riskLevel"]) || local.riskLevel,
    reason: remote.reason || local.reason,
    recommendedAction: remote.recommended_action || local.recommendedAction,
    indicators: remote.indicators?.length
      ? remote.indicators.map((label) => ({ label, detected: true, detail: "" }))
      : local.indicators,
  };
}
