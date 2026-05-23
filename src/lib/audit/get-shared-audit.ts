import { fetchPublicAuditById } from "@/lib/audit/db";
import type { FetchAuditResult } from "@/lib/audit/db/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const PUBLIC_ID_PATTERN = /^[a-z0-9]{8,24}$/i;

export function isValidPublicAuditId(id: string): boolean {
  return PUBLIC_ID_PATTERN.test(id);
}

/** Load a shareable audit by public ID (used by page, metadata, and OG image). */
export async function getSharedAudit(
  publicId: string
): Promise<Extract<FetchAuditResult, { ok: true }> | null> {
  if (!isSupabaseConfigured() || !isValidPublicAuditId(publicId)) {
    return null;
  }

  const result = await fetchPublicAuditById(publicId);
  return result.ok ? result : null;
}
