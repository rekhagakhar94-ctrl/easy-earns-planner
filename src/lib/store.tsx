import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Currency = "USD" | "EUR" | "GBP" | "INR" | "JPY";

const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
};

const LOCALES: Record<Currency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  INR: "en-IN",
  JPY: "ja-JP",
};

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
  biometric: boolean;
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>({
    currency: "USD",
    tactile: true,
    biometric: false,
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) setSettingsState({ ...{ currency: "USD", tactile: true, biometric: false }, ...JSON.parse(s) });
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h));
    } catch {}
  }, []);

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

  // Cache formatters: creating Intl.NumberFormat per call is expensive.
  const formatters = useMemo(() => {
    const cache = new Map<number, Intl.NumberFormat>();
    return (decimals: number) => {
      let f = cache.get(decimals);
      if (!f) {
        f = new Intl.NumberFormat(LOCALES[settings.currency], {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        cache.set(decimals, f);
      }
      return f;
    };
  }, [settings.currency]);

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
