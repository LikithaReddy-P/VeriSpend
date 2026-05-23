import type { AuditResult } from "@/lib/audit/engine/types";

export const AUDIT_RESULT_STORAGE_KEY = "verispend-audit-result";

export type StoredAuditResult = {
  result: AuditResult;
  publicId?: string;
};

export function saveAuditResult(
  result: AuditResult,
  publicId?: string
): void {
  if (typeof window === "undefined") return;
  const payload: StoredAuditResult = { result, publicId };
  sessionStorage.setItem(AUDIT_RESULT_STORAGE_KEY, JSON.stringify(payload));
}

export function loadAuditResult(): StoredAuditResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(AUDIT_RESULT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredAuditResult | AuditResult;

    // Backward compatibility with older session-only shape
    if ("recommendations" in parsed && "summary" in parsed) {
      return { result: parsed as AuditResult };
    }

    return parsed as StoredAuditResult;
  } catch {
    return null;
  }
}

export function clearAuditResult(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUDIT_RESULT_STORAGE_KEY);
}
