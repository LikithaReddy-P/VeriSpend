import { ArrowRight, Calendar } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { formatUsd } from "@/lib/currency";
import { cn } from "@/lib/utils";

type HighSavingsCtaProps = {
  monthlySavings: number;
  className?: string;
};

export function HighSavingsCta({ monthlySavings, className }: HighSavingsCtaProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/30 p-6 sm:p-8",
        "bg-gradient-to-br from-primary/15 via-card/80 to-violet-600/10",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.15_285/0.2),transparent_55%)]"
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-lg space-y-2">
          <p className="text-sm font-medium text-primary">
            High-impact opportunity · {formatUsd(monthlySavings)}/mo
          </p>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl text-balance">
            Talk to VeriSpend experts to optimize your AI infrastructure spend
          </h2>
          <p className="text-sm text-muted-foreground text-pretty">
            Our team helps finance and engineering leaders implement plan changes,
            consolidate vendors, and track realized savings quarter over quarter.
          </p>
        </div>
        <ButtonLink
          href="mailto:hello@verispend.app?subject=AI%20spend%20optimization"
          size="lg"
          className="h-12 shrink-0 px-6"
        >
          <Calendar className="size-4" />
          Book a review
          <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    </section>
  );
}
