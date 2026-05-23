import { CONSOLIDATION_HEURISTICS } from "@/lib/audit/engine/pricing/constants";
import { calculateConsolidationSavings } from "@/lib/audit/engine/savings/calculate";
import { findTool } from "@/lib/audit/engine/context";
import type { AuditRule } from "@/lib/audit/engine/types";

const IDE_TOOL_IDS = ["cursor", "windsurf", "github-copilot"] as const;
const CHAT_TOOL_IDS = ["chatgpt", "claude"] as const;

/**
 * Multiple IDE assistants (Cursor, Windsurf, Copilot) often overlap for the same engineers.
 */
export const ideStackConsolidationRule: AuditRule = {
  id: "ide-stack-consolidation",
  name: "IDE assistant consolidation",
  priority: 100,
  evaluate(ctx) {
    const ideTools = IDE_TOOL_IDS.map((id) => findTool(ctx, id)).filter(
      (t): t is NonNullable<typeof t> => Boolean(t)
    );

    if (ideTools.length < 2) return null;

    const combinedSpend = ideTools.reduce((sum, t) => sum + t.monthlySpend, 0);
    if (combinedSpend < CONSOLIDATION_HEURISTICS.ideStackMinCombinedSpend) {
      return null;
    }

    const sorted = [...ideTools].sort((a, b) => a.monthlySpend - b.monthlySpend);
    const lowest = sorted[0];
    const names = ideTools.map((t) => t.toolName).join(", ");

    const { monthlySavings, annualSavings } = calculateConsolidationSavings(
      lowest.monthlySpend,
      CONSOLIDATION_HEURISTICS.overlapRecoverableRatio
    );

    if (monthlySavings < 10) return null;

    return {
      tool: names,
      currentPlan: ideTools.map((t) => `${t.toolName}: ${t.plan}`).join(" · "),
      recommendation:
        "Standardize on one primary IDE assistant; retire overlapping licenses",
      monthlySavings,
      annualSavings,
      reasoning:
        `You are paying for ${ideTools.length} coding assistants (${names}) totaling ` +
        `$${combinedSpend.toLocaleString("en-US")}/mo. Most engineering teams standardize on one IDE ` +
        `plus optional Copilot — overlapping tools rarely increase output proportionally. ` +
        `Consolidation typically recovers a portion of the lowest-value license block.`,
      kind: "consolidation",
      toolIds: [...IDE_TOOL_IDS],
    };
  },
};

/**
 * ChatGPT Team + Claude Team together is a common overspend pattern for startups.
 */
export const dualChatLlmConsolidationRule: AuditRule = {
  id: "dual-chat-llm-consolidation",
  name: "Dual chat LLM consolidation",
  priority: 110,
  evaluate(ctx) {
    const chatgpt = findTool(ctx, "chatgpt");
    const claude = findTool(ctx, "claude");

    if (!chatgpt || !claude) return null;

    const teamTier =
      chatgpt.matchedPlanId === "team" || claude.matchedPlanId === "team";
    const enterpriseTier =
      chatgpt.matchedPlanId === "enterprise" ||
      claude.matchedPlanId === "enterprise";

    if (!teamTier && !enterpriseTier) return null;

    const combinedSpend = chatgpt.monthlySpend + claude.monthlySpend;
    if (combinedSpend < CONSOLIDATION_HEURISTICS.chatLlmMinCombinedSpend) {
      return null;
    }

    const lower =
      chatgpt.monthlySpend <= claude.monthlySpend ? chatgpt : claude;

    const { monthlySavings, annualSavings } = calculateConsolidationSavings(
      lower.monthlySpend,
      CONSOLIDATION_HEURISTICS.overlapRecoverableRatio
    );

    if (monthlySavings < 10) return null;

    return {
      tool: `${chatgpt.toolName} + ${claude.toolName}`,
      currentPlan: `${chatgpt.plan} · ${claude.plan}`,
      recommendation:
        "Pick a primary chat LLM vendor for team workflows; downgrade the secondary",
      monthlySavings,
      annualSavings,
      reasoning:
        `Running ${chatgpt.toolName} and ${claude.toolName} on team-or-enterprise tiers ` +
        `($${combinedSpend.toLocaleString("en-US")}/mo combined) duplicates general-purpose chat, ` +
        `drafting, and research. Finance teams usually designate one primary model provider ` +
        `and keep the other for individual power users only.`,
      kind: "consolidation",
      toolIds: ["chatgpt", "claude"],
    };
  },
};
