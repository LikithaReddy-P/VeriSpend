import type { AiToolId } from "@/lib/audit/constants";
import {
  getPlansForTool,
  type PlanDefinition,
} from "@/lib/audit/engine/plans/definitions";

export function normalizePlanString(plan: string): string {
  return plan.trim().toLowerCase();
}

export function planMatchesAlias(plan: string, aliases: string[]): boolean {
  const normalized = normalizePlanString(plan);
  return aliases.some(
    (alias) =>
      normalized === alias.toLowerCase() ||
      normalized.includes(alias.toLowerCase())
  );
}

export function matchPlan(
  toolId: AiToolId,
  planName: string
): PlanDefinition | null {
  const plans = getPlansForTool(toolId);
  const exact = plans.find((p) =>
    planMatchesAlias(planName, [p.label, ...p.aliases])
  );
  if (exact) return exact;

  return (
    plans.find((p) => planMatchesAlias(planName, p.aliases)) ?? null
  );
}

export function estimateListPriceMonthly(
  plan: PlanDefinition,
  seats: number
): number {
  const effectiveSeats = Math.max(seats, plan.minSeats ?? 1);
  if (plan.billingModel === "flat") {
    return plan.monthlyPriceUsd;
  }
  return plan.monthlyPriceUsd * effectiveSeats;
}
