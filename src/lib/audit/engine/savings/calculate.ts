import { USD_PER_YEAR } from "@/lib/audit/engine/pricing/constants";

export type SavingsAmount = {
  monthlySavings: number;
  annualSavings: number;
};

/** Never return negative savings — rules express upside only. */
export function calculateSavings(
  currentMonthlySpendUsd: number,
  recommendedMonthlySpendUsd: number
): SavingsAmount {
  const monthlySavings = Math.max(
    0,
    roundUsd(currentMonthlySpendUsd - recommendedMonthlySpendUsd)
  );
  return {
    monthlySavings,
    annualSavings: roundUsd(monthlySavings * USD_PER_YEAR),
  };
}

export function calculateSeatRightsizingSavings(
  currentMonthlySpendUsd: number,
  seats: number,
  targetSeats: number
): SavingsAmount {
  if (seats <= 0 || targetSeats >= seats) {
    return { monthlySavings: 0, annualSavings: 0 };
  }
  const perSeat = currentMonthlySpendUsd / seats;
  const recommendedSpend = perSeat * targetSeats;
  return calculateSavings(currentMonthlySpendUsd, recommendedSpend);
}

export function calculateConsolidationSavings(
  lowerCostToolMonthlySpend: number,
  recoverableRatio: number
): SavingsAmount {
  const monthlySavings = roundUsd(
    lowerCostToolMonthlySpend * recoverableRatio
  );
  return {
    monthlySavings,
    annualSavings: roundUsd(monthlySavings * USD_PER_YEAR),
  };
}

export function sumSavings(
  items: Pick<SavingsAmount, "monthlySavings">[]
): SavingsAmount {
  const monthlySavings = roundUsd(
    items.reduce((sum, item) => sum + item.monthlySavings, 0)
  );
  return {
    monthlySavings,
    annualSavings: roundUsd(monthlySavings * USD_PER_YEAR),
  };
}

export function roundUsd(amount: number): number {
  return Math.round(amount * 100) / 100;
}
