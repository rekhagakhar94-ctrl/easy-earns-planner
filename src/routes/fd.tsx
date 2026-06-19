import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CalculateButton, Card, EmptyHint, Field, TextInput, allNum, numOr, type N } from "@/components/calc-ui";
import { fdMaturity } from "@/lib/finance";
import { useApp } from "@/lib/store";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/fd")({
  head: () => ({ meta: [{ title: "FD Calculator — Fixed Deposit" }] }),
  component: Page,
});

const FREQS = [
  { label: "Monthly", value: 12 },
  { label: "Quarterly", value: 4 },
  { label: "Half-Yearly", value: 2 },
  { label: "Annually", value: 1 },
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
  const { format, addHistory, settings } = useApp();
  const [p, setP] = useState<N>("");
  const [r, setR] = useState<N>("");
  const [t, setT] = useState<N>("");
  const [freq, setFreq] = useState(12);
  const [shown, setShown] = useState(false);

  useEffect(() => { setShown(false); }, [p, r, t, freq]);
  const ready = allNum(p, r, t);

  const result = useMemo(
    () => (ready ? fdMaturity(numOr(p), numOr(r), numOr(t), freq) : null),
    [ready, p, r, t, freq],
  );
  const calculated = shown && result !== null;
  const data = calculated
    ? [
        { name: "Deposit", value: numOr(p), color: "var(--primary)" },
        { name: "Interest", value: result!.interest, color: "var(--warning)" },
      ]
    : [];

  const reset = () => { setP(""); setR(""); setT(""); setFreq(12); setShown(false); };

  return (
    <AppShell>
      <PageHeader title="FD Calculator" subtitle="Fixed Deposit & Savings" right={
        <button onClick={reset} aria-label="Reset" className="mt-2 text-muted-foreground hover:text-foreground"><RotateCcw className="size-5" /></button>
      } />

      <div className="space-y-4">
        <Card>
          <Field label="Investment Amount">
            <div className="flex gap-2">
              <TextInput type="number" inputMode="decimal" value={p === "" ? "" : p} onChange={setNum(setP)} />
              <span className="inline-flex items-center rounded-xl bg-surface-2/60 px-3 text-xs font-semibold">{settings.currency}</span>
            </div>
          </Field>
        </Card>
        <Card>
          <Field label="Interest Rate (P.A)">
            <div className="flex gap-2">
              <TextInput type="number" inputMode="decimal" step="0.1" value={r === "" ? "" : r} onChange={setNum(setR)} />
              <span className="inline-flex items-center rounded-xl bg-surface-2/60 px-3 text-xs font-semibold">%</span>
            </div>
          </Field>
        </Card>
        <Card>
          <Field label="Tenure">
            <div className="flex gap-2">
              <TextInput type="number" inputMode="decimal" value={t === "" ? "" : t} onChange={setNum(setT)} />
              <span className="inline-flex items-center rounded-xl bg-surface-2/60 px-3 text-xs font-semibold">Yrs</span>
            </div>
          </Field>
        </Card>
        <Card>
          <Field label="Compounding Frequency">
            <select value={freq} onChange={(e) => setFreq(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-surface-2/50 px-4 py-3 text-sm outline-none focus:border-primary">
              {FREQS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </Field>
        </Card>

        <CalculateButton
          disabled={!ready}
          onClick={() => {
            setShown(true);
            if (!ready || !result) return;
            addHistory({
              type: "fd",
              title: "FD Maturity",
              summary: `Deposit: ${format(numOr(p), { decimals: 0 })} • ${numOr(r)}% • ${numOr(t)}yr`,
              value: result.total,
            });
          }}
        />

        {!calculated ? (
          <EmptyHint>{ready ? "Tap Calculate to see your maturity amount." : "Fill all fields, then tap Calculate."}</EmptyHint>
        ) : (
          <>
            <div className="primary-gradient rounded-2xl p-6 text-center text-primary-foreground shadow-[var(--shadow-glow)]">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Maturity Amount</p>
              <p className="num-display mt-2 text-4xl">{format(result!.total)}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/20 pt-3 text-left">
                <div><p className="text-xs opacity-75">Total Deposit</p><p className="num-display text-lg">{format(numOr(p))}</p></div>
                <div><p className="text-xs opacity-75">Interest Earned</p><p className="num-display text-lg">{format(result!.interest)}</p></div>
              </div>
            </div>

            <h2 className="pt-2 text-base font-semibold">Growth Analysis</h2>
            <Card>
              <div className="h-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={data} dataKey="value" innerRadius={48} outerRadius={78} stroke="none">
                      {data.map((d) => <Cell key={d.name} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
