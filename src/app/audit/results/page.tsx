import type { Metadata } from "next";
import { AuditResultsLoader } from "@/components/audit/results/audit-results-loader";

export const metadata: Metadata = {
  title: "Audit results",
  description: "Your VeriSpend AI spend audit recommendations and savings estimate.",
};

export default function AuditResultsPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hero-glow opacity-50"
      />
      <AuditResultsLoader />
    </div>
  );
}
