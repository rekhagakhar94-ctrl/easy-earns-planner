import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, Field, NumberPill, ResultPanel, SectionLabel, Slider } from "@/components/calc-ui";
import { sip } from "@/lib/finance";
import { useApp } from "@/lib/store";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/sip")({
  head: () => ({ meta: [{ title: "SIP Calculator — Wealth Projection" }] }),
  component: Page,
});

function Page() {
  const { format, addHistory, symbol } = useApp();
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const r = useMemo(() => sip(monthly, rate, years), [monthly, rate, years]);

  const data = [
    { name: "Invested", value: r.invested, color: "var(--muted-foreground)" },
    { name: "Gains", value: r.gains, color: "var(--primary)" },
  ];

  return (
    <AppShell>
      <PageHeader label="SIP Calculator" title="Wealth Projection" right={<Info className="mt-2 size-5 text-muted-foreground" />} />

      <Card>
        <Field label="Monthly Investment" hint={<NumberPill value={monthly} onChange={setMonthly} prefix={symbol} min={0} max={10000000} step={50} />}>
          <Slider value={Math.min(monthly, 100000)} min={50} max={100000} step={50} onChange={setMonthly} />
        </Field>
      </Card>
      <div className="h-3" />
      <Card>
        <Field label="Expected Return (p.a)" hint={<NumberPill value={rate} onChange={setRate} suffix="%" min={0} max={50} step={0.1} />}>
          <Slider value={rate} min={1} max={30} step={0.5} onChange={setRate} />
        </Field>
      </Card>
      <div className="h-3" />
      <Card>
        <Field label="Time Period" hint={<NumberPill value={years} onChange={setYears} suffix="Yrs" min={1} max={60} />}>
          <Slider value={Math.min(years, 40)} min={1} max={40} onChange={setYears} />
        </Field>
        <div className="mt-5 flex justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">Total Investment</span>
          <span className="font-semibold">{format(r.invested)}</span>
        </div>
      </Card>

      <div className="mt-5">
        <SectionLabel>Wealth Breakdown</SectionLabel>
        <Card>
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
            <div className="flex-1 text-sm">
              <div className="flex items-center gap-2"><span className="size-3 rounded-sm" style={{ background: "var(--muted-foreground)" }} /> Invested</div>
              <div className="mt-1 flex items-center gap-2"><span className="size-3 rounded-sm bg-primary" /> Estimated Gains</div>
              <p className="num-display mt-3 text-2xl">{format(r.futureValue)}</p>
              <p className="text-xs font-medium text-emerald-400">Total Value</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-5">
        <SectionLabel>Projection Summary</SectionLabel>
        <Card>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Invested Amount</p><p className="num-display mt-1 text-lg">{format(r.invested)}</p></div>
            <div><p className="text-xs text-muted-foreground">Est. Returns</p><p className="num-display mt-1 text-lg text-emerald-400">{format(r.gains)}</p></div>
          </div>
        </Card>
      </div>

      <button onClick={() => addHistory({ type: "sip", title: "SIP Planner", summary: `${symbol}${monthly} • ${rate}% • ${years}yrs`, value: r.futureValue })}
        className="primary-gradient mt-6 w-full rounded-2xl py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
        Save Projection
      </button>
    </AppShell>
  );
}
