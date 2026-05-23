import { cn } from "@/lib/utils";
import { AUDIT_STEPS } from "@/lib/audit/constants";
import { Check } from "lucide-react";

type StepProgressProps = {
  currentStep: number;
  className?: string;
};

export function StepProgress({ currentStep, className }: StepProgressProps) {
  return (
    <nav aria-label="Audit progress" className={cn("w-full", className)}>
      <ol className="flex items-center gap-1 sm:gap-2">
        {AUDIT_STEPS.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.id} className="flex flex-1 items-center gap-1 sm:gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 sm:items-start">
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                    isComplete &&
                      "border-primary/40 bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary/15 text-primary",
                    !isComplete &&
                      !isCurrent &&
                      "border-border bg-muted/40 text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <Check className="size-3.5" strokeWidth={2.5} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "hidden truncate text-xs font-medium sm:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < AUDIT_STEPS.length - 1 && (
                <div
                  aria-hidden
                  className={cn(
                    "mb-5 hidden h-px flex-1 sm:block",
                    index < currentStep ? "bg-primary/40" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-center text-sm text-muted-foreground sm:hidden">
        Step {currentStep + 1} of {AUDIT_STEPS.length}:{" "}
        <span className="text-foreground">{AUDIT_STEPS[currentStep].title}</span>
      </p>
    </nav>
  );
}
