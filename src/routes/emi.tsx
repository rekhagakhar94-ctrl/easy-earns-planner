import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Info, Calendar } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, Field, ResultPanel, SectionLabel, Slider } from "@/components/calc-ui";
import { emi } from "@/lib/finance";
import { useApp } from "@/lib/store";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/emi")({
  head: () => ({ meta: [{ title: "EMI Calculator — Loan Analysis" }] }),
  component: EmiPage,
});

function EmiPage() {
  const { format, addHistory } = useApp();
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);

  const result = useMemo(() => emi(amount, rate, years), [amount, rate, years]);

  const data = [
    { name: "Principal", value: amount, color: "var(--primary)" },
    { name: "Interest", value: result.totalInterest, color: "var(--warning)" },
  ];
  const principalPct = (amount / result.totalPayable) * 100;
  const interestPct = 100 - principalPct;

  return (
    <AppShell>
      <PageHeader label="EMI Calculator" title="Loan Analysis" right={<Info className="mt-2 size-5 text-muted-foreground" />} />

      <ResultPanel
        label="Monthly Repayment"
        value={format(result.monthly)}
        sub={
          <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-3 text-left">
            <div>
              <p className="text-xs opacity-75">Total Interest</p>
              <p className="num-display text-lg">{format(result.totalInterest)}</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Total Payable</p>
              <p className="num-display text-lg">{format(result.totalPayable)}</p>
            </div>
          </div>
        }
      />

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

      <div className="mt-6 space-y-5">
        <SectionLabel>Loan Parameters</SectionLabel>

        <Card>
          <Field label="Loan Amount" hint={format(amount, { decimals: 0 })}>
            <Slider value={amount} min={1000} max={1000000} step={1000} onChange={setAmount} />
          </Field>
        </Card>
        <Card>
          <Field label="Interest Rate (p.a)" hint={`${rate}%`}>
            <Slider value={rate} min={1} max={20} step={0.1} onChange={setRate} />
          </Field>
        </Card>
        <Card>
          <Field label="Loan Tenure" hint={`${years} Years`}>
            <Slider value={years} min={1} max={30} onChange={setYears} />
          </Field>
        </Card>

        <button
          onClick={() =>
            addHistory({
              type: "emi",
              title: "Home Loan EMI",
              summary: `Principal: ${format(amount, { decimals: 0 })} • ${rate}%`,
              value: result.monthly,
            })
          }
          className="primary-gradient w-full rounded-2xl py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Save to History
        </button>
      </div>
    </AppShell>
  );
}
