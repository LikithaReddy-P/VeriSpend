import type { AuditResult } from "@/lib/audit/engine/types";
import type { PublicAuditSnapshot } from "@/lib/audit/db/types";

/**
 * Strip non-public fields before persistence.
 * Omits team size, use case, and any future PII fields.
 */
export function toPublicAuditSnapshot(result: AuditResult): PublicAuditSnapshot {
  return {
    toolCount: result.input.tools.length,
    tools: result.input.tools.map((tool) => ({
      id: tool.id,
      plan: tool.plan,
      monthlySpend: tool.monthlySpend,
      seats: tool.seats,
    })),
    recommendations: result.recommendations,
    summary: result.summary,
    auditedAt: result.auditedAt,
  };
}

/** Rehydrate engine result shape for the shared results UI. */
export function snapshotToAuditResult(
  snapshot: PublicAuditSnapshot
): AuditResult {
  return {
    recommendations: snapshot.recommendations,
    summary: snapshot.summary,
    auditedAt: snapshot.auditedAt,
    input: {
      tools: snapshot.tools,
      teamSize: snapshot.toolCount,
      primaryUseCase: "",
    },
  };
}
