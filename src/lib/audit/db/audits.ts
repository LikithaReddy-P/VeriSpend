import { generatePublicAuditId } from "@/lib/audit/db/id";
import {
  snapshotToAuditResult,
  toPublicAuditSnapshot,
} from "@/lib/audit/db/snapshot";
import type {
  CreateAuditResult,
  FetchAuditResult,
  PublicAuditSnapshot,
} from "@/lib/audit/db/types";
import type { AuditResult } from "@/lib/audit/engine/types";
import { createServerSupabase } from "@/lib/supabase/server";
import type { AuditInsert, AuditRow } from "@/lib/supabase/database.types";

const MAX_ID_COLLISION_RETRIES = 3;

export async function createPublicAudit(
  result: AuditResult
): Promise<CreateAuditResult> {
  const snapshot = toPublicAuditSnapshot(result);
  const supabase = createServerSupabase();

  for (let attempt = 0; attempt < MAX_ID_COLLISION_RETRIES; attempt++) {
    const publicId = generatePublicAuditId();
    const row = snapshotToRow(publicId, snapshot);

    const { error } = await supabase.from("audits").insert(row as AuditInsert);

    if (!error) {
      return { ok: true, publicId };
    }

    if (error.code !== "23505") {
      return { ok: false, error: error.message };
    }
  }

  return { ok: false, error: "Unable to generate a unique audit ID." };
}

export async function fetchPublicAuditById(
  publicId: string
): Promise<FetchAuditResult> {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("public_id", publicId)
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data) {
    return { ok: false, error: "Audit not found.", notFound: true };
  }

  return {
    ok: true,
    publicId: data.public_id,
    snapshot: rowToSnapshot(data),
  };
}

export function getShareableAuditPath(publicId: string): string {
  return `/audit/${publicId}`;
}

export { snapshotToAuditResult, toPublicAuditSnapshot };

function snapshotToRow(
  publicId: string,
  snapshot: PublicAuditSnapshot
): Omit<AuditRow, "id" | "created_at"> {
  return {
    public_id: publicId,
    tool_count: snapshot.toolCount,
    tools: snapshot.tools,
    recommendations: snapshot.recommendations,
    total_monthly_spend_usd: snapshot.summary.totalMonthlySpendUsd,
    total_monthly_savings_usd: snapshot.summary.totalMonthlySavingsUsd,
    total_annual_savings_usd: snapshot.summary.totalAnnualSavingsUsd,
    recommendation_count: snapshot.summary.recommendationCount,
    overspend_detected: snapshot.summary.overspendDetected,
    audited_at: snapshot.auditedAt,
  };
}

function rowToSnapshot(row: AuditRow): PublicAuditSnapshot {
  return {
    toolCount: row.tool_count,
    tools: row.tools,
    recommendations: row.recommendations,
    summary: {
      totalMonthlySpendUsd: Number(row.total_monthly_spend_usd),
      totalMonthlySavingsUsd: Number(row.total_monthly_savings_usd),
      totalAnnualSavingsUsd: Number(row.total_annual_savings_usd),
      recommendationCount: row.recommendation_count,
      overspendDetected: row.overspend_detected,
    },
    auditedAt: row.audited_at,
  };
}
