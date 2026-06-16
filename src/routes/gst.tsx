import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Check } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, Field, PillButton, SectionLabel, TextInput } from "@/components/calc-ui";
import { gstCalc } from "@/lib/finance";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/gst")({
  head: () => ({ meta: [{ title: "GST Calculator — Tax Inclusive / Exclusive" }] }),
  component: Page,
});

const SLABS = [5, 12, 18, 28];

function Page() {
  const { format, addHistory } = useApp();
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState(1500);
  const [rate, setRate] = useState(18);
  const [custom, setCustom] = useState(false);

  const r = useMemo(() => gstCalc(amount, rate, mode), [amount, rate, mode]);

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
          <TextInput type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} />
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
            <TextInput type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} placeholder="Custom %" />
          )}
        </div>

        <div className="primary-gradient rounded-2xl p-6 text-primary-foreground shadow-[var(--shadow-glow)]">
          <p className="text-xs font-semibold opacity-80">Total GST Amount</p>
          <p className="num-display mt-2 text-4xl">{format(r.gst)}</p>
          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-sm">
            <span className="opacity-80">{mode === "add" ? "Total Payable" : "Net Amount"}</span>
            <span className="num-display text-lg">{format(mode === "add" ? r.total : r.net)}</span>
          </div>
        </div>

        <SectionLabel>Tax Breakdown</SectionLabel>
        <Card className="space-y-2 text-sm">
          <Row label="Base Amount" value={format(r.net)} />
          <Row label={`GST @ ${rate}%`} value={format(r.gst)} />
          <Row label="Total" value={format(r.total)} bold />
        </Card>

        <button onClick={() => addHistory({ type: "gst", title: "GST Breakdown", summary: `Amount: ${format(amount, { decimals: 0 })} • ${rate}% Tax`, value: r.gst })}
          className="primary-gradient w-full rounded-2xl py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
          Save to History
        </button>
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
