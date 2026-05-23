import { CLAUDE_PRICING, SEAT_HEURISTICS } from "@/lib/audit/engine/pricing/constants";
import { getPlanById } from "@/lib/audit/engine/plans/definitions";
import { calculateSavings } from "@/lib/audit/engine/savings/calculate";
import { findTool } from "@/lib/audit/engine/context";
import type { AuditRule } from "@/lib/audit/engine/types";

/** Claude Team with very few seats — Pro may be more cost-efficient. */
export const claudeTeamToProRule: AuditRule = {
  id: "claude-team-small-team",
  name: "Claude Team → Pro for small teams",
  priority: 10,
  evaluate(ctx) {
    const tool = findTool(ctx, "claude");
    if (!tool || tool.matchedPlanId !== "team") return null;
    if (tool.seats > SEAT_HEURISTICS.chatgptTeamPlusMaxSeats) return null;

    const proPlan = getPlanById("claude", "pro");
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
      recommendation: `Move ${tool.seats} user${tool.seats > 1 ? "s" : ""} to Claude Pro`,
      monthlySavings,
      annualSavings,
      reasoning:
        `Claude Team ($${CLAUDE_PRICING.teamPerSeat}/seat, ${CLAUDE_PRICING.teamMinSeats}-seat minimum on list) ` +
        `is priced for shared workspaces. With ${tool.seats} seat${tool.seats > 1 ? "s" : ""}, ` +
        `Pro at $${CLAUDE_PRICING.proPerSeat}/seat is typically sufficient unless you require ` +
        `centralized admin and audit logs.`,
      kind: "plan-downgrade",
      toolIds: ["claude"],
    };
  },
};
