import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Info, Calendar } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CalculateButton, Card, EmptyHint, Field, NumberPill, ResultPanel, SectionLabel, Slider, allNum, numOr, type N } from "@/components/calc-ui";
import { emi } from "@/lib/finance";
import { useApp } from "@/lib/store";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/emi")({
  head: () => ({ meta: [{ title: "EMI Calculator — Loan Analysis" }] }),
  component: EmiPage,
});

function EmiPage() {
  const { format, addHistory, symbol } = useApp();
  const [amount, setAmount] = useState<N>("");
  const [rate, setRate] = useState<N>("");
  const [years, setYears] = useState<N>("");
  const [shown, setShown] = useState(false);

  useEffect(() => { setShown(false); }, [amount, rate, years]);
  const ready = allNum(amount, rate, years);

  const result = useMemo(
    () => (ready ? emi(numOr(amount), numOr(rate), numOr(years)) : null),
    [ready, amount, rate, years],
  );

  const calculated = shown && result !== null;
  const data = calculated
    ? [
        { name: "Principal", value: numOr(amount), color: "var(--primary)" },
        { name: "Interest", value: result!.totalInterest, color: "var(--warning)" },
      ]
    : [];
  const principalPct = calculated ? (numOr(amount) / result!.totalPayable) * 100 : 0;
  const interestPct = 100 - principalPct;

  return (
    <AppShell>
      <PageHeader label="EMI Calculator" title="Loan Analysis" right={<Info className="mt-2 size-5 text-muted-foreground" />} />

      <ResultPanel
        label="Monthly Repayment"
        value={calculated ? format(result!.monthly) : null}
        placeholder="—"
        sub={
          calculated && (
            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-3 text-left">
              <div>
                <p className="text-xs opacity-75">Total Interest</p>
                <p className="num-display text-lg">{format(result!.totalInterest)}</p>
              </div>
              <div>
                <p className="text-xs opacity-75">Total Payable</p>
                <p className="num-display text-lg">{format(result!.totalPayable)}</p>
              </div>
            </div>
          )
        }
      />

      {calculated && (
        <Card className="mt-4">
          <div className="flex items-center gap-3">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} dataKey="value" innerRadius={38} outerRadius={62} stroke="none">
                    {data.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-primary" />
                Principal: <span className="ml-auto font-semibold">{principalPct.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-sm" style={{ background: "var(--warning)" }} />
                Interest: <span className="ml-auto font-semibold">{interestPct.toFixed(0)}%</span>
              </div>
              <button
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-xs font-medium"
                onClick={() => alert("Amortization schedule coming up!")}
              >
                <Calendar className="size-3.5" /> Amortization
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 space-y-5">
        <SectionLabel>Loan Parameters</SectionLabel>

        <Card>
          <Field label="Loan Amount" hint={<NumberPill value={amount} onChange={setAmount} prefix={symbol} min={0} max={100000000} step={1000} />}>
            <Slider value={Math.min(numOr(amount), 1000000)} min={1000} max={1000000} step={1000} onChange={setAmount} />
          </Field>
        </Card>
        <Card>
          <Field label="Interest Rate (p.a)" hint={<NumberPill value={rate} onChange={setRate} suffix="%" min={0} max={50} step={0.1} />}>
            <Slider value={Math.min(numOr(rate), 20)} min={1} max={20} step={0.1} onChange={setRate} />
          </Field>
        </Card>
        <Card>
          <Field label="Loan Tenure" hint={<NumberPill value={years} onChange={setYears} suffix="Yrs" min={1} max={50} />}>
            <Slider value={Math.min(numOr(years), 30)} min={1} max={30} onChange={setYears} />
          </Field>
        </Card>

        <CalculateButton disabled={!ready} onClick={() => {
          setShown(true);
          if (!ready || !result) return;
          addHistory({
            type: "emi",
            title: "Home Loan EMI",
            summary: `Principal: ${format(numOr(amount), { decimals: 0 })} • ${numOr(rate)}%`,
            value: result.monthly,
          });
        }} />
        {!calculated && <EmptyHint>{ready ? "Tap Calculate to see your EMI." : "Enter loan amount, rate and tenure, then tap Calculate."}</EmptyHint>}
      </div>
    </AppShell>
  );
}
