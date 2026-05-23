import type { Metadata } from "next";
import { formatUsd } from "@/lib/currency";
import { site } from "@/lib/site";
import type { PublicAuditSnapshot } from "@/lib/audit/db/types";
import { LOW_SAVINGS_THRESHOLD_USD } from "@/lib/audit/results-constants";

export function getAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "https://verispend.app"
  );
}

export function buildAuditShareTitle(snapshot: PublicAuditSnapshot): string {
  const { totalAnnualSavingsUsd, totalMonthlySavingsUsd } = snapshot.summary;

  if (totalMonthlySavingsUsd >= LOW_SAVINGS_THRESHOLD_USD) {
    return `Save ${formatUsd(totalAnnualSavingsUsd)}/year · ${site.name} Audit`;
  }

  return `${site.name} AI Spend Audit · ${snapshot.toolCount} tools analyzed`;
}

export function buildAuditShareDescription(
  snapshot: PublicAuditSnapshot
): string {
  const {
    totalAnnualSavingsUsd,
    totalMonthlySavingsUsd,
    totalMonthlySpendUsd,
    recommendationCount,
  } = snapshot.summary;

  if (totalMonthlySavingsUsd >= LOW_SAVINGS_THRESHOLD_USD) {
    return (
      `Save ${formatUsd(totalAnnualSavingsUsd)}/year on your AI stack with ${site.name}. ` +
      `${formatUsd(totalMonthlySavingsUsd)}/month recoverable across ${snapshot.toolCount} ` +
      `${snapshot.toolCount === 1 ? "tool" : "tools"} · ${formatUsd(totalMonthlySpendUsd)}/mo current spend.`
    );
  }

  if (totalMonthlySavingsUsd > 0) {
    return (
      `${site.name} found ${formatUsd(totalMonthlySavingsUsd)}/month in potential savings ` +
      `(${formatUsd(totalAnnualSavingsUsd)}/year) across ${snapshot.toolCount} AI tools. ` +
      "Finance-grade audit — no signup required."
    );
  }

  return (
    `${site.name} analyzed ${snapshot.toolCount} AI tools ` +
    `(${formatUsd(totalMonthlySpendUsd)}/mo spend). Stack appears well optimized — ` +
    "see the full audit report."
  );
}

export function buildAuditShareMetadata(
  publicId: string,
  snapshot: PublicAuditSnapshot
): Metadata {
  const title = buildAuditShareTitle(snapshot);
  const description = buildAuditShareDescription(snapshot);
  const url = `${getAppBaseUrl()}/audit/${publicId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@verispend",
    },
    alternates: {
      canonical: url,
    },
  };
}

export function buildAuditShareMetadataFallback(publicId: string): Metadata {
  const title = `${site.name} AI Spend Audit`;
  const description = site.description;
  const url = `${getAppBaseUrl()}/audit/${publicId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
