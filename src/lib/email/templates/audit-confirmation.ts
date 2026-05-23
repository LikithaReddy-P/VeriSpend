import { formatUsd } from "@/lib/currency";
import { HIGH_SAVINGS_THRESHOLD_USD } from "@/lib/audit/results-constants";

export type AuditEmailSummary = {
  publicId: string;
  toolCount: number;
  totalMonthlySpendUsd: number;
  totalMonthlySavingsUsd: number;
  totalAnnualSavingsUsd: number;
  recommendationCount: number;
  topRecommendation?: string;
};

export function buildAuditConfirmationEmail(summary: AuditEmailSummary): {
  subject: string;
  html: string;
  text: string;
} {
  const isHighSavings =
    summary.totalMonthlySavingsUsd > HIGH_SAVINGS_THRESHOLD_USD;

  const subject = isHighSavings
    ? `Your VeriSpend audit — ${formatUsd(summary.totalMonthlySavingsUsd)}/mo in potential savings`
    : `Your VeriSpend audit summary`;

  const savingsLine =
    summary.totalMonthlySavingsUsd > 0
      ? `Estimated recoverable spend: ${formatUsd(summary.totalMonthlySavingsUsd)}/month (${formatUsd(summary.totalAnnualSavingsUsd)}/year).`
      : "Your stack appears reasonably optimized against our pricing benchmarks.";

  const followUpNote = isHighSavings
    ? "Because your audit shows significant savings potential, a member of our team may reach out with implementation guidance. No obligation."
    : "We'll only follow up if you request a deeper review.";

  const text = [
    "Thanks for using VeriSpend.",
    "",
    "AUDIT SUMMARY",
    `Tools analyzed: ${summary.toolCount}`,
    `Current monthly AI spend: ${formatUsd(summary.totalMonthlySpendUsd)}`,
    savingsLine,
    summary.recommendationCount > 0
      ? `Recommendations: ${summary.recommendationCount}`
      : null,
    summary.topRecommendation
      ? `Top action: ${summary.topRecommendation}`
      : null,
    "",
    followUpNote,
    "",
    `View your report: ${getReportUrl(summary.publicId)}`,
    "",
    "— VeriSpend",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1a1a2e; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p style="color: #6b7280; font-size: 14px;">VeriSpend · AI spend audits</p>
  <h1 style="font-size: 22px; font-weight: 600; margin: 24px 0 8px;">Your audit summary</h1>
  <p>Thanks for running a spend audit with VeriSpend. Here's a quick recap:</p>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
    <tr><td style="padding: 8px 0; color: #6b7280;">Tools analyzed</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${summary.toolCount}</td></tr>
    <tr><td style="padding: 8px 0; color: #6b7280;">Monthly spend</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatUsd(summary.totalMonthlySpendUsd)}</td></tr>
    <tr><td style="padding: 8px 0; color: #6b7280;">Recoverable (est.)</td><td style="padding: 8px 0; text-align: right; font-weight: 600; color: #059669;">${formatUsd(summary.totalMonthlySavingsUsd)}/mo</td></tr>
    <tr><td style="padding: 8px 0; color: #6b7280;">Annual impact</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatUsd(summary.totalAnnualSavingsUsd)}</td></tr>
  </table>

  ${
    summary.topRecommendation
      ? `<p style="font-size: 14px;"><strong>Top recommendation:</strong> ${escapeHtml(summary.topRecommendation)}</p>`
      : ""
  }

  <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">${followUpNote}</p>

  <p style="margin-top: 32px;">
    <a href="${getReportUrl(summary.publicId)}" style="display: inline-block; background: #7c3aed; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;">View full report</a>
  </p>

  <p style="font-size: 12px; color: #9ca3af; margin-top: 40px;">You're receiving this because you requested a copy of your VeriSpend audit.</p>
</body>
</html>`.trim();

  return { subject, html, text };
}

function getReportUrl(publicId: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "https://verispend.app";
  return `${base}/audit/${publicId}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
