import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, Field, TextInput } from "@/components/calc-ui";
import { compoundInterest } from "@/lib/finance";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/compound")({
  head: () => ({ meta: [{ title: "Compound Interest — Wealth Growth" }] }),
  component: Page,
});

const FREQ = [
  { label: "Annually", value: 1 },
  { label: "Semi-Annual", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

function Page() {
  const { format, addHistory, symbol } = useApp();
  const [p, setP] = useState(50000);
  const [r, setR] = useState(8.5);
  const [t, setT] = useState(10);
  const [freq, setFreq] = useState(1);
  const [add, setAdd] = useState(500);

  const result = useMemo(() => compoundInterest(p, r, t, freq, add), [p, r, t, freq, add]);

  return (
    <AppShell>
      <PageHeader title="Compound Interest" subtitle="Wealth Growth Calculator" />

      <div className="space-y-5">
        <Card>
          <Field label="Principal Amount" hint={format(p, { decimals: 0 })}>
            <TextInput type="number" value={p} onChange={(e) => setP(Number(e.target.value) || 0)} />
          </Field>
        </Card>
        <Card>
          <Field label="Interest Rate (p.a %)" hint={`${r}%`}>
            <TextInput type="number" step="0.1" value={r} onChange={(e) => setR(Number(e.target.value) || 0)} />
          </Field>
        </Card>
        <Card>
          <Field label="Period" hint={`${t} Years`}>
            <div className="flex gap-3">
              <TextInput type="number" value={t} onChange={(e) => setT(Number(e.target.value) || 0)} />
              <select
                value={freq}
                onChange={(e) => setFreq(Number(e.target.value))}
                className="rounded-xl border border-border bg-surface-2/50 px-3 py-3 text-sm outline-none focus:border-primary"
              >
                {FREQ.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </Field>
        </Card>
        <Card>
          <Field label="Monthly Addition" hint={`${symbol}${add}`}>
            <TextInput type="number" value={add} onChange={(e) => setAdd(Number(e.target.value) || 0)} />
          </Field>
        </Card>

        <button
          onClick={() =>
            addHistory({
              type: "compound",
              title: "Compound Interest",
              summary: `Principal: ${format(p, { decimals: 0 })} • ${r}% • ${t}yrs`,
              value: result.total,
            })
          }
          className="primary-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          <TrendingUp className="size-4" /> Calculate Growth
        </button>

        <Card className="border-primary/40">
          <p className="text-center text-sm text-muted-foreground">Estimated Total Value</p>
          <p className="num-display mt-1 text-center text-4xl text-primary">{format(result.total)}</p>
          <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total Principal</span><span className="font-semibold">{format(result.totalPrincipal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Interest</span><span className="font-semibold">{format(result.totalInterest)}</span></div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
