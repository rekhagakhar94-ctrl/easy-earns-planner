import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, Field, TextInput } from "@/components/calc-ui";
import { simpleInterest } from "@/lib/finance";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/simple")({
  head: () => ({ meta: [{ title: "Simple Interest Calculator" }] }),
  component: Page,
});

function Page() {
  const { format, addHistory } = useApp();
  const [p, setP] = useState(10000);
  const [r, setR] = useState(6.5);
  const [t, setT] = useState(3);
  const result = useMemo(() => simpleInterest(p, r, t), [p, r, t]);
  return (
    <AppShell>
      <PageHeader title="Simple Interest" subtitle="Direct interest" />
      <div className="space-y-5">
        <Card><Field label="Principal"><TextInput type="number" value={p} onChange={(e) => setP(Number(e.target.value) || 0)} /></Field></Card>
        <Card><Field label="Rate (p.a %)"><TextInput type="number" step="0.1" value={r} onChange={(e) => setR(Number(e.target.value) || 0)} /></Field></Card>
        <Card><Field label="Time (Years)"><TextInput type="number" value={t} onChange={(e) => setT(Number(e.target.value) || 0)} /></Field></Card>

        <Card className="text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Interest</p>
          <p className="num-display mt-1 text-3xl text-primary">{format(result.interest)}</p>
          <p className="mt-3 text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">{format(result.total)}</span></p>
        </Card>

        <button onClick={() => addHistory({ type: "simple", title: "Simple Interest", summary: `${format(p, { decimals: 0 })} • ${r}% • ${t}yrs`, value: result.interest })}
          className="primary-gradient w-full rounded-2xl py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
          Save to History
        </button>
      </div>
    </AppShell>
  );
}
