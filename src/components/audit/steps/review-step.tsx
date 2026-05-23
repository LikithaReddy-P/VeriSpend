"use client";

import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/form/form-section";
import { Separator } from "@/components/ui/separator";
import { formatUsd } from "@/lib/currency";
import { getToolMeta, PRIMARY_USE_CASES } from "@/lib/audit/constants";
import type { AuditFormValues } from "@/lib/audit/schema";

export function ReviewStep() {
  const { watch } = useFormContext<AuditFormValues>();
  const values = watch();

  const totalSpend = (values.toolDetails ?? []).reduce(
    (sum, t) => sum + (Number(t.monthlySpend) || 0),
    0
  );
  const totalSeats = (values.toolDetails ?? []).reduce(
    (sum, t) => sum + (Number(t.seats) || 0),
    0
  );

  const useCaseLabel =
    PRIMARY_USE_CASES.find((u) => u.value === values.primaryUseCase)?.label ??
    values.primaryUseCase;

  return (
    <FormSection
      title="Review your audit inputs"
      description="Confirm everything looks right. Your report will use these numbers against our pricing benchmarks."
    >
      <div className="rounded-xl border border-border/80 bg-card/30 divide-y divide-border/60">
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Team size
            </p>
            <p className="mt-1 text-lg font-semibold">{values.teamSize} people</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total monthly spend
            </p>
            <p className="mt-1 text-lg font-semibold">{formatUsd(totalSpend)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Licensed seats
            </p>
            <p className="mt-1 text-lg font-semibold">{totalSeats}</p>
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Primary use case
          </p>
          <p className="mt-1 font-medium">{useCaseLabel}</p>
        </div>

        <Separator className="bg-border/60" />

        <ul className="divide-y divide-border/60">
          {(values.toolDetails ?? []).map((detail) => {
            const meta = getToolMeta(detail.id);
            return (
              <li
                key={detail.id}
                className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{meta.name}</p>
                  <p className="text-sm text-muted-foreground">{detail.plan}</p>
                </div>
                <div className="flex gap-6 text-sm">
                  <span className="text-muted-foreground">
                    {formatUsd(Number(detail.monthlySpend) || 0)}/mo
                  </span>
                  <span className="text-muted-foreground">
                    {detail.seats} {detail.seats === 1 ? "seat" : "seats"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </FormSection>
  );
}
