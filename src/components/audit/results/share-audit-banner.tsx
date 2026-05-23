"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShareAuditBannerProps = {
  publicId: string;
  className?: string;
};

export function ShareAuditBanner({ publicId, className }: ShareAuditBannerProps) {
  const [copied, setCopied] = useState(false);

  const sharePath = `/audit/${publicId}`;

  async function copyLink() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${sharePath}`
        : sharePath;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border/80 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Link2 className="size-4" />
        </div>
        <div>
          <p className="font-medium">Shareable audit link</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Public link includes tool usage and savings only — no email or company
            details.
          </p>
          <p className="mt-2 truncate font-mono text-xs text-muted-foreground">
            {sharePath}
          </p>
        </div>
      </div>
      <Button type="button" variant="outline" onClick={copyLink} className="shrink-0">
        {copied ? (
          <>
            <Check className="size-4 text-emerald-400" />
            Copied
          </>
        ) : (
          <>
            <Copy className="size-4" />
            Copy link
          </>
        )}
      </Button>
    </section>
  );
}
