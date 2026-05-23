import { NextResponse } from "next/server";
import { z } from "zod";
import { createPublicAudit } from "@/lib/audit/db";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { AuditResult } from "@/lib/audit/engine/types";
import { AI_TOOL_IDS } from "@/lib/audit/constants";

const auditResultSchema = z.object({
  recommendations: z.array(
    z.object({
      tool: z.string(),
      currentPlan: z.string(),
      recommendation: z.string(),
      monthlySavings: z.number(),
      annualSavings: z.number(),
      reasoning: z.string(),
      kind: z.enum([
        "plan-downgrade",
        "seat-rightsizing",
        "consolidation",
        "spend-review",
      ]),
      toolIds: z.array(z.enum(AI_TOOL_IDS)).optional(),
    })
  ),
  summary: z.object({
    totalMonthlySpendUsd: z.number(),
    totalMonthlySavingsUsd: z.number(),
    totalAnnualSavingsUsd: z.number(),
    recommendationCount: z.number(),
    overspendDetected: z.boolean(),
  }),
  auditedAt: z.string(),
  input: z.object({
    tools: z.array(
      z.object({
        id: z.enum(AI_TOOL_IDS),
        plan: z.string(),
        monthlySpend: z.number(),
        seats: z.number(),
      })
    ),
    teamSize: z.number(),
    primaryUseCase: z.string(),
  }),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Audit persistence is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = auditResultSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid audit payload.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = parsed.data as AuditResult;
  const saveResult = await createPublicAudit(result);

  if (!saveResult.ok) {
    return NextResponse.json({ error: saveResult.error }, { status: 500 });
  }

  return NextResponse.json({
    publicId: saveResult.publicId,
    shareUrl: `/audit/${saveResult.publicId}`,
  });
}
