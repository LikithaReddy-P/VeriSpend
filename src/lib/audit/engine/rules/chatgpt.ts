import { CHATGPT_PRICING, SEAT_HEURISTICS } from "@/lib/audit/engine/pricing/constants";
import { getPlanById } from "@/lib/audit/engine/plans/definitions";
import { calculateSavings } from "@/lib/audit/engine/savings/calculate";
import { findTool } from "@/lib/audit/engine/context";
import type { AuditRule } from "@/lib/audit/engine/types";

/**
 * ChatGPT Team with 1–2 seats rarely beats Plus on a per-seat basis
 * unless you need Team-only admin controls.
 */
export const chatgptTeamToPlusRule: AuditRule = {
  id: "chatgpt-team-small-team",
  name: "ChatGPT Team → Plus for small teams",
  priority: 10,
  evaluate(ctx) {
    const tool = findTool(ctx, "chatgpt");
    if (!tool || tool.matchedPlanId !== "team") return null;
    if (tool.seats > SEAT_HEURISTICS.chatgptTeamPlusMaxSeats) return null;

    const plusPlan = getPlanById("chatgpt", "plus");
    if (!plusPlan) return null;

    const recommendedSpend =
      plusPlan.monthlyPriceUsd * Math.max(tool.seats, 1);
    const { monthlySavings, annualSavings } = calculateSavings(
      tool.monthlySpend,
      recommendedSpend
    );

    if (monthlySavings < 5) return null;

    return {
      tool: tool.toolName,
      currentPlan: tool.plan,
      recommendation: `Move ${tool.seats} user${tool.seats > 1 ? "s" : ""} to ChatGPT Plus`,
      monthlySavings,
      annualSavings,
      reasoning:
        `Team workspace pricing ($${CHATGPT_PRICING.teamPerSeat}/seat) is built for ` +
        `collaboration at scale. With only ${tool.seats} seat${tool.seats > 1 ? "s" : ""}, ` +
        `Plus at $${CHATGPT_PRICING.plusPerSeat}/seat typically covers individual productivity ` +
        `without paying for unused team admin overhead.`,
      kind: "plan-downgrade",
      toolIds: ["chatgpt"],
    };
  },
};
