import { AuditWizard } from "@/components/audit/audit-wizard";

export default function AuditPage() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hero-glow opacity-60"
      />
      <AuditWizard />
    </div>
  );
}
