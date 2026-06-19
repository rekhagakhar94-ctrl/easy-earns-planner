import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Check } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CalculateButton, Card, EmptyHint, Field, PillButton, SectionLabel, TextInput, allNum, isNum, numOr, type N } from "@/components/calc-ui";
import { gstCalc } from "@/lib/finance";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/gst")({
  head: () => ({ meta: [{ title: "GST Calculator — Tax Inclusive / Exclusive" }] }),
  component: Page,
});

const SLABS = [5, 12, 18, 28];

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
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState<N>("");
  const [rate, setRate] = useState<N>("");
  const [custom, setCustom] = useState(false);
  const [shown, setShown] = useState(false);
  useEffect(() => { setShown(false); }, [amount, rate, mode]);

  const ready = allNum(amount, rate);
  const r = useMemo(
    () => (ready ? gstCalc(numOr(amount), numOr(rate), mode) : null),
    [ready, amount, rate, mode],
  );
  const calculated = shown && r !== null;

  return (
    <AppShell>
      <PageHeader title="GST Calculator" subtitle="Tax Inclusive & Exclusive" />

      <div className="flex gap-3">
        <PillButton active={mode === "add"} onClick={() => setMode("add")}>Add GST</PillButton>
        <PillButton active={mode === "remove"} onClick={() => setMode("remove")}>Remove GST</PillButton>
      </div>

      <div className="mt-6 space-y-4">
        <SectionLabel>Transaction Details</SectionLabel>
        <Field label={mode === "add" ? "Net Amount" : "Total (incl GST)"}>
          <TextInput type="number" inputMode="decimal" value={amount === "" ? "" : amount} onChange={setNum(setAmount)} />
        </Field>

        <p className="pt-2 text-center text-xs text-muted-foreground">Select GST Slab</p>
        <div className="space-y-2">
          {SLABS.map((s) => (
            <button
              key={s}
              onClick={() => { setRate(s); setCustom(false); }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                !custom && rate === s ? "primary-gradient text-primary-foreground" : "bg-surface-2/60 text-foreground hover:bg-surface-2"
              }`}
            >
              {!custom && rate === s && <Check className="size-4" />} {s}%
            </button>
          ))}
          <button
            onClick={() => setCustom(true)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold ${
              custom ? "primary-gradient text-primary-foreground" : "bg-surface-2/60 text-foreground"
            }`}
          >
            <Pencil className="size-4" /> Custom
          </button>
          {custom && (
            <TextInput type="number" inputMode="decimal" step="0.1" placeholder="Custom %" value={rate === "" ? "" : rate} onChange={setNum(setRate)} />
          )}
        </div>

        <CalculateButton
          disabled={!ready}
          onClick={() => {
            setShown(true);
            if (!ready || !r) return;
            addHistory({
              type: "gst",
              title: "GST Breakdown",
              summary: `Amount: ${format(numOr(amount), { decimals: 0 })} • ${numOr(rate)}% Tax`,
              value: r.gst,
            });
          }}
        />

        {!calculated ? (
          <EmptyHint>{ready ? "Tap Calculate." : "Enter the amount and pick a GST rate."}</EmptyHint>
        ) : (
          <>
            <div className="primary-gradient rounded-2xl p-6 text-primary-foreground shadow-[var(--shadow-glow)]">
              <p className="text-xs font-semibold opacity-80">Total GST Amount</p>
              <p className="num-display mt-2 text-4xl">{format(r!.gst)}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-sm">
                <span className="opacity-80">{mode === "add" ? "Total Payable" : "Net Amount"}</span>
                <span className="num-display text-lg">{format(mode === "add" ? r!.total : r!.net)}</span>
              </div>
            </div>

            <SectionLabel>Tax Breakdown</SectionLabel>
            <Card className="space-y-2 text-sm">
              <Row label="Base Amount" value={format(r!.net)} />
              <Row label={`GST @ ${isNum(rate) ? rate : 0}%`} value={format(r!.gst)} />
              <Row label="Total" value={format(r!.total)} bold />
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "border-t border-border pt-2 font-semibold" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
