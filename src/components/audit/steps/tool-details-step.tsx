"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { getToolMeta } from "@/lib/audit/constants";
import { syncToolDetails, type AuditFormValues } from "@/lib/audit/schema";

export function ToolDetailsStep() {
  const {
    watch,
    setValue,
    getValues,
    register,
    formState: { errors },
  } = useFormContext<AuditFormValues>();

  const selectedIds = watch("selectedToolIds") ?? [];
  const toolDetails = watch("toolDetails") ?? [];

  useEffect(() => {
    const current = getValues("toolDetails");
    const synced = syncToolDetails(selectedIds, current);
    const changed =
      synced.length !== current.length ||
      synced.some((d, i) => d.id !== current[i]?.id);
    if (changed) {
      setValue("toolDetails", synced, { shouldDirty: true });
    }
  }, [selectedIds, getValues, setValue]);

  return (
    <FormSection
      title="Plans, spend, and seats"
      description="Enter current billing for each tool. All amounts in USD — we'll show approximate INR on your report."
    >
      <div className="space-y-6">
        {toolDetails.map((detail, index) => {
          const meta = getToolMeta(detail.id);
          const fieldErrors = errors.toolDetails?.[index];

          return (
            <div
              key={detail.id}
              className="rounded-xl border border-border/80 bg-card/30 p-5"
            >
              <div className="mb-5 border-b border-border/60 pb-4">
                <h3 className="font-medium">{meta.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  e.g. {meta.planExamples.join(", ")}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <FormField
                  label="Current plan"
                  htmlFor={`toolDetails.${index}.plan`}
                  error={fieldErrors?.plan?.message}
                  required
                >
                  <Input
                    id={`toolDetails.${index}.plan`}
                    placeholder={meta.planExamples[0]}
                    className="h-10"
                    aria-invalid={!!fieldErrors?.plan}
                    {...register(`toolDetails.${index}.plan`)}
                  />
                </FormField>

                <FormField
                  label="Monthly spend (USD)"
                  htmlFor={`toolDetails.${index}.monthlySpend`}
                  error={fieldErrors?.monthlySpend?.message}
                  required
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      id={`toolDetails.${index}.monthlySpend`}
                      type="number"
                      min={0}
                      step={1}
                      placeholder="0"
                      className="h-10 pl-7"
                      aria-invalid={!!fieldErrors?.monthlySpend}
                      {...register(`toolDetails.${index}.monthlySpend`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </FormField>

                <FormField
                  label="Seats / licenses"
                  htmlFor={`toolDetails.${index}.seats`}
                  error={fieldErrors?.seats?.message}
                  required
                >
                  <Input
                    id={`toolDetails.${index}.seats`}
                    type="number"
                    min={1}
                    step={1}
                    placeholder="1"
                    className="h-10"
                    aria-invalid={!!fieldErrors?.seats}
                    {...register(`toolDetails.${index}.seats`, {
                      valueAsNumber: true,
                    })}
                  />
                </FormField>
              </div>
            </div>
          );
        })}
      </div>
      {errors.toolDetails?.root && (
        <p className="text-sm text-destructive">{errors.toolDetails.root.message}</p>
      )}
      {typeof errors.toolDetails?.message === "string" && (
        <p className="text-sm text-destructive">{errors.toolDetails.message}</p>
      )}
    </FormSection>
  );
}
