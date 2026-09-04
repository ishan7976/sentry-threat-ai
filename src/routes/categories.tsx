import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BadgeDollarSign,
  FileWarning,
  Inbox,
  Link2,
  Mail,
  UserX,
  Fish,
} from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Threat Categories — ThreatGuard AI" },
      {
        name: "description",
        content:
          "Reference guide to the eight email threat categories ThreatGuard AI classifies: phishing, spoofing, malicious links, attachments, scams and more.",
      },
      { property: "og:title", content: "Threat Categories — ThreatGuard AI" },
      {
        property: "og:description",
        content: "Understand every threat class ThreatGuard AI detects and how to respond.",
      },
    ],
  }),
  component: Categories,
});

const categories = [
  {
    icon: Mail,
    title: "Safe Email",
    body: "Normal communication without suspicious indicators.",
    tone: "safe",
    action: "Safe to open",
  },
  {
    icon: Fish,
    title: "Phishing Attack",
    body: "Attempts to steal passwords, OTPs or sensitive information.",
    tone: "danger",
    action: "Block and report",
  },
  {
    icon: UserX,
    title: "Social Engineering",
    body: "Uses urgency, fear or manipulation.",
    tone: "warn",
    action: "Verify through another channel",
  },
  {
    icon: Link2,
    title: "Malicious Link",
    body: "Contains harmful or suspicious URLs.",
    tone: "danger",
    action: "Do not click",
  },
  {
    icon: FileWarning,
    title: "Malicious Attachment",
    body: "Contains dangerous files.",
    tone: "danger",
    action: "Delete without opening",
  },
  {
    icon: AlertTriangle,
    title: "Spoofing",
    body: "Fake sender identity or impersonation.",
    tone: "warn",
    action: "Confirm the real sender",
  },
  {
    icon: BadgeDollarSign,
    title: "Financial Scam",
    body: "Fake payments, rewards or money fraud.",
    tone: "danger",
    action: "Never send money or details",
  },
  {
    icon: Inbox,
    title: "Spam",
    body: "Unwanted promotional emails.",
    tone: "warn",
    action: "Unsubscribe or filter",
  },
] as const;

const toneClass: Record<string, string> = {
  safe: "text-safe bg-safe/12 border-safe/30",
  warn: "text-warn bg-warn/12 border-warn/30",
  danger: "text-danger bg-danger/12 border-danger/30",
};

function Categories() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">Threat Categories</h1>
        <p className="mt-3 text-muted-foreground">
          Every scan is classified into one of eight categories. Each one maps to a different
          attacker goal — and a different safe response.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <article
            key={c.title}
            className="glass group flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:glow-ring"
          >
            <span
              className={`flex size-11 items-center justify-center rounded-xl border ${toneClass[c.tone]}`}
            >
              <c.icon className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold">{c.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            <p className="mt-4 border-t border-border pt-3 text-xs uppercase tracking-widest text-muted-foreground">
              Response
            </p>
            <p className="mt-1 text-sm font-medium">{c.action}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
