import { ArrowRight, Layers, Minus, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MoneyAmount } from "@/components/ui/money-amount";
import type { AuditRecommendation } from "@/lib/audit/engine/types";
import { cn } from "@/lib/utils";

const kindConfig = {
  "plan-downgrade": {
    label: "Plan change",
    icon: Sparkles,
    className: "bg-violet-500/15 text-violet-300",
  },
  "seat-rightsizing": {
    label: "Seat rightsizing",
    icon: Users,
    className: "bg-amber-500/15 text-amber-400",
  },
  consolidation: {
    label: "Consolidation",
    icon: Layers,
    className: "bg-primary/15 text-primary",
  },
  "spend-review": {
    label: "Spend review",
    icon: Minus,
    className: "bg-muted text-muted-foreground",
  },
} as const;

type RecommendationCardProps = {
  recommendation: AuditRecommendation;
  index: number;
};

export function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
  const config = kindConfig[recommendation.kind];
  const Icon = config.icon;

  return (
    <article
      className={cn(
        "audit-step-transition rounded-xl border border-border/80 bg-card/40 p-5 sm:p-6",
        "transition-colors hover:border-primary/25 hover:bg-card/60"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">
              {recommendation.tool}
            </h3>
            <Badge className={cn("border-0", config.className)}>
              <Icon className="mr-1 size-3" />
              {config.label}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-background/30 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Current plan
              </p>
              <p className="mt-1 text-sm font-medium">{recommendation.currentPlan}</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-primary/80">
                Recommended
              </p>
              <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-foreground">
                <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span>{recommendation.recommendation}</span>
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {recommendation.reasoning}
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 sm:text-right">
          <p className="text-xs font-medium text-emerald-400/90">Savings</p>
          <MoneyAmount
            usd={recommendation.monthlySavings}
            period="month"
            size="md"
            variant="emerald"
            className="mt-1 sm:items-end"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {formatUsdAnnual(recommendation.annualSavings)}/year
          </p>
        </div>
      </div>
    </article>
  );
}

function formatUsdAnnual(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
