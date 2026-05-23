import { TrendingDown } from "lucide-react";
import { MoneyAmount } from "@/components/ui/money-amount";
import { formatInrApprox, formatUsd } from "@/lib/currency";
import type { AuditSummary } from "@/lib/audit/engine/types";
import { cn } from "@/lib/utils";

type SavingsHeroProps = {
  summary: AuditSummary;
  toolCount: number;
  isOptimized: boolean;
  className?: string;
};

export function SavingsHero({
  summary,
  toolCount,
  isOptimized,
  className,
}: SavingsHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-card-gradient p-6 sm:p-10",
        "ring-1 ring-white/5",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-emerald-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 size-48 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <TrendingDown className="size-3.5" />
            Audit complete
          </span>
          <span className="text-sm text-muted-foreground">
            {toolCount} {toolCount === 1 ? "tool" : "tools"} ·{" "}
            {formatUsd(summary.totalMonthlySpendUsd)}/mo current spend
          </span>
        </div>

        {isOptimized ? (
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your stack looks well optimized
            </h1>
            <p className="max-w-xl text-muted-foreground text-pretty">
              Based on your inputs, we didn&apos;t find material overspend against
              list-price benchmarks. Keep monitoring as your team scales.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-widest text-emerald-400/90">
                Estimated recoverable spend
              </p>
              <MoneyAmount
                usd={summary.totalMonthlySavingsUsd}
                period="month"
                size="xl"
                variant="emerald"
                className="[&_p:first-child]:text-5xl [&_p:first-child]:sm:text-6xl"
              />
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 px-5 py-4 lg:min-w-[200px]">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Annual impact
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-emerald-400">
                {formatUsd(summary.totalAnnualSavingsUsd)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground/80">
                ≈ {formatInrApprox(summary.totalAnnualSavingsUsd)}/year
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
