import { createFileRoute, Link } from "@tanstack/react-router";
import { X, DollarSign, Hash, Moon, Vibrate, History } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp, type Currency, type NumberFormat, NUMBER_FORMAT_OPTIONS } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — FinCalc Pro" }] }),
  component: Page,
});

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
  { code: "CAD", label: "Canadian Dollar (C$)" },
  { code: "CHF", label: "Swiss Franc (Fr)" },
  { code: "CNY", label: "Chinese Yuan (¥)" },
  { code: "HKD", label: "Hong Kong Dollar (HK$)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "NZD", label: "New Zealand Dollar (NZ$)" },
  { code: "AED", label: "UAE Dirham (د.إ)" },
  { code: "SAR", label: "Saudi Riyal (﷼)" },
  { code: "ZAR", label: "South African Rand (R)" },
  { code: "BRL", label: "Brazilian Real (R$)" },
  { code: "MXN", label: "Mexican Peso (Mex$)" },
  { code: "RUB", label: "Russian Ruble (₽)" },
  { code: "KRW", label: "South Korean Won (₩)" },
  { code: "TRY", label: "Turkish Lira (₺)" },
  { code: "SEK", label: "Swedish Krona (kr)" },
  { code: "NOK", label: "Norwegian Krone (kr)" },
  { code: "DKK", label: "Danish Krone (kr)" },
  { code: "PLN", label: "Polish Zloty (zł)" },
  { code: "THB", label: "Thai Baht (฿)" },
  { code: "IDR", label: "Indonesian Rupiah (Rp)" },
  { code: "MYR", label: "Malaysian Ringgit (RM)" },
  { code: "PHP", label: "Philippine Peso (₱)" },
  { code: "VND", label: "Vietnamese Dong (₫)" },
  { code: "PKR", label: "Pakistani Rupee (₨)" },
  { code: "BDT", label: "Bangladeshi Taka (৳)" },
  { code: "LKR", label: "Sri Lankan Rupee (Rs)" },
  { code: "NGN", label: "Nigerian Naira (₦)" },
  { code: "EGP", label: "Egyptian Pound (E£)" },
  { code: "ILS", label: "Israeli Shekel (₪)" },
];

function Page() {
  const { settings, setSettings, clearHistory, format } = useApp();
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
        <StackedRow
          icon={<DollarSign className="size-5" />}
          title="Base Currency"
          sub="Used for loan and investment results"
        >
          <NativeSelect
            value={settings.currency}
            onChange={(v) => setSettings({ currency: v as Currency })}
            options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
          />
        </StackedRow>

        <StackedRow
          icon={<Hash className="size-5" />}
          title="Number Format"
          sub={`Preview: ${format(1234567.89)}`}
        >
          <NativeSelect
            value={settings.numberFormat}
            onChange={(v) => setSettings({ numberFormat: v as NumberFormat | "auto" })}
            options={NUMBER_FORMAT_OPTIONS.map((o) => ({ value: o.value, label: `${o.label} — ${o.sample}` }))}
          />
        </StackedRow>
      </Section>

      <Section title="Appearance">
        <Row icon={<Moon className="size-5" />} title="Dark Mode" sub="Switch between light and dark theme">
          <Toggle on={settings.darkMode} onChange={(v) => setSettings({ darkMode: v })} />
        </Row>
        <Row icon={<Vibrate className="size-5" />} title="Tactile Feedback" sub="Vibrate on button press">
          <Toggle on={settings.tactile} onChange={(v) => setSettings({ tactile: v })} />
        </Row>
      </Section>

      <Section title="Data">
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
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{title}</p>
        {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function StackedRow({ icon, title, sub, children }: { icon: React.ReactNode; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-2 text-primary">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold">{title}</p>
          {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function NativeSelect({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl bg-surface-2 px-3 py-2.5 pr-9 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary"
        style={{ colorScheme: "dark" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#1a1d2e", color: "#fff" }}>
            {o.label}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" fill="currentColor">
        <path d="M5 8l5 5 5-5H5z" />
      </svg>
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
