import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditResultsView } from "@/components/audit/results/audit-results-view";
import {
  fetchPublicAuditById,
  snapshotToAuditResult,
} from "@/lib/audit/db";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type SharedAuditPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: SharedAuditPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Audit ${id}`,
    description: "Shared VeriSpend AI spend audit — tools and savings insights only.",
  };
}

export default async function SharedAuditPage({ params }: SharedAuditPageProps) {
  const { id } = await params;

  if (!id || !/^[a-z0-9]{8,24}$/i.test(id)) {
    notFound();
  }

  if (!isSupabaseConfigured()) {
    notFound();
  }

  const fetched = await fetchPublicAuditById(id);

  if (!fetched.ok) {
    notFound();
  }

  const result = snapshotToAuditResult(fetched.snapshot);

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hero-glow opacity-50"
      />
      <AuditResultsView
        result={result}
        mode="shared"
        publicId={fetched.publicId}
        toolCount={fetched.snapshot.toolCount}
      />
    </div>
  );
}
