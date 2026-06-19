import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Scale, Info } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CalculateButton, Card, EmptyHint, Field, SectionLabel, TextInput, allNum, numOr, type N } from "@/components/calc-ui";
import { emi } from "@/lib/finance";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Loan Comparison — Side by Side" }] }),
  component: Page,
});

interface Opt { amount: N; rate: N; years: N; }

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
  const [a, setA] = useState<Opt>({ amount: "", rate: "", years: "" });
  const [b, setB] = useState<Opt>({ amount: "", rate: "", years: "" });
  const [shown, setShown] = useState(false);
  useEffect(() => { setShown(false); }, [a, b]);

  const ready = allNum(a.amount, a.rate, a.years, b.amount, b.rate, b.years);
  const ra = useMemo(() => (ready ? emi(numOr(a.amount), numOr(a.rate), numOr(a.years)) : null), [ready, a]);
  const rb = useMemo(() => (ready ? emi(numOr(b.amount), numOr(b.rate), numOr(b.years)) : null), [ready, b]);
  const calculated = shown && ra !== null && rb !== null;
  const savings = calculated ? Math.abs(ra!.totalInterest - rb!.totalInterest) : 0;
  const cheaper = calculated ? (ra!.totalPayable < rb!.totalPayable ? "A" : "B") : "—";
  const pct = calculated
    ? ((Math.max(ra!.totalPayable, rb!.totalPayable) - Math.min(ra!.totalPayable, rb!.totalPayable)) /
        Math.max(ra!.totalPayable, rb!.totalPayable)) * 100
    : 0;

  return (
    <AppShell>
      <PageHeader title="Loan Comparison" />

      <Card className="mb-5 flex items-start gap-3 bg-surface-2/40 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">Compare two loan scenarios side-by-side to find the most cost-effective option.</p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <OptionCard letter="A" opt={a} setOpt={setA} />
        <OptionCard letter="B" opt={b} setOpt={setB} />
      </div>

      <div className="mt-5">
        <CalculateButton
          disabled={!ready}
          onClick={() => {
            setShown(true);
            if (!ready || !ra || !rb) return;
            addHistory({ type: "compare", title: "Loan Comparison", summary: `A vs B savings`, value: Math.abs(ra.totalInterest - rb.totalInterest) });
          }}
          label="Compare Loans"
        />
      </div>

      {!calculated ? (
        <div className="mt-4"><EmptyHint>{ready ? "Tap Compare Loans." : "Fill all six fields for both options to compare."}</EmptyHint></div>
      ) : (
        <>
          <div className="primary-gradient mt-4 rounded-2xl p-6 text-center text-primary-foreground shadow-[var(--shadow-glow)]">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Total Interest Savings</p>
            <p className="num-display mt-2 text-4xl">{format(savings)}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold">
              <Scale className="size-3.5" /> Option {cheaper} is {pct.toFixed(0)}% Cheaper
            </span>
          </div>

          <div className="mt-6">
            <SectionLabel>Detailed Analysis</SectionLabel>
            <Card className="space-y-3 text-sm">
              <Row label="Monthly EMI" a={format(ra!.monthly)} b={format(rb!.monthly)} />
              <Row label="Total Interest" a={format(ra!.totalInterest)} b={format(rb!.totalInterest)} />
              <Row label="Total Payable" a={format(ra!.totalPayable)} b={format(rb!.totalPayable)} />
            </Card>
          </div>
        </>
      )}
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
        <TextInput type="number" inputMode="decimal" placeholder="0" value={opt.amount === "" ? "" : opt.amount} onChange={setNum((v) => setOpt({ ...opt, amount: v }))} />
      </Field>
      <Field label="Interest Rate (%)">
        <TextInput type="number" inputMode="decimal" step="0.1" placeholder="0" value={opt.rate === "" ? "" : opt.rate} onChange={setNum((v) => setOpt({ ...opt, rate: v }))} />
      </Field>
      <Field label="Tenure (Years)">
        <TextInput type="number" inputMode="decimal" placeholder="0" value={opt.years === "" ? "" : opt.years} onChange={setNum((v) => setOpt({ ...opt, years: v }))} />
      </Field>
    </Card>
  );
}
