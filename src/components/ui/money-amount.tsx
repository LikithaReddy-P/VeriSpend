import { cn } from "@/lib/utils";
import {
  formatInrApprox,
  formatUsd,
  type MoneyPeriod,
  periodSuffix,
} from "@/lib/currency";

type MoneyAmountProps = {
  usd: number;
  period?: MoneyPeriod;
  showInr?: boolean;
  size?: "md" | "lg" | "xl";
  variant?: "default" | "emerald";
  className?: string;
  inrClassName?: string;
};

const sizeStyles = {
  md: {
    usd: "text-2xl font-semibold tracking-tight",
    suffix: "text-base font-medium",
    inr: "text-xs",
  },
  lg: {
    usd: "text-2xl font-semibold tracking-tight",
    suffix: "text-lg font-medium",
    inr: "text-sm",
  },
  xl: {
    usd: "text-4xl font-semibold tracking-tight",
    suffix: "text-lg font-medium",
    inr: "text-sm",
  },
};

export function MoneyAmount({
  usd,
  period,
  showInr = true,
  size = "md",
  variant = "default",
  className,
  inrClassName,
}: MoneyAmountProps) {
  const styles = sizeStyles[size];
  const suffix = periodSuffix(period);

  return (
    <div className={cn("space-y-0.5", className)}>
      <p
        className={cn(
          styles.usd,
          variant === "emerald" && "text-emerald-400",
          variant === "emerald" && size === "xl" && "[&_span]:text-emerald-400/80"
        )}
      >
        {formatUsd(usd)}
        {suffix && (
          <span
            className={cn(
              styles.suffix,
              variant === "emerald" ? "text-emerald-400/80" : "text-muted-foreground"
            )}
          >
            {suffix}
          </span>
        )}
      </p>
      {showInr && (
        <p
          className={cn(
            styles.inr,
            "text-muted-foreground/80",
            inrClassName
          )}
        >
          ≈ {formatInrApprox(usd)}
          {suffix}
        </p>
      )}
    </div>
  );
}
