import { CURSOR_PRICING, SEAT_HEURISTICS } from "@/lib/audit/engine/pricing/constants";
import { getPlanById } from "@/lib/audit/engine/plans/definitions";
import { calculateSavings } from "@/lib/audit/engine/savings/calculate";
import { findTool } from "@/lib/audit/engine/context";
import type { AuditRule } from "@/lib/audit/engine/types";

/**
 * Cursor Business for small teams with few seats — Pro is often sufficient
 * when advanced org controls aren't required.
 */
export const cursorBusinessToProRule: AuditRule = {
  id: "cursor-business-small-team",
  name: "Cursor Business → Pro for small teams",
  priority: 10,
  evaluate(ctx) {
    const tool = findTool(ctx, "cursor");
    if (!tool || tool.matchedPlanId !== "business") return null;
    if (tool.seats > SEAT_HEURISTICS.cursorBusinessProMaxSeats) return null;
    if (ctx.teamSize > SEAT_HEURISTICS.smallTeamMaxSize) return null;

    const proPlan = getPlanById("cursor", "pro");
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
      recommendation: `Downgrade ${tool.seats} seat${tool.seats > 1 ? "s" : ""} to Cursor Pro`,
      monthlySavings,
      annualSavings,
      reasoning:
        `Business ($${CURSOR_PRICING.businessPerSeat}/seat) adds org billing and policy controls ` +
        `valuable above ~${SEAT_HEURISTICS.smallTeamMaxSize} people. For a ${ctx.teamSize}-person team ` +
        `with ${tool.seats} licensed seat${tool.seats > 1 ? "s" : ""}, Pro at ` +
        `$${CURSOR_PRICING.proPerSeat}/seat covers the same core IDE features at lower list cost.`,
      kind: "plan-downgrade",
      toolIds: ["cursor"],
    };
  },
};
