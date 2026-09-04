import { Link } from "@tanstack/react-router";
import { Mail, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <ShieldCheck className="size-4" />
            </span>
            <span className="font-display text-base font-semibold">ThreatGuard AI</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            ThreatGuard AI inspects email headers, body language and link infrastructure to surface
            phishing, spoofing, social engineering and fraud attempts before a user acts on them.
            Every verdict ships with the evidence behind it.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Analysis results are advisory. Always confirm high-value requests through a second
            trusted channel.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/email-scanner" className="transition-colors hover:text-foreground">Email Scanner</Link></li>
            <li><Link to="/link-scanner" className="transition-colors hover:text-foreground">Link Scanner</Link></li>
            <li><Link to="/dashboard" className="transition-colors hover:text-foreground">Threat Dashboard</Link></li>
            <li><Link to="/categories" className="transition-colors hover:text-foreground">Threat Categories</Link></li>
            <li><Link to="/reports" className="transition-colors hover:text-foreground">Reports</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact &amp; Privacy</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4" /> security@threatguard.ai
            </li>
            <li>Scans are processed in-session and are not stored on a server.</li>
            <li>No email content is shared with third parties.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} ThreatGuard AI — AI Email Threat Detection &amp; Fraud Link Analyzer.
      </div>
    </footer>
  );
}
