"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import type { AuditFormValues } from "@/lib/audit/schema";

export function TeamStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AuditFormValues>();

  return (
    <FormSection
      title="How large is your team?"
      description="Include everyone who might use AI tools — engineering, GTM, ops, and leadership."
    >
      <FormField
        label="Total team size"
        htmlFor="teamSize"
        description="Full-time employees and contractors with access to your stack."
        error={errors.teamSize?.message}
        required
        className="max-w-xs"
      >
        <Input
          id="teamSize"
          type="number"
          min={1}
          step={1}
          placeholder="12"
          className="h-10"
          aria-invalid={!!errors.teamSize}
          {...register("teamSize", { valueAsNumber: true })}
        />
      </FormField>
    </FormSection>
  );
}
