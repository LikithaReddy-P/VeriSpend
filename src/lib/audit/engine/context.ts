import { getToolMeta } from "@/lib/audit/constants";
import {
  estimateListPriceMonthly,
  matchPlan,
} from "@/lib/audit/engine/plans/match";
import type {
  AuditContext,
  AuditInput,
  NormalizedToolEntry,
} from "@/lib/audit/engine/types";

export function buildAuditContext(input: AuditInput): AuditContext {
  const tools = input.tools.map(normalizeToolEntry);

  return {
    input,
    tools,
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
  };
}

function normalizeToolEntry(
  tool: AuditInput["tools"][number]
): NormalizedToolEntry {
  const meta = getToolMeta(tool.id);
  const matched = matchPlan(tool.id, tool.plan);

  return {
    ...tool,
    toolName: meta.name,
    matchedPlanId: matched?.id ?? null,
    matchedPlanLabel: matched?.label ?? null,
    listPriceMonthlyUsd: matched
      ? estimateListPriceMonthly(matched, tool.seats)
      : null,
  };
}

export function findTool(
  ctx: AuditContext,
  toolId: NormalizedToolEntry["id"]
): NormalizedToolEntry | undefined {
  return ctx.tools.find((t) => t.id === toolId);
}

export function hasTool(ctx: AuditContext, toolId: NormalizedToolEntry["id"]): boolean {
  return ctx.tools.some((t) => t.id === toolId);
}
