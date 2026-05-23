import { SEAT_HEURISTICS, WINDSURF_PRICING } from "@/lib/audit/engine/pricing/constants";
import { getPlanById } from "@/lib/audit/engine/plans/definitions";
import { calculateSavings } from "@/lib/audit/engine/savings/calculate";
import { findTool } from "@/lib/audit/engine/context";
import type { AuditRule } from "@/lib/audit/engine/types";

/** Windsurf Teams with a handful of users — Pro may suffice. */
export const windsurfTeamsToProRule: AuditRule = {
  id: "windsurf-teams-small-team",
  name: "Windsurf Teams → Pro for small teams",
  priority: 10,
  evaluate(ctx) {
    const tool = findTool(ctx, "windsurf");
    if (!tool || tool.matchedPlanId !== "teams") return null;
    if (tool.seats > SEAT_HEURISTICS.cursorBusinessProMaxSeats) return null;
    if (ctx.teamSize > SEAT_HEURISTICS.smallTeamMaxSize) return null;

    const proPlan = getPlanById("windsurf", "pro");
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
      recommendation: `Downgrade ${tool.seats} seat${tool.seats > 1 ? "s" : ""} to Windsurf Pro`,
      monthlySavings,
      annualSavings,
      reasoning:
        `Teams ($${WINDSURF_PRICING.teamsPerSeat}/seat) includes shared admin features. ` +
        `With ${tool.seats} seat${tool.seats > 1 ? "s" : ""} on a ${ctx.teamSize}-person team, ` +
        `Pro at $${WINDSURF_PRICING.proPerSeat}/seat is usually enough for individual IDE usage.`,
      kind: "plan-downgrade",
      toolIds: ["windsurf"],
    };
  },
};
