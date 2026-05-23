"use client";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/form/form-section";
import { PRIMARY_USE_CASES } from "@/lib/audit/constants";
import type { AuditFormValues } from "@/lib/audit/schema";
import { cn } from "@/lib/utils";

export function UseCaseStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AuditFormValues>();

  const selected = watch("primaryUseCase");

  return (
    <FormSection
      title="What's your primary use case?"
      description="This helps us weight recommendations — e.g. seat-heavy engineering vs. light GTM usage."
    >
      <div className="space-y-3">
        {PRIMARY_USE_CASES.map((useCase) => {
          const isSelected = selected === useCase.value;
          return (
            <button
              key={useCase.value}
              type="button"
              onClick={() =>
                setValue("primaryUseCase", useCase.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
                isSelected
                  ? "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
                  : "border-border/80 bg-card/40 hover:border-border hover:bg-card/70"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border"
                )}
              >
                {isSelected && <Check className="size-3" strokeWidth={2.5} />}
              </div>
              <div>
                <p className="font-medium">{useCase.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {useCase.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {errors.primaryUseCase && (
        <p className="text-sm text-destructive" role="alert">
          {errors.primaryUseCase.message}
        </p>
      )}
    </FormSection>
  );
}
