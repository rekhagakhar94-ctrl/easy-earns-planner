import { createFileRoute, Link } from "@tanstack/react-router";
import { X, DollarSign, Hash, Moon, Vibrate, Fingerprint, History } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp, type Currency } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — FinCalc Pro" }] }),
  component: Page,
});

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "USD", label: "USD ($)" }, { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" }, { code: "INR", label: "INR (₹)" }, { code: "JPY", label: "JPY (¥)" },
];

function Page() {
  const { settings, setSettings, clearHistory } = useApp();
  return (
    <AppShell>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <p className="section-label">FINCALC PRO</p>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        <Link to="/" className="inline-flex size-10 items-center justify-center rounded-full bg-surface"><X className="size-4" /></Link>
      </header>

      <Section title="Regional">
        <Row icon={<DollarSign className="size-5" />} title="Base Currency" sub="Used for loan and investment results">
          <select
            value={settings.currency}
            onChange={(e) => setSettings({ currency: e.target.value as Currency })}
            className="rounded-lg bg-transparent text-sm font-semibold text-primary outline-none"
          >
            {CURRENCIES.map((c) => <option key={c.code} value={c.code} className="bg-surface text-foreground">{c.label}</option>)}
          </select>
        </Row>
        <Row icon={<Hash className="size-5" />} title="Number Format" sub="1,234,567.89">
          <span className="text-muted-foreground">›</span>
        </Row>
      </Section>

      <Section title="Appearance">
        <Row icon={<Moon className="size-5" />} title="Dark Mode" sub="Premium dark theme">
          <Toggle on />
        </Row>
        <Row icon={<Vibrate className="size-5" />} title="Tactile Feedback" sub="Vibrate on button press">
          <Toggle on={settings.tactile} onChange={(v) => setSettings({ tactile: v })} />
        </Row>
      </Section>

      <Section title="Security & Data">
        <Row icon={<Fingerprint className="size-5" />} title="Biometric Lock" sub="Secure your financial data">
          <Toggle on={settings.biometric} onChange={(v) => setSettings({ biometric: v })} />
        </Row>
        <Row icon={<History className="size-5" />} title="Clear History" sub="Delete all past calculations">
          <button onClick={clearHistory} className="text-sm font-semibold text-destructive">Clear</button>
        </Row>
      </Section>

      <p className="mt-8 text-center text-xs text-muted-foreground">FinCalc Pro v1.0.0</p>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-block h-px w-4 bg-primary" />
        <span className="section-label">{title}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ icon, title, sub, children }: { icon: React.ReactNode; title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="glass-card flex items-center gap-3 p-4">
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-2 text-primary">{icon}</span>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange?.(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "primary-gradient" : "bg-surface-2"}`}
    >
      <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${on ? "left-[1.4rem]" : "left-0.5"}`} />
    </button>
  );
}
