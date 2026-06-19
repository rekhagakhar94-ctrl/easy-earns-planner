import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CalculateButton, Card, EmptyHint, Field, TextInput, allNum, numOr, type N } from "@/components/calc-ui";
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

function setNum(setter: (v: N) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") return setter("");
    const n = Number(raw);
    if (!Number.isNaN(n)) setter(n);
  };
}

function Page() {
  const { format, addHistory, symbol } = useApp();
  const [p, setP] = useState<N>("");
  const [r, setR] = useState<N>("");
  const [t, setT] = useState<N>("");
  const [freq, setFreq] = useState(1);
  const [add, setAdd] = useState<N>("");
  const [shown, setShown] = useState(false);

  useEffect(() => { setShown(false); }, [p, r, t, freq, add]);
  const ready = allNum(p, r, t); // monthly addition optional

  const result = useMemo(
    () => (ready ? compoundInterest(numOr(p), numOr(r), numOr(t), freq, numOr(add)) : null),
    [ready, p, r, t, freq, add],
  );
  const calculated = shown && result !== null;

  return (
    <AppShell>
      <PageHeader title="Compound Interest" subtitle="Wealth Growth Calculator" />

      <div className="space-y-5">
        <Card>
          <Field label="Principal Amount" hint={p !== "" ? format(p, { decimals: 0 }) : ""}>
            <TextInput type="number" inputMode="decimal" placeholder="0" value={p === "" ? "" : p} onChange={setNum(setP)} />
          </Field>
        </Card>
        <Card>
          <Field label="Interest Rate (p.a %)" hint={r !== "" ? `${r}%` : ""}>
            <TextInput type="number" inputMode="decimal" step="0.1" placeholder="0" value={r === "" ? "" : r} onChange={setNum(setR)} />
          </Field>
        </Card>
        <Card>
          <Field label="Period" hint={t !== "" ? `${t} Years` : ""}>
            <div className="flex gap-3">
              <TextInput type="number" inputMode="decimal" placeholder="0" value={t === "" ? "" : t} onChange={setNum(setT)} />
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
          <Field label="Monthly Addition (optional)" hint={add !== "" ? `${symbol}${add}` : ""}>
            <TextInput type="number" inputMode="decimal" placeholder="0" value={add === "" ? "" : add} onChange={setNum(setAdd)} />
          </Field>
        </Card>

        <CalculateButton
          disabled={!ready}
          onClick={() => {
            setShown(true);
            if (!ready || !result) return;
            addHistory({
              type: "compound",
              title: "Compound Interest",
              summary: `Principal: ${format(numOr(p), { decimals: 0 })} • ${numOr(r)}% • ${numOr(t)}yrs`,
              value: result.total,
            });
          }}
          label="Calculate Growth"
        />

        {!calculated ? (
          <EmptyHint>{ready ? "Tap Calculate Growth." : "Enter principal, rate and period, then tap Calculate."}</EmptyHint>
        ) : (
          <Card className="border-primary/40">
            <p className="text-center text-sm text-muted-foreground inline-flex items-center justify-center gap-2 w-full">
              <TrendingUp className="size-4" /> Estimated Total Value
            </p>
            <p className="num-display mt-1 text-center text-4xl text-primary">{format(result!.total)}</p>
            <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Principal</span><span className="font-semibold">{format(result!.totalPrincipal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Interest</span><span className="font-semibold">{format(result!.totalInterest)}</span></div>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
