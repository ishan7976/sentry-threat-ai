import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BrainCircuit,
  FileSearch,
  Link2,
  Lock,
  Radar,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import heroImage from "@/assets/hero-shield.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThreatGuard AI — AI-Powered Email Threat Detection" },
      {
        name: "description",
        content:
          "Detect phishing, malicious links, scams and cyber threats before they harm you. Explainable AI threat scores for every email and URL.",
      },
      { property: "og:title", content: "ThreatGuard AI — AI-Powered Email Threat Detection" },
      {
        property: "og:description",
        content: "Detect phishing, malicious links, scams and cyber threats before they harm you.",
      },
    ],
  }),
  component: Landing,
});

const stats = [
  { label: "Emails analyzed", value: "12.4M", icon: FileSearch, delta: "+8.2% this week" },
  { label: "Phishing blocked", value: "382K", icon: ShieldCheck, delta: "94.7% catch rate" },
  { label: "Malicious links", value: "129K", icon: Link2, delta: "+3.1% this week" },
  { label: "Median scan time", value: "1.8s", icon: Zap, delta: "Real-time verdicts" },
];

const capabilities = [
  {
    icon: BrainCircuit,
    title: "NLP intent analysis",
    body: "Reads the message the way an analyst would — urgency, authority pressure, credential requests and payment bait.",
  },
  {
    icon: Radar,
    title: "Domain reputation",
    body: "Header alignment, look-alike domains, newly registered hosts and abused TLDs are correlated into one verdict.",
  },
  {
    icon: Link2,
    title: "Link infrastructure",
    body: "Unwraps shorteners, inspects certificates and checks blacklist feeds before you ever click.",
  },
  {
    icon: Activity,
    title: "Explainable scoring",
    body: "Every 0–100 score ships with the exact indicators behind it, so the decision is auditable.",
  },
];

function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden hero-bg">
        <div className="absolute inset-0 grid-bg" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              AI threat intelligence, in real time
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              AI-Powered Email <span className="text-gradient">Threat Detection</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Detect phishing, malicious links, scams and cyber threats before they harm you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/email-scanner"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 glow-ring"
              >
                <FileSearch className="size-4" /> Scan Email
              </Link>
              <Link
                to="/link-scanner"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                <Link2 className="size-4" /> Check Suspicious Link
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Lock className="size-4 text-safe" /> Content never leaves your session
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-safe" /> 94.7% phishing catch rate
              </span>
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="size-4 text-accent" /> Explainable verdicts
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="glass overflow-hidden rounded-3xl glow-ring">
              <img
                src={heroImage}
                alt="AI shield protecting an email network from cyber threats"
                width={1280}
                height={1024}
                className="h-full w-full object-cover opacity-90"
              />
            </div>
            <div className="glass absolute -bottom-6 -left-4 hidden w-64 rounded-2xl p-4 sm:block">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Live verdict</p>
              <p className="mt-1 font-display text-lg font-semibold text-danger">Phishing Attack</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Score 94/100 · credential request from a look-alike domain
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</span>
                <s.icon className="size-4 text-primary" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-accent">{s.delta}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">How the engine thinks</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Five analysis passes run on every submission and merge into a single, auditable threat
          score.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {capabilities.map((c) => (
            <div key={c.title} className="glass group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:glow-ring">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary/20">
                <c.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="glass relative overflow-hidden rounded-3xl p-10 text-center">
          <div className="absolute inset-0 hero-bg opacity-70" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Run your first scan in under two seconds
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Paste an email or a suspicious link and get a category, score, evidence list and a
              downloadable security report.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/email-scanner"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                Scan an email
              </Link>
              <Link
                to="/dashboard"
                className="rounded-xl border border-border bg-secondary/60 px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                View dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
