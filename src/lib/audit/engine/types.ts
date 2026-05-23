import type { AiToolId } from "@/lib/audit/constants";

/** Normalized input passed into the audit engine (from form or API). */
export type AuditInput = {
  tools: AuditToolInput[];
  teamSize: number;
  primaryUseCase: string;
};

export type AuditToolInput = {
  id: AiToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
};

/** Resolved tool row used inside rules after plan matching. */
export type NormalizedToolEntry = AuditToolInput & {
  toolName: string;
  matchedPlanId: string | null;
  matchedPlanLabel: string | null;
  listPriceMonthlyUsd: number | null;
};

export type RecommendationKind =
  | "plan-downgrade"
  | "seat-rightsizing"
  | "consolidation"
  | "spend-review";

/**
 * Single recommendation row returned by the engine.
 * Matches the product output contract.
 */
export type AuditRecommendation = {
  tool: string;
  currentPlan: string;
  recommendation: string;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
  kind: RecommendationKind;
  toolIds?: AiToolId[];
};

export type AuditSummary = {
  totalMonthlySpendUsd: number;
  totalMonthlySavingsUsd: number;
  totalAnnualSavingsUsd: number;
  recommendationCount: number;
  overspendDetected: boolean;
};

export type AuditResult = {
  recommendations: AuditRecommendation[];
  summary: AuditSummary;
  auditedAt: string;
  input: AuditInput;
};

export type AuditContext = {
  input: AuditInput;
  tools: NormalizedToolEntry[];
  teamSize: number;
  primaryUseCase: string;
};

export type AuditRuleResult = AuditRecommendation | null;

export type AuditRule = {
  id: string;
  name: string;
  /** Lower runs first within the same phase. */
  priority: number;
  evaluate: (ctx: AuditContext) => AuditRuleResult;
};
