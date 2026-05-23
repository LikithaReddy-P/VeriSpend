"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { HighSavingsCta } from "@/components/audit/results/high-savings-cta";
import { OptimizedState } from "@/components/audit/results/optimized-state";
import { RecommendationCard } from "@/components/audit/results/recommendation-card";
import { SavingsHero } from "@/components/audit/results/savings-hero";
import {
  HIGH_SAVINGS_THRESHOLD_USD,
  LOW_SAVINGS_THRESHOLD_USD,
} from "@/lib/audit/results-constants";
import { ShareAuditBanner } from "@/components/audit/results/share-audit-banner";
import type { AuditResult } from "@/lib/audit/engine/types";

type AuditResultsViewProps = {
  result: AuditResult;
  mode?: "owner" | "shared";
  publicId?: string;
  toolCount?: number;
};

export function AuditResultsView({
  result,
  mode = "owner",
  publicId,
  toolCount: toolCountProp,
}: AuditResultsViewProps) {
  const { summary, recommendations, input } = result;
  const toolCount = toolCountProp ?? input.tools.length;
  const isShared = mode === "shared";

  const isOptimized =
    recommendations.length === 0 ||
    summary.totalMonthlySavingsUsd < LOW_SAVINGS_THRESHOLD_USD;

  const showHighSavingsCta =
    summary.totalMonthlySavingsUsd > HIGH_SAVINGS_THRESHOLD_USD;

  const auditedDate = new Date(result.auditedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Container className="max-w-4xl py-8 sm:py-12">
      <div className="audit-step-transition mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {!isShared ? (
          <ButtonLink href="/audit" variant="outline" size="sm">
            <ArrowLeft className="size-4" />
            Edit inputs
          </ButtonLink>
        ) : (
          <ButtonLink href="/" variant="outline" size="sm">
            <ArrowLeft className="size-4" />
            VeriSpend home
          </ButtonLink>
        )}
        <p className="text-sm text-muted-foreground">
          {isShared ? "Shared audit" : "Your audit"} · {auditedDate}
        </p>
      </div>

      <div className="audit-step-transition space-y-10">
        {publicId && !isShared && (
          <ShareAuditBanner publicId={publicId} />
        )}

        <SavingsHero
          summary={summary}
          toolCount={toolCount}
          isOptimized={isOptimized}
        />

        {showHighSavingsCta && (
          <HighSavingsCta monthlySavings={summary.totalMonthlySavingsUsd} />
        )}

        {isOptimized ? (
          <OptimizedState summary={summary} />
        ) : (
          <section className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                Recommendations by tool
              </h2>
              <p className="text-sm text-muted-foreground">
                {summary.recommendationCount}{" "}
                {summary.recommendationCount === 1 ? "action" : "actions"} ranked
                by monthly impact
              </p>
            </div>
            <ul className="space-y-4">
              {recommendations.map((rec, index) => (
                <li key={`${rec.tool}-${rec.kind}-${index}`}>
                  <RecommendationCard recommendation={rec} index={index} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-col items-center gap-4 border-t border-border/60 pt-10 sm:flex-row sm:justify-between">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            Analysis uses deterministic pricing rules — not AI-generated estimates.
          </p>
          <div className="flex gap-3">
            <ButtonLink href="/audit" variant="outline">
              <RotateCcw className="size-4" />
              New audit
            </ButtonLink>
            <Link
              href="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
