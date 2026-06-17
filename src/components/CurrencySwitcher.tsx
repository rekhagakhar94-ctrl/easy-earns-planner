import { useApp, type Currency } from "@/lib/store";

const OPTIONS: { code: Currency; label: string; symbol: string }[] = [
  { code: "USD", label: "USD", symbol: "$" },
  { code: "EUR", label: "EUR", symbol: "€" },
  { code: "GBP", label: "GBP", symbol: "£" },
  { code: "INR", label: "INR", symbol: "₹" },
  { code: "JPY", label: "JPY", symbol: "¥" },
  { code: "AUD", label: "AUD", symbol: "A$" },
  { code: "CAD", label: "CAD", symbol: "C$" },
  { code: "CHF", label: "CHF", symbol: "Fr" },
  { code: "CNY", label: "CNY", symbol: "¥" },
  { code: "HKD", label: "HKD", symbol: "HK$" },
  { code: "SGD", label: "SGD", symbol: "S$" },
  { code: "NZD", label: "NZD", symbol: "NZ$" },
  { code: "AED", label: "AED", symbol: "د.إ" },
  { code: "SAR", label: "SAR", symbol: "﷼" },
  { code: "ZAR", label: "ZAR", symbol: "R" },
  { code: "BRL", label: "BRL", symbol: "R$" },
  { code: "MXN", label: "MXN", symbol: "Mex$" },
  { code: "RUB", label: "RUB", symbol: "₽" },
  { code: "KRW", label: "KRW", symbol: "₩" },
  { code: "TRY", label: "TRY", symbol: "₺" },
  { code: "SEK", label: "SEK", symbol: "kr" },
  { code: "NOK", label: "NOK", symbol: "kr" },
  { code: "DKK", label: "DKK", symbol: "kr" },
  { code: "PLN", label: "PLN", symbol: "zł" },
  { code: "THB", label: "THB", symbol: "฿" },
  { code: "IDR", label: "IDR", symbol: "Rp" },
  { code: "MYR", label: "MYR", symbol: "RM" },
  { code: "PHP", label: "PHP", symbol: "₱" },
  { code: "VND", label: "VND", symbol: "₫" },
  { code: "PKR", label: "PKR", symbol: "₨" },
  { code: "BDT", label: "BDT", symbol: "৳" },
  { code: "LKR", label: "LKR", symbol: "Rs" },
  { code: "NGN", label: "NGN", symbol: "₦" },
  { code: "EGP", label: "EGP", symbol: "E£" },
  { code: "ILS", label: "ILS", symbol: "₪" },
];

export function CurrencySwitcher({ compact = false }: { compact?: boolean }) {
  const { settings, setSettings } = useApp();
  const current = OPTIONS.find((o) => o.code === settings.currency) ?? OPTIONS[0];
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
