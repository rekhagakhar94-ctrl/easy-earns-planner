import { useApp, type Currency } from "@/lib/store";

const OPTIONS: { code: Currency; label: string; symbol: string }[] = [
  { code: "USD", label: "USD", symbol: "$" },
  { code: "EUR", label: "EUR", symbol: "€" },
  { code: "GBP", label: "GBP", symbol: "£" },
  { code: "INR", label: "INR", symbol: "₹" },
  { code: "JPY", label: "JPY", symbol: "¥" },
];

export function CurrencySwitcher({ compact = false }: { compact?: boolean }) {
  const { settings, setSettings } = useApp();
  const current = OPTIONS.find((o) => o.code === settings.currency)!;
  return (
    <label
      className={`relative inline-flex items-center gap-1.5 rounded-full bg-surface px-3 ${
        compact ? "py-1.5 text-xs" : "py-2 text-sm"
      } font-semibold text-foreground hover:bg-surface-2`}
      title="Change currency"
    >
      <span className="text-primary">{current.symbol}</span>
      <span>{current.label}</span>
      <svg viewBox="0 0 20 20" className="size-3 text-muted-foreground" fill="currentColor">
        <path d="M5 8l5 5 5-5H5z" />
      </svg>
      <select
        value={settings.currency}
        onChange={(e) => setSettings({ currency: e.target.value as Currency })}
        className="absolute inset-0 cursor-pointer opacity-0"
        style={{ colorScheme: "dark" }}
        aria-label="Currency"
      >
        {OPTIONS.map((o) => (
          <option key={o.code} value={o.code} style={{ background: "#1a1d2e", color: "#fff" }}>
            {o.symbol} {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
