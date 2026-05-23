"use client";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/form/form-section";
import { AI_TOOLS } from "@/lib/audit/constants";
import type { AuditFormValues } from "@/lib/audit/schema";
import type { AiToolId } from "@/lib/audit/constants";
import { cn } from "@/lib/utils";

export function ToolsStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AuditFormValues>();

  const selected = watch("selectedToolIds") ?? [];

  function toggleTool(id: AiToolId) {
    const next = selected.includes(id)
      ? selected.filter((t) => t !== id)
      : [...selected, id];
    setValue("selectedToolIds", next, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <FormSection
      title="Which AI tools does your team use?"
      description="Select every product you're actively paying for. You can add plan and spend details in the next step."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {AI_TOOLS.map((tool) => {
          const isSelected = selected.includes(tool.id);
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => toggleTool(tool.id)}
              className={cn(
                "group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                isSelected
                  ? "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
                  : "border-border/80 bg-card/40 hover:border-border hover:bg-card/70"
              )}
            >
              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background/50"
                )}
              >
                {isSelected && <Check className="size-3" strokeWidth={2.5} />}
              </div>
              <div className="min-w-0">
                <p className="font-medium">{tool.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {errors.selectedToolIds && (
        <p className="text-sm text-destructive" role="alert">
          {errors.selectedToolIds.message}
        </p>
      )}
    </FormSection>
  );
}
