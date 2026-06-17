import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Currency =
  | "USD" | "EUR" | "GBP" | "INR" | "JPY"
  | "AUD" | "CAD" | "CHF" | "CNY" | "HKD"
  | "SGD" | "NZD" | "AED" | "SAR" | "ZAR"
  | "BRL" | "MXN" | "RUB" | "KRW" | "TRY"
  | "SEK" | "NOK" | "DKK" | "PLN" | "THB"
  | "IDR" | "MYR" | "PHP" | "VND" | "PKR"
  | "BDT" | "LKR" | "NGN" | "EGP" | "ILS";
export type NumberFormat = "en-US" | "de-DE" | "en-IN" | "fr-FR";

const SYMBOLS: Record<Currency, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥",
  AUD: "A$", CAD: "C$", CHF: "Fr", CNY: "¥", HKD: "HK$",
  SGD: "S$", NZD: "NZ$", AED: "د.إ", SAR: "﷼", ZAR: "R",
  BRL: "R$", MXN: "Mex$", RUB: "₽", KRW: "₩", TRY: "₺",
  SEK: "kr", NOK: "kr", DKK: "kr", PLN: "zł", THB: "฿",
  IDR: "Rp", MYR: "RM", PHP: "₱", VND: "₫", PKR: "₨",
  BDT: "৳", LKR: "Rs", NGN: "₦", EGP: "E£", ILS: "₪",
};

const DEFAULT_LOCALE: Record<Currency, NumberFormat> = {
  USD: "en-US", EUR: "de-DE", GBP: "en-US", INR: "en-IN", JPY: "en-US",
  AUD: "en-US", CAD: "en-US", CHF: "de-DE", CNY: "en-US", HKD: "en-US",
  SGD: "en-US", NZD: "en-US", AED: "en-US", SAR: "en-US", ZAR: "en-US",
  BRL: "de-DE", MXN: "en-US", RUB: "de-DE", KRW: "en-US", TRY: "de-DE",
  SEK: "fr-FR", NOK: "fr-FR", DKK: "de-DE", PLN: "de-DE", THB: "en-US",
  IDR: "de-DE", MYR: "en-US", PHP: "en-US", VND: "de-DE", PKR: "en-IN",
  BDT: "en-IN", LKR: "en-IN", NGN: "en-US", EGP: "en-US", ILS: "en-US",
};

export const NUMBER_FORMAT_OPTIONS: { value: NumberFormat | "auto"; label: string; sample: string }[] = [
  { value: "auto", label: "Auto (by currency)", sample: "1,234,567.89" },
  { value: "en-US", label: "US / UK", sample: "1,234,567.89" },
  { value: "de-DE", label: "European", sample: "1.234.567,89" },
  { value: "fr-FR", label: "French", sample: "1 234 567,89" },
  { value: "en-IN", label: "Indian", sample: "12,34,567.89" },
];

export interface HistoryEntry {
  id: string;
  type: string;
  title: string;
  summary: string;
  value: number;
  meta?: string;
  createdAt: number;
}

interface Settings {
  currency: Currency;
  tactile: boolean;
  darkMode: boolean;
  numberFormat: NumberFormat | "auto";
}

interface Ctx {
  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
  history: HistoryEntry[];
  addHistory: (e: Omit<HistoryEntry, "id" | "createdAt">) => void;
  clearHistory: () => void;
  removeHistory: (id: string) => void;
  format: (n: number, opts?: { decimals?: number }) => string;
  symbol: string;
}

const AppCtx = createContext<Ctx | null>(null);

const SETTINGS_KEY = "fincalc.settings";
const HISTORY_KEY = "fincalc.history";

const DEFAULTS: Settings = {
  currency: "USD",
  tactile: true,
  darkMode: true,
  numberFormat: "auto",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(DEFAULTS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) setSettingsState({ ...DEFAULTS, ...JSON.parse(s) });
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h));
    } catch {}
  }, []);

  // Apply dark/light class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [settings.darkMode]);

  const setSettings = (patch: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const persistHistory = (h: HistoryEntry[]) => {
    setHistory(h);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch {}
  };

  const addHistory: Ctx["addHistory"] = (e) => {
    const entry: HistoryEntry = { ...e, id: crypto.randomUUID(), createdAt: Date.now() };
    persistHistory([entry, ...history].slice(0, 200));
    if (settings.tactile && "vibrate" in navigator) {
      try { navigator.vibrate?.(10); } catch {}
    }
  };

  const clearHistory = useCallback(() => persistHistory([]), [history]);
  const removeHistory = useCallback((id: string) => persistHistory(history.filter((x) => x.id !== id)), [history]);

  const activeLocale: string =
    settings.numberFormat === "auto" ? DEFAULT_LOCALE[settings.currency] : settings.numberFormat;

  const formatters = useMemo(() => {
    const cache = new Map<number, Intl.NumberFormat>();
    return (decimals: number) => {
      let f = cache.get(decimals);
      if (!f) {
        f = new Intl.NumberFormat(activeLocale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        cache.set(decimals, f);
      }
      return f;
    };
  }, [activeLocale]);

  const format = useCallback(
    (n: number, opts?: { decimals?: number }) => {
      const decimals = opts?.decimals ?? 2;
      const value = isFinite(n) ? n : 0;
      return `${SYMBOLS[settings.currency]}${formatters(decimals).format(value)}`;
    },
    [formatters, settings.currency]
  );

  const ctxValue = useMemo<Ctx>(
    () => ({
      settings,
      setSettings,
      history,
      addHistory,
      clearHistory,
      removeHistory,
      format,
      symbol: SYMBOLS[settings.currency],
    }),
    [settings, history, format, clearHistory, removeHistory]
  );

  return <AppCtx.Provider value={ctxValue}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
