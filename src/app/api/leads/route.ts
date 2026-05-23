import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchPublicAuditById } from "@/lib/audit/db";
import { createLead } from "@/lib/leads/db";
import { sendAuditConfirmationEmail } from "@/lib/email/send-audit-confirmation";
import { isResendConfigured } from "@/lib/email/env";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getClientIp, hashIp } from "@/lib/security/client-ip";
import { checkRateLimit, LEAD_RATE_LIMIT } from "@/lib/security/rate-limit";

/**
 * Lead capture API
 *
 * Abuse protection (layered):
 * 1. Honeypot field `website` — bots often fill hidden inputs; silently accept but no-op.
 * 2. In-memory rate limit per hashed IP (see lib/security/rate-limit.ts).
 * 3. Unique (audit_public_id, email) constraint in Supabase.
 */

const leadBodySchema = z.object({
  auditPublicId: z.string().min(8).max(24),
  email: z.string().email().max(320),
  companyName: z.string().max(200).optional(),
  role: z.string().max(120).optional(),
  teamSize: z.coerce.number().int().min(1).max(50_000).optional(),
  /** Honeypot — must be empty; validated after parse */
  website: z.string().optional(),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Lead capture is not configured." },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const rateKey = `leads:${hashIp(ip)}`;
  const rateCheck = checkRateLimit(rateKey, LEAD_RATE_LIMIT);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateCheck.retryAfterMs / 1000)),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = leadBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lead data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { website, auditPublicId, email, companyName, role, teamSize } =
    parsed.data;

  // Honeypot tripped — pretend success so bots don't adapt
  if (website && website.length > 0) {
    return NextResponse.json({ ok: true, emailSent: false });
  }

  const audit = await fetchPublicAuditById(auditPublicId);
  if (!audit.ok) {
    return NextResponse.json(
      { error: "Audit not found." },
      { status: audit.notFound ? 404 : 500 }
    );
  }

  const leadResult = await createLead(
    {
      auditPublicId,
      email,
      companyName,
      role,
      teamSize,
    },
    hashIp(ip)
  );

  if (!leadResult.ok) {
    return NextResponse.json({ error: leadResult.error }, { status: 500 });
  }

  const topRec = audit.snapshot.recommendations[0];
  let emailSent = false;

  if (isResendConfigured() && !leadResult.alreadyExists) {
    const emailResult = await sendAuditConfirmationEmail(email, {
      publicId: auditPublicId,
      toolCount: audit.snapshot.toolCount,
      totalMonthlySpendUsd: audit.snapshot.summary.totalMonthlySpendUsd,
      totalMonthlySavingsUsd: audit.snapshot.summary.totalMonthlySavingsUsd,
      totalAnnualSavingsUsd: audit.snapshot.summary.totalAnnualSavingsUsd,
      recommendationCount: audit.snapshot.summary.recommendationCount,
      topRecommendation: topRec?.recommendation,
    });
    emailSent = emailResult.ok;
  }

  return NextResponse.json({
    ok: true,
    emailSent,
    alreadyExists: leadResult.alreadyExists,
  });
}
