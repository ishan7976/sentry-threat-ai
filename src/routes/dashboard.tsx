import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FileSearch,
  LayoutDashboard,
  Link2,
  ListChecks,
  ShieldAlert,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";

import { RiskBadge } from "@/components/risk-visuals";
import { stats, useScanLogs } from "@/lib/scan-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "AI Threat Dashboard — ThreatGuard AI" },
      {
        name: "description",
        content:
          "Monitor scanned emails, detected threats, risk distribution and the latest threat logs in one security dashboard.",
      },
      { property: "og:title", content: "AI Threat Dashboard — ThreatGuard AI" },
      {
        property: "og:description",
        content: "Threat analytics, risk distribution and recent detection logs.",
      },
    ],
  }),
  component: Dashboard,
});

const trend = [
  { day: "Mon", threats: 42, safe: 180 },
  { day: "Tue", threats: 58, safe: 205 },
  { day: "Wed", threats: 37, safe: 224 },
  { day: "Thu", threats: 74, safe: 198 },
  { day: "Fri", threats: 91, safe: 240 },
  { day: "Sat", threats: 33, safe: 121 },
  { day: "Sun", threats: 26, safe: 108 },
];

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/email-scanner", label: "Email Scanner", icon: FileSearch },
  { to: "/link-scanner", label: "Link Scanner", icon: Link2 },
  { to: "/reports", label: "Reports", icon: ListChecks },
] as const;

function Dashboard() {
  const logs = useScanLogs();
  const s = stats(logs);

  const categoryData = Object.entries(
    logs.reduce<Record<string, number>>((acc, l) => {
      acc[l.category] = (acc[l.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const riskData = [
    { name: "Low risk", value: s.low, color: "var(--safe)" },
    { name: "Medium risk", value: s.medium, color: "var(--warn)" },
    { name: "High risk", value: s.high, color: "var(--danger)" },
  ];

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-12 sm:px-6">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="glass sticky top-24 rounded-2xl p-3">
          <p className="px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">
            Security console
          </p>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "bg-secondary text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-secondary/60" }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header>
          <h1 className="font-display text-4xl font-bold tracking-tight">AI Threat Dashboard</h1>
          <p className="mt-3 text-muted-foreground">
            Live overview of everything ThreatGuard has analyzed in this session.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total emails scanned" value={s.emails} icon={FileSearch} tone="text-primary" />
          <Stat label="Threats detected" value={s.threats} icon={ShieldAlert} tone="text-warn" />
          <Stat label="Safe items" value={s.safe} icon={ShieldCheck} tone="text-safe" />
          <Stat label="Blocked threats" value={s.blocked} icon={ShieldBan} tone="text-danger" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-base font-semibold">Threat detection analytics</h2>
            <p className="text-xs text-muted-foreground">Scans processed over the last 7 days</p>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="gThreat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--danger)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--danger)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gSafe" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="safe" stroke="var(--primary)" fill="url(#gSafe)" strokeWidth={2} />
                  <Area type="monotone" dataKey="threats" stroke="var(--danger)" fill="url(#gThreat)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-base font-semibold">Risk distribution</h2>
            <p className="text-xs text-muted-foreground">Session scans by risk level</p>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {riskData.map((d) => (
                      <Cell key={d.name} fill={d.color} stroke="var(--background)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass mt-6 rounded-2xl p-6">
          <h2 className="font-display text-base font-semibold">Detections by category</h2>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-12} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--secondary)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="value" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass mt-6 overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="font-display text-base font-semibold">Recent threat logs</h2>
            <Link to="/reports" className="text-xs text-accent underline-offset-4 hover:underline">
              Open reports
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-y border-border bg-secondary/40 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Sender</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Score</th>
                  <th className="px-6 py-3 font-medium">Risk</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 10).map((l) => (
                  <tr key={l.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30">
                    <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">
                      {new Date(l.date).toLocaleDateString()}
                    </td>
                    <td className="max-w-[220px] truncate px-6 py-3 font-mono text-xs">{l.sender}</td>
                    <td className="whitespace-nowrap px-6 py-3">{l.category}</td>
                    <td className="px-6 py-3 font-mono">{l.score}</td>
                    <td className="px-6 py-3"><RiskBadge risk={l.risk} /></td>
                    <td className="max-w-[240px] truncate px-6 py-3 text-muted-foreground">{l.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof FileSearch;
  tone: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 transition-transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className={`size-4 ${tone}`} />
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}
