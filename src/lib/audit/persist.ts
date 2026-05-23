import type { AuditResult } from "@/lib/audit/engine/types";

export type PersistAuditResponse = {
  publicId: string;
  shareUrl: string;
};

/**
 * Persist audit to Supabase via API route.
 * Returns null on failure — caller should fall back to session storage.
 */
export async function persistAuditResult(
  result: AuditResult
): Promise<PersistAuditResponse | null> {
  try {
    const response = await fetch("/api/audits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as PersistAuditResponse;
    if (!data.publicId) return null;

    return {
      publicId: data.publicId,
      shareUrl: data.shareUrl ?? `/audit/${data.publicId}`,
    };
  } catch {
    return null;
  }
}
