import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, SectionLabel } from "@/components/calc-ui";
import { useApp } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [{ title: "Insights — FinCalc Pro" }] }),
  component: Page,
});

function Page() {
  const { history, format } = useApp();
  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    history.forEach((h) => { byType[h.type] = (byType[h.type] ?? 0) + 1; });
    const data = Object.entries(byType).map(([type, count]) => ({ type: type.toUpperCase(), count }));
    const totalValue = history.reduce((s, h) => s + h.value, 0);
    return { data, totalValue, count: history.length };
  }, [history]);

  return (
    <AppShell>
      <header className="mb-6">
        <p className="section-label">FINCALC PRO</p>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your activity at a glance.</p>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-muted-foreground">Calculations</p>
          <p className="num-display mt-1 text-3xl text-primary">{stats.count}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted-foreground">Total Value Calculated</p>
          <p className="num-display mt-1 text-xl">{format(stats.totalValue)}</p>
        </Card>
      </div>

      <SectionLabel>Activity by Tool</SectionLabel>
      <Card className="h-64">
        {stats.data.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet — try a calculator.</p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={stats.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="type" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </AppShell>
  );
}
