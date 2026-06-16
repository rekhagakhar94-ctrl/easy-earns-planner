import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Trash2, SlidersHorizontal, Landmark, PiggyBank, Receipt, TrendingUp, Wallet, Scale, Calculator, Percent } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp, type HistoryEntry } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — FinCalc Pro" }] }),
  component: Page,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  emi: Landmark, sip: PiggyBank, gst: Receipt, compound: TrendingUp, fd: Wallet,
  compare: Scale, math: Calculator, simple: Percent,
};

function Page() {
  const { history, clearHistory, removeHistory, format } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => history.filter((h) => (h.title + h.summary).toLowerCase().includes(q.toLowerCase())),
    [history, q]
  );

  const groups = useMemo(() => {
    const today: HistoryEntry[] = [];
    const yesterday: HistoryEntry[] = [];
    const earlier: HistoryEntry[] = [];
    const now = new Date();
    const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const d1 = d0 - 86400000;
    filtered.forEach((e) => {
      if (e.createdAt >= d0) today.push(e);
      else if (e.createdAt >= d1) yesterday.push(e);
      else earlier.push(e);
    });
    return { today, yesterday, earlier };
  }, [filtered]);

  return (
    <AppShell>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="section-label">FINCALC PRO</p>
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-muted-foreground"><Search className="size-4" /></button>
          <button onClick={clearHistory} className="inline-flex size-10 items-center justify-center rounded-full bg-destructive/15 text-destructive"><Trash2 className="size-4" /></button>
        </div>
      </header>

      <div className="mb-6 flex gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface px-3 py-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search calculations..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button className="inline-flex size-11 items-center justify-center rounded-xl bg-surface text-muted-foreground">
          <SlidersHorizontal className="size-4" />
        </button>
      </div>

      {history.length === 0 && (
        <div className="glass-card p-10 text-center text-sm text-muted-foreground">
          No calculations yet. Start with any calculator and tap "Save to History".
        </div>
      )}

      <Group label="TODAY" items={groups.today} format={format} onDelete={removeHistory} />
      <Group label="YESTERDAY" items={groups.yesterday} format={format} onDelete={removeHistory} />
      <Group label="EARLIER" items={groups.earlier} format={format} onDelete={removeHistory} />
    </AppShell>
  );
}

function Group({ label, items, format, onDelete }: {
  label: string; items: HistoryEntry[]; format: (n: number) => string; onDelete: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mb-6">
      <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-amber-400">{label}</p>
      <div className="space-y-3">
        {items.map((e) => {
          const Icon = ICONS[e.type] ?? Calculator;
          return (
            <div key={e.id} className="glass-card flex items-center gap-3 p-4">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-surface-2 text-primary">
                <Icon className="size-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{e.title}</p>
                <p className="truncate text-xs text-muted-foreground">{e.summary}</p>
              </div>
              <div className="text-right">
                <p className="num-display text-sm text-primary">{format(e.value)}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(e.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <button onClick={() => onDelete(e.id)} className="ml-1 text-muted-foreground hover:text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
