import { describe, expect, it } from "vitest";
import { toPublicAuditSnapshot } from "@/lib/audit/db/snapshot";
import type { AuditResult } from "@/lib/audit/engine/types";

const sampleResult: AuditResult = {
  auditedAt: "2026-03-01T00:00:00.000Z",
  input: {
    teamSize: 42,
    primaryUseCase: "engineering",
    tools: [
      {
        id: "chatgpt",
        plan: "Team",
        monthlySpend: 600,
        seats: 8,
      },
    ],
  },
  recommendations: [
    {
      tool: "ChatGPT",
      currentPlan: "Team",
      recommendation: "Move to Plus",
      monthlySavings: 100,
      annualSavings: 1200,
      reasoning: "Test",
      kind: "plan-downgrade",
    },
  ],
  summary: {
    totalMonthlySpendUsd: 600,
    totalMonthlySavingsUsd: 100,
    totalAnnualSavingsUsd: 1200,
    recommendationCount: 1,
    overspendDetected: true,
  },
};

describe("toPublicAuditSnapshot", () => {
  it("includes tools and savings but omits team size and use case", () => {
    const snapshot = toPublicAuditSnapshot(sampleResult);

    expect(snapshot.toolCount).toBe(1);
    expect(snapshot.tools[0]?.id).toBe("chatgpt");
    expect(snapshot.summary.totalMonthlySavingsUsd).toBe(100);
    expect(snapshot).not.toHaveProperty("teamSize");
    expect(snapshot).not.toHaveProperty("primaryUseCase");
    expect(JSON.stringify(snapshot)).not.toContain("engineering");
  });
});
