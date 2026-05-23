export type {
  AuditInput,
  AuditToolInput,
  AuditRecommendation,
  AuditResult,
  AuditSummary,
  AuditContext,
  AuditRule,
  AuditRuleResult,
  NormalizedToolEntry,
  RecommendationKind,
} from "@/lib/audit/engine/types";

export {
  PRICING_LAST_UPDATED,
  CHATGPT_PRICING,
  CLAUDE_PRICING,
  CURSOR_PRICING,
  COPILOT_PRICING,
  GEMINI_PRICING,
  WINDSURF_PRICING,
  CONSOLIDATION_HEURISTICS,
  SEAT_HEURISTICS,
} from "@/lib/audit/engine/pricing/constants";

export {
  TOOL_PLANS,
  getPlansForTool,
  getPlanById,
  type PlanDefinition,
  type BillingModel,
} from "@/lib/audit/engine/plans/definitions";

export {
  matchPlan,
  normalizePlanString,
  estimateListPriceMonthly,
} from "@/lib/audit/engine/plans/match";

export {
  calculateSavings,
  calculateSeatRightsizingSavings,
  calculateConsolidationSavings,
  sumSavings,
  roundUsd,
  type SavingsAmount,
} from "@/lib/audit/engine/savings/calculate";

export { buildAuditContext, findTool, hasTool } from "@/lib/audit/engine/context";

export {
  TOOL_RULES,
  CONSOLIDATION_RULES,
  ALL_AUDIT_RULES,
} from "@/lib/audit/engine/rules";

export { runAuditEngine, auditInputFromForm } from "@/lib/audit/engine/run";
