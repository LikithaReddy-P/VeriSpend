import {
  defaultAuditFormValues,
  type AuditFormValues,
} from "@/lib/audit/schema";
import { STORAGE_KEY } from "@/lib/audit/constants";

export type AuditDraft = {
  step: number;
  values: AuditFormValues;
  updatedAt: string;
};

export function loadAuditDraft(): AuditDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuditDraft;
    if (!parsed.values || typeof parsed.step !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAuditDraft(draft: AuditDraft): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...draft, updatedAt: new Date().toISOString() })
  );
}

export function clearAuditDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getInitialDraft(): AuditDraft {
  return {
    step: 0,
    values: defaultAuditFormValues,
    updatedAt: new Date().toISOString(),
  };
}
