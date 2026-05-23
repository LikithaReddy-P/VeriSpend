import { describe, expect, it } from "vitest";
import {
  buildAuditShareDescription,
  buildAuditShareTitle,
} from "@/lib/audit/share-metadata";
import type { PublicAuditSnapshot } from "@/lib/audit/db/types";

const snapshotWithSavings: PublicAuditSnapshot = {
  toolCount: 5,
  tools: [],
  recommendations: [],
  auditedAt: "2026-03-01T00:00:00.000Z",
  summary: {
    totalMonthlySpendUsd: 1428,
    totalMonthlySavingsUsd: 820,
    totalAnnualSavingsUsd: 9840,
    recommendationCount: 3,
    overspendDetected: true,
  },
};

describe("buildAuditShareTitle", () => {
  it("emphasizes annual savings when material", () => {
    expect(buildAuditShareTitle(snapshotWithSavings)).toBe(
      "Save $9,840/year · VeriSpend Audit"
    );
  });
});

describe("buildAuditShareDescription", () => {
  it("includes monthly and annual savings with branding", () => {
    const description = buildAuditShareDescription(snapshotWithSavings);
    expect(description).toContain("Save $9,840/year");
    expect(description).toContain("VeriSpend");
    expect(description).toContain("$820/month");
  });
});
