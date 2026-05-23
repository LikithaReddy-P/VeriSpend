import { SEAT_HEURISTICS } from "@/lib/audit/engine/pricing/constants";
import { calculateSeatRightsizingSavings } from "@/lib/audit/engine/savings/calculate";
import { findTool } from "@/lib/audit/engine/context";
import type { AuditRule } from "@/lib/audit/engine/types";

/** Copilot seats materially above team size suggest unused licenses. */
export const copilotUnusedSeatsRule: AuditRule = {
  id: "copilot-unused-seats",
  name: "GitHub Copilot seat rightsizing",
  priority: 20,
  evaluate(ctx) {
    const tool = findTool(ctx, "github-copilot");
    if (!tool) return null;

    const targetSeats = Math.max(
      1,
      Math.ceil(ctx.teamSize * SEAT_HEURISTICS.copilotSeatToTeamRatio)
    );

    if (tool.seats <= targetSeats) return null;

    const { monthlySavings, annualSavings } = calculateSeatRightsizingSavings(
      tool.monthlySpend,
      tool.seats,
      targetSeats
    );

    if (monthlySavings < 5) return null;

    const seatsToRemove = tool.seats - targetSeats;

    return {
      tool: tool.toolName,
      currentPlan: tool.plan,
      recommendation: `Remove ${seatsToRemove} unused Copilot seat${seatsToRemove > 1 ? "s" : ""} (target ${targetSeats})`,
      monthlySavings,
      annualSavings,
      reasoning:
        `You have ${tool.seats} Copilot licenses for a ${ctx.teamSize}-person team. ` +
        `Finance teams typically cap coding assistants near headcount. ` +
        `Rightsizing to ~${targetSeats} seat${targetSeats > 1 ? "s" : ""} aligns spend with likely active developers.`,
      kind: "seat-rightsizing",
      toolIds: ["github-copilot"],
    };
  },
};
