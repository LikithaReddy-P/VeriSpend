import { describe, expect, it } from "vitest";
import { runAuditEngine } from "@/lib/audit/engine/run";
import type { AuditInput } from "@/lib/audit/engine/types";

describe("runAuditEngine", () => {
  it("recommends ChatGPT Plus for small Team workspaces", () => {
    const input: AuditInput = {
      teamSize: 8,
      primaryUseCase: "engineering",
      tools: [
        {
          id: "chatgpt",
          plan: "Team",
          monthlySpend: 60,
          seats: 2,
        },
      ],
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations.find((r) => r.toolIds?.includes("chatgpt"));

    expect(rec).toBeDefined();
    expect(rec?.recommendation).toMatch(/Plus/i);
    expect(rec?.monthlySavings).toBeGreaterThan(0);
    expect(rec?.annualSavings).toBe(rec!.monthlySavings * 12);
  });

  it("recommends Cursor Pro for small Business teams", () => {
    const input: AuditInput = {
      teamSize: 8,
      primaryUseCase: "engineering",
      tools: [
        {
          id: "cursor",
          plan: "Business",
          monthlySpend: 200,
          seats: 5,
        },
      ],
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations.find((r) => r.toolIds?.includes("cursor"));

    expect(rec).toBeDefined();
    expect(rec?.kind).toBe("plan-downgrade");
    expect(rec?.monthlySavings).toBe(100);
  });

  it("flags IDE stack consolidation when multiple assistants are present", () => {
    const input: AuditInput = {
      teamSize: 12,
      primaryUseCase: "engineering",
      tools: [
        { id: "cursor", plan: "Business", monthlySpend: 400, seats: 10 },
        { id: "windsurf", plan: "Teams", monthlySpend: 180, seats: 6 },
        { id: "github-copilot", plan: "Business", monthlySpend: 114, seats: 6 },
      ],
    };

    const result = runAuditEngine(input);
    const consolidation = result.recommendations.find(
      (r) => r.kind === "consolidation" && r.toolIds?.includes("cursor")
    );

    expect(consolidation).toBeDefined();
    expect(result.summary.overspendDetected).toBe(true);
    expect(result.summary.totalMonthlySpendUsd).toBe(694);
  });

  it("returns output matching the product contract shape", () => {
    const result = runAuditEngine({
      teamSize: 12,
      primaryUseCase: "mixed",
      tools: [
        { id: "chatgpt", plan: "Team", monthlySpend: 600, seats: 8 },
        { id: "cursor", plan: "Business", monthlySpend: 400, seats: 10 },
      ],
    });

    for (const rec of result.recommendations) {
      expect(rec).toMatchObject({
        tool: expect.any(String),
        currentPlan: expect.any(String),
        recommendation: expect.any(String),
        monthlySavings: expect.any(Number),
        annualSavings: expect.any(Number),
        reasoning: expect.any(String),
      });
      expect(rec.annualSavings).toBe(rec.monthlySavings * 12);
    }
  });
});
