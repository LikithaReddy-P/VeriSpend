import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";

export default function AuditPlaceholderPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Audit flow coming soon</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The spend audit wizard will live here. For now, explore the landing page.
      </p>
      <ButtonLink href="/" variant="outline" className="mt-8">
        <ArrowLeft className="size-4" />
        Back to home
      </ButtonLink>
    </Container>
  );
}
