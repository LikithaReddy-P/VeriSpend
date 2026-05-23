import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-8 pt-14 sm:pb-16 sm:pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8 text-center lg:text-left">
            <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              {site.tagline}
            </p>

            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                Finance-grade visibility into{" "}
                <span className="text-gradient">AI infrastructure spend</span>
              </h1>
              <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty lg:mx-0">
                VeriSpend audits ChatGPT, Claude, Cursor, Copilot, Gemini, and your
                full stack — then delivers plan-level recommendations, seat
                optimizations, and savings your leadership team can act on.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <ButtonLink href="/audit" size="lg" className="h-12 w-full px-8 sm:w-auto">
                Run a free spend audit
                <ArrowRight className="size-4" />
              </ButtonLink>
              <p className="text-sm text-muted-foreground">
                No credit card · Board-ready output in minutes
              </p>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <DashboardPreview className="w-full max-w-lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
