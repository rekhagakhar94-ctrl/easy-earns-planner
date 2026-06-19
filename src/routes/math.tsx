import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Grid3x3, Receipt } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CalculateButton, Card, EmptyHint, Field, SectionLabel, TextInput, allNum, numOr, type N } from "@/components/calc-ui";
import { margin, percentChange, valueOfPct } from "@/lib/finance";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/math")({
  head: () => ({ meta: [{ title: "Percentage & Math Tools" }] }),
  component: Page,
});

function setNum(setter: (v: N) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") return setter("");
    const n = Number(raw);
    if (!Number.isNaN(n)) setter(n);
  };
}

function Page() {
  const { format } = useApp();
  // % change
  const [pcA, setPcA] = useState<N>("");
  const [pcB, setPcB] = useState<N>("");
  const [shownChg, setShownChg] = useState(false);
  useEffect(() => { setShownChg(false); }, [pcA, pcB]);
  const readyChg = allNum(pcA, pcB);
  const change = useMemo(() => (readyChg ? percentChange(numOr(pcA), numOr(pcB)) : 0), [readyChg, pcA, pcB]);

  // value of %
  const [pct, setPct] = useState<N>("");
  const [tot, setTot] = useState<N>("");
  const [shownVof, setShownVof] = useState(false);
  useEffect(() => { setShownVof(false); }, [pct, tot]);
  const readyVof = allNum(pct, tot);
  const vof = useMemo(() => (readyVof ? valueOfPct(numOr(pct), numOr(tot)) : 0), [readyVof, pct, tot]);

  // margin
  const [cost, setCost] = useState<N>("");
  const [sell, setSell] = useState<N>("");
  const [shownM, setShownM] = useState(false);
  useEffect(() => { setShownM(false); }, [cost, sell]);
  const readyM = allNum(cost, sell);
  const m = useMemo(() => (readyM ? margin(numOr(cost), numOr(sell)) : null), [readyM, cost, sell]);

  return (
    <AppShell>
      <PageHeader label="MATH TOOLS" title="Percentage & Math" />

      <Card className="mb-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Percentage Change</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Initial Value"><TextInput type="number" inputMode="decimal" value={pcA === "" ? "" : pcA} onChange={setNum(setPcA)} /></Field>
          <Field label="Final Value"><TextInput type="number" inputMode="decimal" value={pcB === "" ? "" : pcB} onChange={setNum(setPcB)} /></Field>
        </div>
        <div className="mt-4">
          <CalculateButton disabled={!readyChg} onClick={() => setShownChg(true)} />
        </div>
        {shownChg && readyChg ? (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">Result</span>
            <span className={`num-display text-2xl ${change >= 0 ? "text-primary" : "text-destructive"}`}>
              {change >= 0 ? "+" : ""}{change.toFixed(2)}%
            </span>
          </div>
        ) : (
          <p className="mt-3 text-center text-xs text-muted-foreground">Enter both values and tap Calculate.</p>
        )}
      </Card>

      <Card className="mb-4">
        <div className="mb-3 flex items-center gap-2">
          <Grid3x3 className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Value of %</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Percentage"><TextInput type="number" inputMode="decimal" value={pct === "" ? "" : pct} onChange={setNum(setPct)} /></Field>
          <Field label="Total Amount"><TextInput type="number" inputMode="decimal" value={tot === "" ? "" : tot} onChange={setNum(setTot)} /></Field>
        </div>
        <div className="mt-4">
          <CalculateButton disabled={!readyVof} onClick={() => setShownVof(true)} />
        </div>
        {shownVof && readyVof ? (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">Result</span>
            <span className="num-display text-2xl text-primary">{vof.toFixed(2)}</span>
          </div>
        ) : (
          <p className="mt-3 text-center text-xs text-muted-foreground">Enter both values and tap Calculate.</p>
        )}
      </Card>

      <SectionLabel>Business Math</SectionLabel>
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Receipt className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Margin Calculator</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cost Price"><TextInput type="number" inputMode="decimal" value={cost === "" ? "" : cost} onChange={setNum(setCost)} /></Field>
          <Field label="Selling Price"><TextInput type="number" inputMode="decimal" value={sell === "" ? "" : sell} onChange={setNum(setSell)} /></Field>
        </div>
        <div className="mt-4">
          <CalculateButton disabled={!readyM} onClick={() => setShownM(true)} />
        </div>
        {shownM && m ? (
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
            <Stat label="Profit" value={format(m.profit)} />
            <Stat label="Margin" value={`${m.marginPct.toFixed(1)}%`} />
            <Stat label="Markup" value={`${m.markupPct.toFixed(1)}%`} />
          </div>
        ) : (
          <div className="mt-3"><EmptyHint>Enter cost and selling price, then tap Calculate.</EmptyHint></div>
        )}
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
