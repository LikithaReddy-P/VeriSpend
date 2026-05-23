"use client";

import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepProgress } from "@/components/audit/step-progress";
import { ToolsStep } from "@/components/audit/steps/tools-step";
import { ToolDetailsStep } from "@/components/audit/steps/tool-details-step";
import { TeamStep } from "@/components/audit/steps/team-step";
import { UseCaseStep } from "@/components/audit/steps/use-case-step";
import { ReviewStep } from "@/components/audit/steps/review-step";
import { SuccessStep } from "@/components/audit/steps/success-step";
import { Container } from "@/components/layout/container";
import { AUDIT_STEPS } from "@/lib/audit/constants";
import {
  auditFormSchema,
  defaultAuditFormValues,
  detailsStepSchema,
  syncToolDetails,
  teamStepSchema,
  toolsStepSchema,
  useCaseStepSchema,
  type AuditFormValues,
} from "@/lib/audit/schema";
import {
  clearAuditDraft,
  getInitialDraft,
  loadAuditDraft,
  saveAuditDraft,
} from "@/lib/audit/storage";
import { cn } from "@/lib/utils";

const stepSchemas = [
  toolsStepSchema,
  detailsStepSchema,
  teamStepSchema,
  useCaseStepSchema,
  auditFormSchema,
] as const;

export function AuditWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: defaultAuditFormValues,
    mode: "onBlur",
  });

  const { watch, trigger, getValues, reset, handleSubmit } = form;
  const values = watch();

  useEffect(() => {
    const draft = loadAuditDraft();
    if (draft) {
      reset(draft.values);
      setStep(Math.min(draft.step, AUDIT_STEPS.length - 1));
    }
    setIsHydrated(true);
  }, [reset]);

  useEffect(() => {
    if (!isHydrated || isComplete) return;

    const timeout = setTimeout(() => {
      saveAuditDraft({
        step,
        values: getValues(),
        updatedAt: new Date().toISOString(),
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [values, step, isHydrated, isComplete, getValues]);

  const goToStep = useCallback((next: number, dir: "forward" | "back") => {
    setDirection(dir);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validateCurrentStep = useCallback(async () => {
    const schema = stepSchemas[step];
    const fields = Object.keys(schema.shape) as (keyof AuditFormValues)[];

    if (step === 1) {
      const selected = getValues("selectedToolIds");
      const synced = syncToolDetails(selected, getValues("toolDetails"));
      form.setValue("toolDetails", synced);
    }

    return trigger(fields);
  }, [step, trigger, getValues, form]);

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;

    if (step === 0) {
      const selected = getValues("selectedToolIds");
      form.setValue("toolDetails", syncToolDetails(selected, getValues("toolDetails")));
    }

    if (step < AUDIT_STEPS.length - 1) {
      goToStep(step + 1, "forward");
    }
  };

  const handleBack = () => {
    if (step > 0) goToStep(step - 1, "back");
  };

  const onSubmit = handleSubmit(() => {
    clearAuditDraft();
    setIsComplete(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const handleReset = () => {
    clearAuditDraft();
    reset(defaultAuditFormValues);
    setStep(0);
    setIsComplete(false);
    setDirection("forward");
  };

  const totalSpend = (values.toolDetails ?? []).reduce(
    (sum, t) => sum + (Number(t.monthlySpend) || 0),
    0
  );

  if (!isHydrated) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </Container>
    );
  }

  if (isComplete) {
    return (
      <Container className="max-w-lg py-12 sm:py-16">
        <SuccessStep
          totalSpend={totalSpend}
          toolCount={values.toolDetails?.length ?? 0}
        />
      </Container>
    );
  }

  const isLastStep = step === AUDIT_STEPS.length - 1;

  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-medium text-primary">Free spend audit</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {AUDIT_STEPS[step].title}
        </h1>
        <p className="text-muted-foreground">{AUDIT_STEPS[step].description}</p>
      </div>

      <StepProgress currentStep={step} className="mb-10" />

      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <div
            className={cn(
              "audit-step-transition",
              direction === "forward"
                ? "audit-step-forward"
                : "audit-step-back"
            )}
            key={step}
          >
            {step === 0 && <ToolsStep />}
            {step === 1 && <ToolDetailsStep />}
            {step === 2 && <TeamStep />}
            {step === 3 && <UseCaseStep />}
            {step === 4 && <ReviewStep />}
          </div>

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={handleReset}
                >
                  <RotateCcw className="size-4" />
                  Clear draft
                </Button>
              )}
            </div>

            {isLastStep ? (
              <Button type="submit" className="sm:min-w-[160px]">
                Submit audit
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="sm:min-w-[140px]"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </form>
      </FormProvider>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Progress saved automatically · USD amounts only in this form
      </p>
    </Container>
  );
}
