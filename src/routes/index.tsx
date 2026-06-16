import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Landmark, Scale, Percent, TrendingUp, Wallet, PiggyBank,
  Receipt, Calculator, User,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinCalc Pro — Premium Financial Calculators" },
      { name: "description", content: "EMI, SIP, FD, GST, compound interest and more. Beautifully designed financial calculators." },
    ],
  }),
  component: Home,
});

const SECTIONS = [
  {
    label: "Loans & Debt",
    color: "text-primary",
    items: [
      { to: "/emi", title: "EMI", desc: "Monthly Repayments", icon: Landmark },
      { to: "/compare", title: "Compare", desc: "Loan Side-by-Side", icon: Scale },
      { to: "/simple", title: "Simple Int", desc: "Direct Interest", icon: Percent },
      { to: "/compound", title: "Compound", desc: "Growth Over Time", icon: TrendingUp },
    ],
  },
  {
    label: "Wealth & Savings",
    color: "text-emerald-400",
    items: [
      { to: "/sip", title: "SIP Planner", desc: "Systematic Invest", icon: PiggyBank },
      { to: "/fd", title: "FD / RD", desc: "Fixed Deposits", icon: Wallet },
    ],
  },
  {
    label: "Tax & Math",
    color: "text-amber-400",
    items: [
      { to: "/gst", title: "GST", desc: "Tax Inclusive/Excl", icon: Receipt },
      { to: "/math", title: "Math Tools", desc: "Percent & Margin", icon: Calculator },
    ],
  },
] as const;

function Home() {
  const { history, format } = useApp();
  const latest = history[0];

  return (
    <AppShell>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <p className="section-label">FINCALC</p>
          <h1 className="text-3xl font-bold tracking-tight">Premium Suite</h1>
        </div>
        <Link
          to="/settings"
          className="inline-flex size-11 items-center justify-center rounded-full bg-surface text-foreground hover:bg-surface-2"
        >
          <User className="size-5" />
        </Link>
      </header>

      <div className="hero-gradient relative mb-8 overflow-hidden rounded-3xl p-5 shadow-[var(--shadow-glow)]">
        <p className="text-xs font-medium text-white/80">
          {latest ? "Recent Calculation" : "Welcome back"}
        </p>
        <p className="num-display mt-2 text-3xl text-white">
          {latest ? `${latest.title}: ${format(latest.value)}` : "Pick a tool below"}
        </p>
        <p className="mt-1 text-sm text-white/85">
          {latest?.summary ?? "Beautiful, accurate, and fast."}
        </p>
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="space-y-7">
        {SECTIONS.map((sec) => (
          <section key={sec.label}>
            <div className="mb-3 flex items-center gap-2">
              <span className={`inline-block h-px w-4 ${sec.color === "text-primary" ? "bg-primary" : sec.color === "text-emerald-400" ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className={`text-[0.7rem] font-bold uppercase tracking-[0.12em] ${sec.color}`}>
                {sec.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sec.items.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    className="group glass-card flex flex-col gap-3 p-4 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-glow)]"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-2 text-primary group-hover:bg-primary/20">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-base font-semibold">{it.title}</p>
                      <p className="text-xs text-muted-foreground">{it.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
