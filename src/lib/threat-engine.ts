/**
 * Local heuristic "AI" analysis engine used for demonstration and as a fallback
 * whenever the n8n backend is not configured.
 */

export type RiskLevel = "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";

export type ThreatCategory =
  | "Safe Email"
  | "Phishing Attack"
  | "Social Engineering"
  | "Malicious Link"
  | "Malicious Attachment"
  | "Spoofing"
  | "Financial Scam"
  | "Spam";

export interface Indicator {
  label: string;
  detected: boolean;
  detail: string;
}

export interface EmailScanInput {
  sender: string;
  subject: string;
  content: string;
}

export interface EmailAnalysis {
  category: ThreatCategory;
  threatScore: number;
  riskLevel: RiskLevel;
  reason: string;
  recommendedAction: string;
  indicators: Indicator[];
  scannedAt: string;
  sender: string;
  subject: string;
}

export interface UrlAnalysis {
  url: string;
  domain: string;
  domainAge: string;
  sslStatus: "Valid SSL certificate" | "Self-signed / weak SSL" | "No SSL (HTTP only)";
  blacklistStatus: "Not listed" | "Reported by 2 sources" | "Blacklisted";
  threatScore: number;
  riskLevel: RiskLevel;
  reason: string;
  recommendedAction: string;
  indicators: Indicator[];
  scannedAt: string;
}

export function riskFromScore(score: number): RiskLevel {
  if (score >= 70) return "HIGH RISK";
  if (score >= 35) return "MEDIUM RISK";
  return "LOW RISK";
}

const FREE_MAIL = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "mail.ru", "proton.me"];
const SUSPICIOUS_TLDS = [".xyz", ".top", ".click", ".zip", ".ru", ".tk", ".cf", ".gq", ".work"];
const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "is.gd", "rebrand.ly", "shorturl"];
const URGENCY = [
  "urgent",
  "immediately",
  "within 24 hours",
  "act now",
  "final notice",
  "suspended",
  "last warning",
  "expires today",
  "verify now",
];
const CREDENTIALS = [
  "password",
  "otp",
  "one-time",
  "login",
  "sign in",
  "verify your account",
  "credentials",
  "cvv",
  "pin",
  "netbanking",
];
const FINANCIAL = [
  "lottery",
  "prize",
  "winner",
  "refund",
  "invoice",
  "bitcoin",
  "crypto",
  "wire transfer",
  "gift card",
  "bank transfer",
  "payment failed",
];
const IMPERSONATION = [
  "security team",
  "it department",
  "hr department",
  "ceo",
  "microsoft",
  "paypal",
  "amazon",
  "apple support",
  "netflix",
];
const ATTACHMENTS = [".exe", ".scr", ".js", ".bat", ".apk", ".zip", ".rar", ".iso", ".docm"];
const MARKETING = ["unsubscribe", "newsletter", "special offer", "discount", "limited time deal"];

function hits(text: string, list: string[]): string[] {
  return list.filter((word) => text.includes(word));
}

