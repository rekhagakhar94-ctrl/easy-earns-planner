import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TrendingUp, Grid3x3, Receipt } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, Field, SectionLabel, TextInput } from "@/components/calc-ui";
import { margin, percentChange, valueOfPct } from "@/lib/finance";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/math")({
  head: () => ({ meta: [{ title: "Percentage & Math Tools" }] }),
  component: Page,
});

function Page() {
  const { format } = useApp();
  const [pcA, setPcA] = useState(80);
  const [pcB, setPcB] = useState(100);
  const change = useMemo(() => percentChange(pcA, pcB), [pcA, pcB]);

  const [pct, setPct] = useState(15);
  const [tot, setTot] = useState(1000);
  const vof = useMemo(() => valueOfPct(pct, tot), [pct, tot]);

  const [cost, setCost] = useState(450);
  const [sell, setSell] = useState(600);
  const m = useMemo(() => margin(cost, sell), [cost, sell]);

  return (
    <AppShell>
      <PageHeader label="MATH TOOLS" title="Percentage & Math" />

      <Card className="mb-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Percentage Change</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Initial Value"><TextInput type="number" value={pcA} onChange={(e) => setPcA(Number(e.target.value) || 0)} /></Field>
          <Field label="Final Value"><TextInput type="number" value={pcB} onChange={(e) => setPcB(Number(e.target.value) || 0)} /></Field>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Result</span>
          <span className={`num-display text-2xl ${change >= 0 ? "text-primary" : "text-destructive"}`}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)}%
          </span>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="mb-3 flex items-center gap-2">
          <Grid3x3 className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Value of %</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Percentage"><TextInput type="number" value={pct} onChange={(e) => setPct(Number(e.target.value) || 0)} /></Field>
          <Field label="Total Amount"><TextInput type="number" value={tot} onChange={(e) => setTot(Number(e.target.value) || 0)} /></Field>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Result</span>
          <span className="num-display text-2xl text-primary">{vof.toFixed(2)}</span>
        </div>
      </Card>

      <SectionLabel>Business Math</SectionLabel>
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Receipt className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Margin Calculator</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cost Price"><TextInput type="number" value={cost} onChange={(e) => setCost(Number(e.target.value) || 0)} /></Field>
          <Field label="Selling Price"><TextInput type="number" value={sell} onChange={(e) => setSell(Number(e.target.value) || 0)} /></Field>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
          <Stat label="Profit" value={format(m.profit)} />
          <Stat label="Margin" value={`${m.marginPct.toFixed(1)}%`} />
          <Stat label="Markup" value={`${m.markupPct.toFixed(1)}%`} />
        </div>
      </Card>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="num-display mt-1 text-sm text-primary">{value}</p>
    </div>
  );
}
