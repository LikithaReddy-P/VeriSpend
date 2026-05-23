import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";
import { MoneyAmount } from "@/components/ui/money-amount";
import { formatInrApprox, formatUsd } from "@/lib/currency";
import { Section, SectionHeader } from "@/components/layout/section";

const MONTHLY_SAVINGS_USD = 514;
const ANNUAL_SAVINGS_USD = 6168;

const recommendations = [
  {
    tool: "ChatGPT Team",
    issue: "8 seats on Team tier with light usage",
    action: "Move to Plus + shared workspace",
    savings: 240,
  },
  {
    tool: "Cursor Business",
    issue: "Business plan for 6 occasional users",
    action: "Downgrade 4 seats to Pro",
    savings: 160,
  },
  {
    tool: "GitHub Copilot",
    issue: "6 licenses, 2 inactive last 30 days",
    action: "Remove unused seats",
    savings: 114,
  },
] as const;

export function AuditPreview() {
  return (
    <Section id="sample-report">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeader
            label="Sample report"
            title="See what a VeriSpend audit looks like"
            description="Realistic output for a 12-person team running five AI tools — with clear actions, not vague advice."
            className="mx-0 text-left"
          />

          <ul className="mt-8 space-y-3">
            {[
              "Line-by-line spend breakdown by tool",
              "Overspend flags with plain-English reasoning",
              "Monthly and annual savings totals",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>

          <ButtonLink href="/audit" className="mt-8">
            Generate your audit
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-violet-600/10 blur-2xl"
          />
          <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-card-gradient ring-1 ring-white/5">
            <div className="border-b border-border/80 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Audit report · March 2026
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">
                    12-person team
                  </h3>
                </div>
                <Badge className="gap-1 border-0 bg-amber-500/15 text-amber-400 hover:bg-amber-500/15">
                  <TrendingDown className="size-3" />
                  Overspending
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-sm text-emerald-400/90">Estimated recoverable spend</p>
                <MoneyAmount
                  usd={MONTHLY_SAVINGS_USD}
                  period="month"
                  size="xl"
                  variant="emerald"
                  className="mt-1"
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  {formatUsd(ANNUAL_SAVINGS_USD)}/year · 36% of current AI budget
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground/80">
                  ≈ {formatInrApprox(ANNUAL_SAVINGS_USD)}/year
                </p>
              </div>

              <Separator className="my-6" />

              <ul className="space-y-5">
                {recommendations.map((rec) => (
                  <li key={rec.tool} className="space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{rec.tool}</p>
                      <span className="shrink-0 text-sm font-semibold text-emerald-400">
                        −${rec.savings}/mo
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.issue}</p>
                    <p className="text-sm text-primary/90">
                      → {rec.action}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-center text-xs text-muted-foreground">
                Share link ready ·{" "}
                <Link href="/audit" className="text-primary hover:underline">
                  verispend.app/r/audit-x7k2
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </Section>
  );
}
