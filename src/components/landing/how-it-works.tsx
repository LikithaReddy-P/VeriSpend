import { ClipboardList, LineChart, PiggyBank } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Input your tools",
    description:
      "Add each AI product, plan tier, monthly spend, seat count, team size, and how your team uses it day to day.",
  },
  {
    icon: LineChart,
    step: "02",
    title: "Analyze spend",
    description:
      "VeriSpend benchmarks your setup against pricing rules and typical usage patterns to flag redundant seats and premium tiers.",
  },
  {
    icon: PiggyBank,
    step: "03",
    title: "Get savings recommendations",
    description:
      "Receive specific plan downgrades, seat adjustments, and alternative tools — with monthly and annual savings totals.",
  },
] as const;

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="border-t border-border/40">
      <SectionHeader
        label="How it works"
        title="From stack input to savings report"
        description="No integrations required. Enter your tools once and get a board-ready audit in minutes."
      />

      <ol className="mt-16 grid gap-6 md:grid-cols-3">
        {steps.map((item) => (
          <li
            key={item.title}
            className="group relative rounded-2xl border border-border/80 bg-card/50 p-6 transition-colors hover:border-primary/30 hover:bg-card"
          >
            <span className="text-xs font-medium text-primary">{item.step}</span>
            <div className="mt-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
