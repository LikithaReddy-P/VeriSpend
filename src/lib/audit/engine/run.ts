import { buildAuditContext } from "@/lib/audit/engine/context";
import { ALL_AUDIT_RULES } from "@/lib/audit/engine/rules";
import { roundUsd, sumSavings } from "@/lib/audit/engine/savings/calculate";
import type {
  AuditInput,
  AuditRecommendation,
  AuditResult,
} from "@/lib/audit/engine/types";
import type { AuditFormValues } from "@/lib/audit/schema";

const MIN_SAVINGS_TO_REPORT_USD = 5;

/**
 * Run the deterministic audit engine against normalized input.
 * No AI, no network calls — pure rule evaluation.
 */
export function runAuditEngine(input: AuditInput): AuditResult {
  const ctx = buildAuditContext(input);
  const recommendations: AuditRecommendation[] = [];

  for (const rule of ALL_AUDIT_RULES) {
    const result = rule.evaluate(ctx);
    if (result && result.monthlySavings >= MIN_SAVINGS_TO_REPORT_USD) {
      recommendations.push(result);
    }
  }

  recommendations.sort((a, b) => b.monthlySavings - a.monthlySavings);

  const totalMonthlySpendUsd = roundUsd(
    ctx.tools.reduce((sum, t) => sum + t.monthlySpend, 0)
  );

  const savingsTotals = sumSavings(recommendations);

  return {
    recommendations,
    summary: {
      totalMonthlySpendUsd,
      totalMonthlySavingsUsd: savingsTotals.monthlySavings,
      totalAnnualSavingsUsd: savingsTotals.annualSavings,
      recommendationCount: recommendations.length,
      overspendDetected: recommendations.length > 0,
    },
    auditedAt: new Date().toISOString(),
    input,
  };
}

/** Map multi-step form values into engine input. */
export function auditInputFromForm(form: AuditFormValues): AuditInput {
  return {
    tools: form.toolDetails.map((t) => ({
      id: t.id,
      plan: t.plan,
      monthlySpend: t.monthlySpend,
      seats: t.seats,
    })),
    teamSize: form.teamSize,
    primaryUseCase: form.primaryUseCase,
  };
}
