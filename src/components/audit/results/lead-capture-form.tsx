"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/form/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const leadFormSchema = z.object({
  email: z.string().email("Enter a valid work email"),
  companyName: z.string().max(200).optional(),
  role: z.string().max(120).optional(),
  teamSize: z.string().optional(),
  website: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

type LeadCaptureFormProps = {
  auditPublicId: string;
  className?: string;
};

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; emailSent: boolean }
  | { status: "error"; message: string };

const ROLE_SUGGESTIONS = [
  "Finance",
  "Operations",
  "Engineering",
  "Founder / CEO",
  "Procurement",
  "Other",
];

export function LeadCaptureForm({
  auditPublicId,
  className,
}: LeadCaptureFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      email: "",
      companyName: "",
      role: "",
      teamSize: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({ status: "loading" });

    try {
      const parsedTeamSize =
        values.teamSize && values.teamSize.trim() !== ""
          ? Number(values.teamSize)
          : undefined;

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditPublicId,
          email: values.email,
          companyName: values.companyName || undefined,
          role: values.role || undefined,
          teamSize:
            parsedTeamSize && !Number.isNaN(parsedTeamSize)
              ? parsedTeamSize
              : undefined,
          website: values.website ?? "",
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        emailSent?: boolean;
        error?: string;
      };

      if (!response.ok) {
        setSubmitState({
          status: "error",
          message: data.error ?? "Unable to save your details. Please try again.",
        });
        return;
      }

      setSubmitState({
        status: "success",
        emailSent: Boolean(data.emailSent),
      });
    } catch {
      setSubmitState({
        status: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  });

  if (submitState.status === "success") {
    return (
      <section
        className={cn(
          "rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 sm:p-8",
          className
        )}
      >
        <div className="flex gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="size-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight">You&apos;re all set</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              {submitState.emailSent
                ? "We sent a confirmation email with your audit summary and a link to this report."
                : "Your details were saved. Share your report link above anytime."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative rounded-2xl border border-border/80 bg-card/40 p-6 sm:p-8",
        className
      )}
    >
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Mail className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Get this report in your inbox
          </h3>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Optional — we&apos;ll email a summary and your shareable link. No spam.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Honeypot: hidden from users, visible to bots */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <FormField
          label="Work email"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            className="h-10"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Company"
            htmlFor="companyName"
            error={errors.companyName?.message}
          >
            <Input
              id="companyName"
              placeholder="Acme Inc."
              className="h-10"
              autoComplete="organization"
              {...register("companyName")}
            />
          </FormField>

          <FormField label="Role" htmlFor="role" error={errors.role?.message}>
            <Input
              id="role"
              list="role-suggestions"
              placeholder="Finance"
              className="h-10"
              {...register("role")}
            />
            <datalist id="role-suggestions">
              {ROLE_SUGGESTIONS.map((role) => (
                <option key={role} value={role} />
              ))}
            </datalist>
          </FormField>
        </div>

        <FormField
          label="Team size"
          htmlFor="teamSize"
          description="Optional — helps us tailor follow-up."
          error={errors.teamSize?.message}
          className="max-w-xs"
        >
          <Input
            id="teamSize"
            type="number"
            min={1}
            placeholder="12"
            className="h-10"
            {...register("teamSize")}
          />
        </FormField>

        {submitState.status === "error" && (
          <p className="text-sm text-destructive" role="alert">
            {submitState.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitState.status === "loading"}
          className="h-10"
        >
          {submitState.status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Email me this audit"
          )}
        </Button>
      </form>
    </section>
  );
}
