import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/email-scanner", label: "Email Scanner" },
  { to: "/link-scanner", label: "Link Scanner" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/categories", label: "Threats" },
  { to: "/reports", label: "Reports" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary glow-ring">
            <ShieldCheck className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Threat<span className="text-gradient">Guard</span> AI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-secondary/60" }}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/email-scanner"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 glow-ring"
          >
            Start Free Scan
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background/95 px-4 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
