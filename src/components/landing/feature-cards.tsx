import {
  Calculator,
  FileText,
  Layers,
  Users,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";

const features = [
  {
    icon: Layers,
    title: "AI stack analysis",
    description:
      "Map every tool in your stack — models, IDEs, copilots, and APIs — and see where spend concentrates across teams.",
  },
  {
    icon: Calculator,
    title: "Savings calculator",
    description:
      "Instant monthly and annual savings estimates based on plan changes, seat rightsizing, and cheaper alternatives.",
  },
  {
    icon: FileText,
    title: "Shareable audit reports",
    description:
      "Export a clean PDF-style summary for your CFO, board, or finance review — no spreadsheets required.",
  },
  {
    icon: Users,
    title: "Team spend insights",
    description:
      "Understand per-seat costs, unused licenses, and overlap between tools so you can align spend with actual usage.",
  },
] as const;

export function FeatureCards() {
  return (
    <Section id="features" className="bg-white/[0.02]">
      <SectionHeader
        label="Features"
        title="Everything you need to control AI spend"
        description="Purpose-built for teams that need clarity on AI spend — without adding another system to manage."
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="flex gap-5 rounded-2xl border border-border/80 bg-card/40 p-6 transition-colors hover:border-primary/25 hover:bg-card/80"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/10 text-primary">
              <feature.icon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                {feature.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
