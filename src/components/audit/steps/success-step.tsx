"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { formatUsd } from "@/lib/currency";

type SuccessStepProps = {
  totalSpend: number;
  toolCount: number;
};

export function SuccessStep({ totalSpend, toolCount }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        <CheckCircle2 className="size-7" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight">
        Audit inputs received
      </h2>
      <p className="mt-3 max-w-md text-muted-foreground text-pretty">
        We&apos;ve captured spend data for {toolCount}{" "}
        {toolCount === 1 ? "tool" : "tools"} totaling{" "}
        <span className="font-medium text-foreground">
          {formatUsd(totalSpend)}/month
        </span>
        . Your savings report engine is coming next.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">
          Back to home
          <ArrowRight className="size-4" />
        </ButtonLink>
        <Link
          href="/audit"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Start a new audit
        </Link>
      </div>
    </div>
  );
}
