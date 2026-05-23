import type { AiToolId } from "@/lib/audit/constants";
import {
  CHATGPT_PRICING,
  CLAUDE_PRICING,
  COPILOT_PRICING,
  CURSOR_PRICING,
  GEMINI_PRICING,
  WINDSURF_PRICING,
} from "@/lib/audit/engine/pricing/constants";

export type BillingModel = "per-seat" | "flat";

export type PlanDefinition = {
  id: string;
  toolId: AiToolId;
  label: string;
  aliases: string[];
  billingModel: BillingModel;
  /** List price in USD per month (per seat when billingModel is per-seat). */
  monthlyPriceUsd: number;
  minSeats?: number;
};

export const TOOL_PLANS: Record<AiToolId, PlanDefinition[]> = {
  chatgpt: [
    {
      id: "plus",
      toolId: "chatgpt",
      label: "Plus",
      aliases: ["plus", "personal"],
      billingModel: "per-seat",
      monthlyPriceUsd: CHATGPT_PRICING.plusPerSeat,
    },
    {
      id: "team",
      toolId: "chatgpt",
      label: "Team",
      aliases: ["team", "workspace"],
      billingModel: "per-seat",
      monthlyPriceUsd: CHATGPT_PRICING.teamPerSeat,
      minSeats: CHATGPT_PRICING.teamMinSeats,
    },
    {
      id: "enterprise",
      toolId: "chatgpt",
      label: "Enterprise",
      aliases: ["enterprise", "ent"],
      billingModel: "per-seat",
      monthlyPriceUsd: CHATGPT_PRICING.enterprisePerSeat,
    },
  ],
  claude: [
    {
      id: "pro",
      toolId: "claude",
      label: "Pro",
      aliases: ["pro"],
      billingModel: "per-seat",
      monthlyPriceUsd: CLAUDE_PRICING.proPerSeat,
    },
    {
      id: "team",
      toolId: "claude",
      label: "Team",
      aliases: ["team"],
      billingModel: "per-seat",
      monthlyPriceUsd: CLAUDE_PRICING.teamPerSeat,
      minSeats: CLAUDE_PRICING.teamMinSeats,
    },
    {
      id: "enterprise",
      toolId: "claude",
      label: "Enterprise",
      aliases: ["enterprise", "ent"],
      billingModel: "per-seat",
      monthlyPriceUsd: CLAUDE_PRICING.enterprisePerSeat,
    },
  ],
  cursor: [
    {
      id: "pro",
      toolId: "cursor",
      label: "Pro",
      aliases: ["pro"],
      billingModel: "per-seat",
      monthlyPriceUsd: CURSOR_PRICING.proPerSeat,
    },
    {
      id: "business",
      toolId: "cursor",
      label: "Business",
      aliases: ["business", "biz"],
      billingModel: "per-seat",
      monthlyPriceUsd: CURSOR_PRICING.businessPerSeat,
    },
    {
      id: "enterprise",
      toolId: "cursor",
      label: "Enterprise",
      aliases: ["enterprise", "ent"],
      billingModel: "per-seat",
      monthlyPriceUsd: CURSOR_PRICING.businessPerSeat * 1.5,
    },
  ],
  "github-copilot": [
    {
      id: "individual",
      toolId: "github-copilot",
      label: "Individual",
      aliases: ["individual", "personal", "copilot"],
      billingModel: "per-seat",
      monthlyPriceUsd: COPILOT_PRICING.individualPerSeat,
    },
    {
      id: "business",
      toolId: "github-copilot",
      label: "Business",
      aliases: ["business", "biz"],
      billingModel: "per-seat",
      monthlyPriceUsd: COPILOT_PRICING.businessPerSeat,
    },
    {
      id: "enterprise",
      toolId: "github-copilot",
      label: "Enterprise",
      aliases: ["enterprise", "ent"],
      billingModel: "per-seat",
      monthlyPriceUsd: COPILOT_PRICING.enterprisePerSeat,
    },
  ],
  gemini: [
    {
      id: "pro",
      toolId: "gemini",
      label: "Google AI Pro",
      aliases: ["pro", "advanced", "google ai pro", "one"],
      billingModel: "per-seat",
      monthlyPriceUsd: GEMINI_PRICING.proPerSeat,
    },
    {
      id: "ultra",
      toolId: "gemini",
      label: "Google AI Ultra",
      aliases: ["ultra"],
      billingModel: "per-seat",
      monthlyPriceUsd: GEMINI_PRICING.ultraPerSeat,
    },
    {
      id: "workspace",
      toolId: "gemini",
      label: "Workspace",
      aliases: ["workspace", "business"],
      billingModel: "per-seat",
      monthlyPriceUsd: GEMINI_PRICING.workspacePerSeat,
    },
  ],
  windsurf: [
    {
      id: "pro",
      toolId: "windsurf",
      label: "Pro",
      aliases: ["pro"],
      billingModel: "per-seat",
      monthlyPriceUsd: WINDSURF_PRICING.proPerSeat,
    },
    {
      id: "teams",
      toolId: "windsurf",
      label: "Teams",
      aliases: ["teams", "team"],
      billingModel: "per-seat",
      monthlyPriceUsd: WINDSURF_PRICING.teamsPerSeat,
    },
    {
      id: "enterprise",
      toolId: "windsurf",
      label: "Enterprise",
      aliases: ["enterprise", "ent"],
      billingModel: "per-seat",
      monthlyPriceUsd: WINDSURF_PRICING.enterprisePerSeat,
    },
  ],
};

export function getPlansForTool(toolId: AiToolId): PlanDefinition[] {
  return TOOL_PLANS[toolId];
}

export function getPlanById(
  toolId: AiToolId,
  planId: string
): PlanDefinition | undefined {
  return TOOL_PLANS[toolId].find((p) => p.id === planId);
}
