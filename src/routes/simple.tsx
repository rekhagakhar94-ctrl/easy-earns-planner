import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CalculateButton, Card, EmptyHint, Field, TextInput, allNum, numOr, type N } from "@/components/calc-ui";
import { simpleInterest } from "@/lib/finance";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/simple")({
  head: () => ({ meta: [{ title: "Simple Interest Calculator" }] }),
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
  const { format, addHistory } = useApp();
  const [p, setP] = useState<N>("");
  const [r, setR] = useState<N>("");
  const [t, setT] = useState<N>("");
  const [shown, setShown] = useState(false);
  useEffect(() => { setShown(false); }, [p, r, t]);
  const ready = allNum(p, r, t);
  const result = useMemo(
    () => (ready ? simpleInterest(numOr(p), numOr(r), numOr(t)) : null),
    [ready, p, r, t],
  );
  const calculated = shown && result !== null;
  return (
    <AppShell>
      <PageHeader title="Simple Interest" subtitle="Direct interest" />
      <div className="space-y-5">
        <Card><Field label="Principal"><TextInput type="number" inputMode="decimal" placeholder="0" value={p === "" ? "" : p} onChange={setNum(setP)} /></Field></Card>
        <Card><Field label="Rate (p.a %)"><TextInput type="number" inputMode="decimal" step="0.1" placeholder="0" value={r === "" ? "" : r} onChange={setNum(setR)} /></Field></Card>
        <Card><Field label="Time (Years)"><TextInput type="number" inputMode="decimal" placeholder="0" value={t === "" ? "" : t} onChange={setNum(setT)} /></Field></Card>

        <CalculateButton
          disabled={!ready}
          onClick={() => {
            setShown(true);
            if (!ready || !result) return;
            addHistory({
              type: "simple",
              title: "Simple Interest",
              summary: `${format(numOr(p), { decimals: 0 })} • ${numOr(r)}% • ${numOr(t)}yrs`,
              value: result.interest,
            });
          }}
        />

        {!calculated ? (
          <EmptyHint>{ready ? "Tap Calculate." : "Enter principal, rate and time, then tap Calculate."}</EmptyHint>
        ) : (
          <Card className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Interest</p>
            <p className="num-display mt-1 text-3xl text-primary">{format(result!.interest)}</p>
            <p className="mt-3 text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">{format(result!.total)}</span></p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
