/** Approximate USD → INR rate for secondary display (not for billing). */
const USD_TO_INR_APPROX = 81.25;

function roundInrApprox(raw: number): number {
  if (raw >= 100_000) return Math.round(raw / 10_000) * 10_000;
  if (raw >= 10_000) return Math.round(raw / 1_000) * 1_000;
  if (raw >= 1_000) return Math.round(raw / 100) * 100;
  return Math.round(raw / 50) * 50;
}

export function usdToInrApprox(usd: number): number {
  return roundInrApprox(usd * USD_TO_INR_APPROX);
}

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatUsd(
  amount: number,
  options?: { compact?: boolean }
): string {
  if (options?.compact) {
    return `$${amount.toLocaleString("en-US")}`;
  }
  return usdFormatter.format(amount);
}

export function formatInrApprox(amountUsd: number): string {
  return inrFormatter.format(usdToInrApprox(amountUsd));
}

export type MoneyPeriod = "month" | "year";

export function periodSuffix(period?: MoneyPeriod): string {
  if (period === "month") return "/month";
  if (period === "year") return "/year";
  return "";
}
