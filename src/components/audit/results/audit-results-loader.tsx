"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { AuditResultsView } from "@/components/audit/results/audit-results-view";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { loadAuditResult } from "@/lib/audit/result-storage";
import type { AuditResult } from "@/lib/audit/engine/types";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; result: AuditResult };

export function AuditResultsLoader() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const result = loadAuditResult();

    if (!result) {
      setState({
        status: "error",
        message: "No audit results found. Complete the audit wizard first.",
      });
      return;
    }

    if (!result.summary || !Array.isArray(result.recommendations)) {
      setState({
        status: "error",
        message: "Saved results are invalid. Please run a new audit.",
      });
      return;
    }

    const timeout = window.setTimeout(() => {
      setState({ status: "ready", result });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, []);

  if (state.status === "loading") {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Generating your audit report…</p>
      </Container>
    );
  }

  if (state.status === "error") {
    return (
      <Container className="flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertCircle className="size-6" />
        </div>
        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          Unable to load results
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
        <ButtonLink href="/audit" className="mt-8">
          Start audit
        </ButtonLink>
      </Container>
    );
  }

  return <AuditResultsView result={state.result} />;
}
