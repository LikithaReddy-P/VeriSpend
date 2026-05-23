import type { AuditResult } from "@/lib/audit/engine/types";

export const AUDIT_RESULT_STORAGE_KEY = "verispend-audit-result";

export function saveAuditResult(result: AuditResult): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUDIT_RESULT_STORAGE_KEY, JSON.stringify(result));
}

export function loadAuditResult(): AuditResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(AUDIT_RESULT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuditResult;
  } catch {
    return null;
  }
}

export function clearAuditResult(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUDIT_RESULT_STORAGE_KEY);
}
