import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Scale, Info } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, Field, SectionLabel, TextInput } from "@/components/calc-ui";
import { emi } from "@/lib/finance";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Loan Comparison — Side by Side" }] }),
  component: Page,
});

interface Opt { amount: number; rate: number; years: number; }

function Page() {
  const { format, addHistory } = useApp();
  const [a, setA] = useState<Opt>({ amount: 100000, rate: 7.5, years: 20 });
  const [b, setB] = useState<Opt>({ amount: 100000, rate: 8.0, years: 15 });
  const ra = useMemo(() => emi(a.amount, a.rate, a.years), [a]);
  const rb = useMemo(() => emi(b.amount, b.rate, b.years), [b]);
  const savings = Math.abs(ra.totalInterest - rb.totalInterest);
  const cheaper = ra.totalPayable < rb.totalPayable ? "A" : "B";
  const pct = ((Math.max(ra.totalPayable, rb.totalPayable) - Math.min(ra.totalPayable, rb.totalPayable)) /
    Math.max(ra.totalPayable, rb.totalPayable)) * 100;

  return (
    <AppShell>
      <PageHeader label="FINCALC" title="Loan Comparison" />

      <Card className="mb-5 flex items-start gap-3 bg-surface-2/40 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">Compare two loan scenarios side-by-side to find the most cost-effective option.</p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <OptionCard letter="A" opt={a} setOpt={setA} />
        <OptionCard letter="B" opt={b} setOpt={setB} />
      </div>

      <button onClick={() => addHistory({ type: "compare", title: "Loan Comparison", summary: `A vs B savings`, value: savings })}
        className="primary-gradient mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
        <Scale className="size-4" /> Compare Savings
      </button>

      <div className="primary-gradient mt-4 rounded-2xl p-6 text-center text-primary-foreground shadow-[var(--shadow-glow)]">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Total Interest Savings</p>
        <p className="num-display mt-2 text-4xl">{format(savings)}</p>
        <span className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold">
          Option {cheaper} is {pct.toFixed(0)}% Cheaper
        </span>
      </div>

      <div className="mt-6">
        <SectionLabel>Detailed Analysis</SectionLabel>
        <Card className="space-y-3 text-sm">
          <Row label="Monthly EMI" a={format(ra.monthly)} b={format(rb.monthly)} />
          <Row label="Total Interest" a={format(ra.totalInterest)} b={format(rb.totalInterest)} />
          <Row label="Total Payable" a={format(ra.totalPayable)} b={format(rb.totalPayable)} />
        </Card>
      </div>
    </AppShell>
  );
}

function Row({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border pb-2 last:border-0">
      <span className="text-left text-xs font-semibold">{a}</span>
      <span className="text-center text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-right text-xs font-semibold">{b}</span>
    </div>
  );
}

function OptionCard({ letter, opt, setOpt }: { letter: string; opt: Opt; setOpt: (o: Opt) => void }) {
  return (
    <Card className="space-y-3">
      <p className="text-center text-sm font-bold text-primary">OPTION {letter}</p>
      <Field label="Loan Amount">
        <TextInput type="number" value={opt.amount} onChange={(e) => setOpt({ ...opt, amount: Number(e.target.value) || 0 })} />
      </Field>
      <Field label="Interest Rate (%)">
        <TextInput type="number" step="0.1" value={opt.rate} onChange={(e) => setOpt({ ...opt, rate: Number(e.target.value) || 0 })} />
      </Field>
      <Field label="Tenure (Years)">
        <TextInput type="number" value={opt.years} onChange={(e) => setOpt({ ...opt, years: Number(e.target.value) || 0 })} />
      </Field>
    </Card>
  );
}
