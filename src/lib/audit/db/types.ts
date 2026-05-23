import type { AiToolId } from "@/lib/audit/constants";
import type {
  AuditRecommendation,
  AuditSummary,
} from "@/lib/audit/engine/types";

/**
 * Tool usage stored on public audits — no email, company name, or team identifiers.
 */
export type PublicToolSnapshot = {
  id: AiToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
};

/**
 * Public-safe audit payload persisted to Supabase and served at /audit/[id].
 */
export type PublicAuditSnapshot = {
  toolCount: number;
  tools: PublicToolSnapshot[];
  recommendations: AuditRecommendation[];
  summary: AuditSummary;
  auditedAt: string;
};

export type CreateAuditResult =
  | { ok: true; publicId: string }
  | { ok: false; error: string };

export type FetchAuditResult =
  | { ok: true; snapshot: PublicAuditSnapshot; publicId: string }
  | { ok: false; error: string; notFound?: boolean };
