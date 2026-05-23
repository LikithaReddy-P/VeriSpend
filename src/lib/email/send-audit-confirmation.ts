import { Resend } from "resend";
import {
  buildAuditConfirmationEmail,
  type AuditEmailSummary,
} from "@/lib/email/templates/audit-confirmation";
import { getResendApiKey, getResendFromEmail, isResendConfigured } from "@/lib/email/env";

export type SendEmailResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Sends transactional audit confirmation via Resend.
 * Non-blocking failures are returned to the caller — lead save still succeeds.
 */
export async function sendAuditConfirmationEmail(
  to: string,
  summary: AuditEmailSummary
): Promise<SendEmailResult> {
  if (!isResendConfigured()) {
    return { ok: false, error: "Email delivery is not configured." };
  }

  try {
    const resend = new Resend(getResendApiKey());
    const { subject, html, text } = buildAuditConfirmationEmail(summary);

    const { error } = await resend.emails.send({
      from: getResendFromEmail(),
      to,
      subject,
      html,
      text,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return { ok: false, error: message };
  }
}
