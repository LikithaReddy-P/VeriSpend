import {
  ArrowDownRight,
  BarChart3,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MoneyAmount } from "@/components/ui/money-amount";
import { formatUsd } from "@/lib/currency";
import { cn } from "@/lib/utils";

const tools = [
  { name: "ChatGPT Team", spend: 600, pct: 42, status: "overspend" as const },
  { name: "Cursor Business", spend: 400, pct: 28, status: "review" as const },
  { name: "GitHub Copilot", spend: 228, pct: 16, status: "ok" as const },
  { name: "Claude Team", spend: 200, pct: 14, status: "ok" as const },
];

const statusStyles = {
  overspend: "bg-amber-500/15 text-amber-400",
  review: "bg-violet-500/15 text-violet-300",
  ok: "bg-emerald-500/15 text-emerald-400",
};

export function DashboardPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-card-gradient p-1 shadow-2xl shadow-black/40 ring-1 ring-white/5",
        className
      )}
    >
      <div className="rounded-[calc(var(--radius-xl)-2px)] bg-card/90 p-5 backdrop-blur-sm sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15">
              <BarChart3 className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">AI spend overview</p>
              <p className="text-xs text-muted-foreground">Last 30 days · 14 seats</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="gap-1 border-0 bg-primary/10 text-primary"
          >
            <Sparkles className="size-3" />
            Live audit
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/60 bg-background/50 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CircleDollarSign className="size-3.5" />
              Monthly spend
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {formatUsd(1428)}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-xs text-emerald-400/90">
              <ArrowDownRight className="size-3.5" />
              Recoverable
            </div>
            <MoneyAmount
              usd={514}
              period="month"
              size="md"
              variant="emerald"
              className="mt-2"
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {tools.map((tool) => (
            <div key={tool.name} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">{tool.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">${tool.spend}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      statusStyles[tool.status]
                    )}
                  >
                    {tool.status}
                  </span>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/80 to-violet-400/60"
                  style={{ width: `${tool.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-primary/20 blur-3xl"
      />
    </div>
  );
}
