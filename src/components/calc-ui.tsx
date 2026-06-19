import type { ReactNode, InputHTMLAttributes, KeyboardEvent } from "react";

export type N = number | "";
export const isNum = (v: N): v is number => typeof v === "number" && Number.isFinite(v);
export const allNum = (...v: N[]) => v.every(isNum);
export const numOr = (v: N, fallback = 0) => (isNum(v) ? v : fallback);

function blurOnEnter(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") {
    e.preventDefault();
    (e.currentTarget as HTMLInputElement).blur();
  }
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card p-5 ${className}`}>{children}</div>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="inline-block h-px w-4 bg-primary" />
      <span className="section-label">{children}</span>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        {hint && <div className="text-xs font-semibold text-primary">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

export function TextInput({ className = "", onKeyDown, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      enterKeyHint="done"
      autoComplete="off"
      onKeyDown={(e) => { blurOnEnter(e); onKeyDown?.(e); }}
      className={`w-full rounded-xl border border-border bg-surface-2/50 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${className}`}
    />
  );
}

export function NumberPill({
  value,
  onChange,
  suffix,
  prefix,
  step = 1,
  min,
  max,
  placeholder = "",
}: {
  value: N;
  onChange: (n: N) => void;
  suffix?: string;
  prefix?: string;
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <div className="inline-flex min-w-0 items-center gap-1 rounded-lg bg-surface-2/70 px-2 py-1 text-xs font-semibold text-primary focus-within:ring-2 focus-within:ring-primary/60">
      {prefix && <span className="shrink-0">{prefix}</span>}
      <input
        type="number"
        inputMode="decimal"
        enterKeyHint="done"
        autoComplete="off"
        value={value === "" ? "" : value}
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        onKeyDown={blurOnEnter}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") { onChange(""); return; }
          const n = Number(raw);
          if (Number.isNaN(n)) return;
          let v = n;
          if (min !== undefined) v = Math.max(min, v);
          if (max !== undefined) v = Math.min(max, v);
          onChange(v);
        }}
        className="w-24 min-w-0 bg-transparent text-right tabular-nums outline-none placeholder:text-muted-foreground"
      />
      {suffix && <span className="shrink-0">{suffix}</span>}
    </div>
  );
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="range"
      className="fc-range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

export function ResultPanel({
  label,
  value,
  sub,
  variant = "primary",
  placeholder,
}: {
  label: string;
  value: string | null;
  sub?: ReactNode;
  variant?: "primary" | "muted";
  placeholder?: string;
}) {
  const empty = value == null;
  return (
    <div
      className={`rounded-2xl p-6 text-center ${
        variant === "primary" && !empty ? "primary-gradient text-primary-foreground" : "glass-card"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
      <p className={`num-display mt-2 text-4xl ${empty ? "text-muted-foreground" : ""}`}>
        {empty ? (placeholder ?? "—") : value}
      </p>
      {!empty && sub && <div className="mt-3 text-sm opacity-90">{sub}</div>}
    </div>
  );
}

export function PillButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
        active
          ? "primary-gradient text-primary-foreground shadow-[var(--shadow-glow)]"
          : "bg-surface-2/60 text-foreground hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  );
}

export function ActionButton({
  onClick,
  children,
  icon,
  disabled,
}: {
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="primary-gradient inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    >
      {icon}
      {children}
    </button>
  );
}

export function CalculateButton({ onClick, disabled, label = "Calculate" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="primary-gradient w-full rounded-2xl py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    >
      {label}
    </button>
  );
}

export function EmptyHint({ children = "Enter all values, then tap Calculate to see results." }: { children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-2/30 p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
