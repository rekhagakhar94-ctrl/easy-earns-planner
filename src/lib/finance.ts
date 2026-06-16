export function emi(principal: number, annualRate: number, years: number) {
  const n = Math.max(1, Math.round(years * 12));
  const r = annualRate / 12 / 100;
  if (r === 0) return { monthly: principal / n, totalInterest: 0, totalPayable: principal, n };
  const m = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayable = m * n;
  return { monthly: m, totalInterest: totalPayable - principal, totalPayable, n };
}

export function compoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  freq: number,
  monthlyAddition = 0,
) {
  const r = annualRate / 100;
  // base principal compounding
  const base = principal * Math.pow(1 + r / freq, freq * years);
  // monthly addition future value compounded monthly (approx)
  const mr = r / 12;
  const months = years * 12;
  const addFV = mr === 0 ? monthlyAddition * months : monthlyAddition * ((Math.pow(1 + mr, months) - 1) / mr);
  const total = base + addFV;
  const totalPrincipal = principal + monthlyAddition * months;
  return { total, totalPrincipal, totalInterest: total - totalPrincipal };
}

export function simpleInterest(p: number, r: number, t: number) {
  const interest = (p * r * t) / 100;
  return { interest, total: p + interest };
}

export function sip(monthly: number, annualReturn: number, years: number) {
  const n = years * 12;
  const i = annualReturn / 12 / 100;
  const fv = i === 0 ? monthly * n : monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = monthly * n;
  return { futureValue: fv, invested, gains: fv - invested };
}

export function fdMaturity(p: number, annualRate: number, years: number, freq: number) {
  const total = p * Math.pow(1 + annualRate / 100 / freq, freq * years);
  return { total, interest: total - p };
}

export function gstCalc(amount: number, rate: number, mode: "add" | "remove") {
  if (mode === "add") {
    const gst = (amount * rate) / 100;
    return { gst, net: amount, total: amount + gst };
  }
  const net = amount / (1 + rate / 100);
  return { gst: amount - net, net, total: amount };
}

export function percentChange(initial: number, final: number) {
  if (initial === 0) return 0;
  return ((final - initial) / initial) * 100;
}

export function valueOfPct(pct: number, total: number) {
  return (pct / 100) * total;
}

export function margin(cost: number, sell: number) {
  const profit = sell - cost;
  const marginPct = sell === 0 ? 0 : (profit / sell) * 100;
  const markupPct = cost === 0 ? 0 : (profit / cost) * 100;
  return { profit, marginPct, markupPct };
}
