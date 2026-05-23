import { notFound } from "next/navigation";
import { AuditResultsView } from "@/components/audit/results/audit-results-view";
import {
  buildAuditShareMetadata,
  buildAuditShareMetadataFallback,
} from "@/lib/audit/share-metadata";
import { getSharedAudit } from "@/lib/audit/get-shared-audit";
import { snapshotToAuditResult } from "@/lib/audit/db";

type SharedAuditPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: SharedAuditPageProps) {
  const { id } = await params;
  const audit = await getSharedAudit(id);

  if (!audit) {
    return buildAuditShareMetadataFallback(id);
  }

  return buildAuditShareMetadata(audit.publicId, audit.snapshot);
}

export default async function SharedAuditPage({ params }: SharedAuditPageProps) {
  const { id } = await params;
  const audit = await getSharedAudit(id);

  if (!audit) {
    notFound();
  }

  const result = snapshotToAuditResult(audit.snapshot);

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hero-glow opacity-50"
      />
      <AuditResultsView
        result={result}
        mode="shared"
        publicId={audit.publicId}
        toolCount={audit.snapshot.toolCount}
      />
    </div>
  );
}
