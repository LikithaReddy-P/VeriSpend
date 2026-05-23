import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { formatUsd } from "@/lib/currency";
import type { AuditSummary } from "@/lib/audit/engine/types";

type OptimizedStateProps = {
  summary: AuditSummary;
};

export function OptimizedState({ summary }: OptimizedStateProps) {
  return (
    <section className="rounded-xl border border-border/80 bg-card/30 p-6 sm:p-8">
      <div className="flex gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="size-5" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">
            No major overspend detected
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            Your current configuration is within reasonable bounds for a{" "}
            {formatUsd(summary.totalMonthlySpendUsd)}/mo stack. We only surface
            recommendations when list-price benchmarks suggest material savings —
            we won&apos;t invent cuts to fill a report.
          </p>
          <p className="text-sm text-muted-foreground">
            Re-run this audit when you add tools, change tiers, or grow past 20 seats.
          </p>
        </div>
      </div>
    </section>
  );
}
