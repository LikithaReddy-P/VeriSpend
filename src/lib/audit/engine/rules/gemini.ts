import { GEMINI_PRICING } from "@/lib/audit/engine/pricing/constants";
import { getPlanById } from "@/lib/audit/engine/plans/definitions";
import { calculateSavings } from "@/lib/audit/engine/savings/calculate";
import { findTool } from "@/lib/audit/engine/context";
import type { AuditRule } from "@/lib/audit/engine/types";

/** Gemini Ultra is rarely justified for standard team productivity workflows. */
export const geminiUltraToProRule: AuditRule = {
  id: "gemini-ultra-downgrade",
  name: "Gemini Ultra → Pro",
  priority: 10,
  evaluate(ctx) {
    const tool = findTool(ctx, "gemini");
    if (!tool || tool.matchedPlanId !== "ultra") return null;

    const proPlan = getPlanById("gemini", "pro");
    if (!proPlan) return null;

    const recommendedSpend = proPlan.monthlyPriceUsd * tool.seats;
    const { monthlySavings, annualSavings } = calculateSavings(
      tool.monthlySpend,
      recommendedSpend
    );

    if (monthlySavings < 5) return null;

    return {
      tool: tool.toolName,
      currentPlan: tool.plan,
      recommendation: "Downgrade to Google AI Pro for standard workflows",
      monthlySavings,
      annualSavings,
      reasoning:
        `Ultra ($${GEMINI_PRICING.ultraPerSeat}/seat list) targets power users and research workloads. ` +
        `Unless your team relies on Ultra-only capacity daily, Pro at ` +
        `$${GEMINI_PRICING.proPerSeat}/seat covers typical drafting, analysis, and search use cases.`,
      kind: "plan-downgrade",
      toolIds: ["gemini"],
    };
  },
};