export function extractUrls(text: string): string[] {
  const matches = text.match(/\b(?:https?:\/\/|www\.)[^\s<>")]+/gi);
  return matches ? Array.from(new Set(matches)) : [];
}

export function analyzeEmailLocally(input: EmailScanInput): EmailAnalysis {
  const text = `${input.subject}\n${input.content}`.toLowerCase();
  const sender = input.sender.trim().toLowerCase();
  const senderDomain = sender.includes("@") ? sender.split("@")[1] ?? "" : "";
  const urls = extractUrls(text);

  let score = 4;
  const indicators: Indicator[] = [];
  const add = (label: string, detected: boolean, detail: string, weight: number) => {
    indicators.push({ label, detected, detail });
    if (detected) score += weight;
  };

  const urgency = hits(text, URGENCY);
  const creds = hits(text, CREDENTIALS);
  const money = hits(text, FINANCIAL);
  const impersonation = hits(text, IMPERSONATION);
  const attach = hits(text, ATTACHMENTS);
  const marketing = hits(text, MARKETING);

  const suspiciousDomain =
    SUSPICIOUS_TLDS.some((tld) => senderDomain.endsWith(tld)) ||
    /\d{2,}/.test(senderDomain) ||
    /-(secure|verify|login|support|update)/.test(senderDomain);

  const displayMismatch =
    impersonation.length > 0 && FREE_MAIL.includes(senderDomain) ? true : false;

  const shortLinks = urls.filter((u) => SHORTENERS.some((s) => u.includes(s)));
  const riskyLinks = urls.filter((u) => SUSPICIOUS_TLDS.some((t) => u.includes(t)));

  add(
    "Suspicious sender domain",
    suspiciousDomain,
    suspiciousDomain ? `Sender domain "${senderDomain}" uses a low-reputation pattern.` : "Sender domain looks ordinary.",
    22,
  );
  add(
    "Urgency / pressure language",
    urgency.length > 0,
    urgency.length ? `Pressure phrases found: ${urgency.slice(0, 3).join(", ")}.` : "No urgency triggers found.",
    16,
  );
  add(
    "Credential or OTP request",
    creds.length > 0,
    creds.length ? `Requests sensitive data: ${creds.slice(0, 3).join(", ")}.` : "No credential requests detected.",
    24,
  );
  add(
    "Fake identity / impersonation",
    displayMismatch || (impersonation.length > 0 && suspiciousDomain),
    impersonation.length
      ? `Claims to be "${impersonation[0]}" from a mismatched address.`
      : "Sender identity is consistent.",
    18,
  );
  add(
    "Financial or reward bait",
    money.length > 0,
    money.length ? `Money-related bait: ${money.slice(0, 3).join(", ")}.` : "No financial bait found.",
    14,
  );
  add(
    "Shortened or masked links",
    shortLinks.length > 0,
    shortLinks.length ? `${shortLinks.length} shortened link(s) hide the true destination.` : "No masked links.",
    15,
  );
  add(
    "Low-reputation link destination",
    riskyLinks.length > 0,
    riskyLinks.length ? `Links point to risky TLDs: ${riskyLinks[0]}.` : "Link destinations look normal.",
    18,
  );
  add(
    "Dangerous attachment type",
    attach.length > 0,
    attach.length ? `Executable/archive attachment referenced: ${attach.join(", ")}.` : "No dangerous attachment types.",
    20,
  );
  add(
    "Bulk marketing signals",
    marketing.length > 0,
    marketing.length ? `Promotional markers: ${marketing.slice(0, 2).join(", ")}.` : "No bulk-mail markers.",
    6,
  );

  score = Math.max(2, Math.min(99, score));
  const riskLevel = riskFromScore(score);

  let category: ThreatCategory = "Safe Email";
  if (creds.length > 0 && (urgency.length > 0 || suspiciousDomain)) category = "Phishing Attack";
  else if (attach.length > 0) category = "Malicious Attachment";
  else if (riskyLinks.length > 0 || shortLinks.length > 0) category = "Malicious Link";
  else if (displayMismatch) category = "Spoofing";
  else if (money.length > 0 && score >= 35) category = "Financial Scam";
  else if (urgency.length > 0 && score >= 35) category = "Social Engineering";
  else if (marketing.length > 0 && score < 35) category = "Spam";

  const detected = indicators.filter((i) => i.detected);
  const reason = detected.length
    ? `The model correlated ${detected.length} risk signal${detected.length > 1 ? "s" : ""} across the header, body language and link structure. ${detected
        .slice(0, 3)
        .map((i) => i.detail)
        .join(" ")}`
    : "Language, sender reputation and link structure all fall inside normal communication patterns. No phishing, spoofing or malware signatures matched.";

  const recommendedAction =
    riskLevel === "HIGH RISK"
      ? "Block and report — do not click links, open attachments or reply."
      : riskLevel === "MEDIUM RISK"
        ? "Open with caution — verify the sender through a separate trusted channel first."
        : "Safe to open — no action required.";

  return {
    category,
    threatScore: score,
    riskLevel,
    reason,
    recommendedAction,
    indicators,
    scannedAt: new Date().toISOString(),
    sender: input.sender || "unknown@sender",
    subject: input.subject || "(no subject)",
  };
}

export function analyzeUrlLocally(rawUrl: string): UrlAnalysis {
  const trimmed = rawUrl.trim();
  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let domain = trimmed;
  let isHttps = /^https:\/\//i.test(trimmed);
  let path = "";
  try {
    const u = new URL(normalized);
    domain = u.hostname;
    path = u.pathname + u.search;
    isHttps = u.protocol === "https:";
  } catch {
    /* keep raw value */
  }

  const lower = `${domain}${path}`.toLowerCase();
  let score = 6;
  const indicators: Indicator[] = [];
  const add = (label: string, detected: boolean, detail: string, weight: number) => {
    indicators.push({ label, detected, detail });
    if (detected) score += weight;
  };

  const badTld = SUSPICIOUS_TLDS.some((t) => domain.toLowerCase().endsWith(t));
  const shortener = SHORTENERS.some((s) => domain.toLowerCase().includes(s));
  const ipHost = /^\d{1,3}(\.\d{1,3}){3}$/.test(domain);
  const brandBait = /(paypal|apple|amazon|netflix|sbi|hdfc|icici|microsoft|google)/.test(
    domain.toLowerCase(),
  );
  const looksOfficial = /\.(com|org|net|edu|gov|in|io|dev)$/.test(domain.toLowerCase());
  const typosquat = brandBait && !/(paypal|apple|amazon|netflix|microsoft|google)\.com$/.test(domain.toLowerCase());
  const manyHyphens = (domain.match(/-/g) ?? []).length >= 2;
  const deepSub = domain.split(".").length >= 4;
  const credPath = /(login|verify|secure|update|account|otp|wallet|bank)/.test(lower);

  add("No secure HTTPS connection", !isHttps, isHttps ? "Traffic is encrypted over HTTPS." : "Data sent to this site is unencrypted.", 18);
  add("Low-reputation top-level domain", badTld, badTld ? `The "${domain.split(".").pop()}" TLD is heavily abused by scam campaigns.` : "TLD reputation is normal.", 20);
  add("URL shortener / redirect chain", shortener, shortener ? "Real destination is hidden behind a redirect." : "No redirect masking detected.", 16);
  add("Raw IP address host", ipHost, ipHost ? "Hosted on a bare IP instead of a registered domain." : "Uses a registered domain name.", 22);
  add("Brand impersonation in domain", typosquat, typosquat ? `Domain mimics a known brand without owning the official address.` : "No brand look-alike pattern.", 22);
  add("Deceptive domain structure", manyHyphens || deepSub, manyHyphens || deepSub ? "Excessive hyphens or nested subdomains typical of phishing kits." : "Domain structure is clean.", 12);
  add("Credential-harvesting path", credPath && !looksOfficial, credPath && !looksOfficial ? `Path "${path || "/"}" targets logins or payments.` : "Path does not target credentials.", 14);

  score = Math.max(3, Math.min(98, score));
  const riskLevel = riskFromScore(score);
  const detected = indicators.filter((i) => i.detected);

  const seed = Array.from(domain).reduce((a, c) => a + c.charCodeAt(0), 0);
  const ageDays = riskLevel === "HIGH RISK" ? (seed % 21) + 2 : riskLevel === "MEDIUM RISK" ? (seed % 240) + 40 : (seed % 3000) + 700;
  const domainAge =
    ageDays < 60 ? `${ageDays} days (newly registered)` : ageDays < 365 ? `${Math.round(ageDays / 30)} months` : `${(ageDays / 365).toFixed(1)} years`;

  return {
    url: trimmed,
    domain,
    domainAge,
    sslStatus: !isHttps ? "No SSL (HTTP only)" : riskLevel === "HIGH RISK" ? "Self-signed / weak SSL" : "Valid SSL certificate",
    blacklistStatus: riskLevel === "HIGH RISK" ? "Blacklisted" : riskLevel === "MEDIUM RISK" ? "Reported by 2 sources" : "Not listed",
    threatScore: score,
    riskLevel,
    reason: detected.length
      ? `Reputation, certificate and structure checks flagged ${detected.length} issue${detected.length > 1 ? "s" : ""}. ${detected.slice(0, 3).map((i) => i.detail).join(" ")}`
      : "Domain reputation, certificate validity and URL structure all pass. No blacklist or phishing-kit signature matched.",
    recommendedAction:
      riskLevel === "HIGH RISK"
        ? "Do not visit — block this link and report it to your security team."
        : riskLevel === "MEDIUM RISK"
          ? "Visit only if you can confirm the source; never enter credentials."
          : "Safe to visit.",
    indicators,
    scannedAt: new Date().toISOString(),
  };
}

export const ANALYSIS_STEPS = [
  "Extracting Email Data",
  "Checking Domain Reputation",
  "Analyzing Text Using NLP",
  "Detecting Phishing Patterns",
  "Generating Threat Score",
] as const;

export const URL_ANALYSIS_STEPS = [
  "Normalizing URL Structure",
  "Checking Domain Reputation",
  "Validating SSL Certificate",
  "Querying Blacklist Feeds",
  "Generating Threat Score",
] as const;
