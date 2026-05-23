export const AI_TOOL_IDS = [
  "chatgpt",
  "claude",
  "cursor",
  "github-copilot",
  "gemini",
  "windsurf",
] as const;

export type AiToolId = (typeof AI_TOOL_IDS)[number];

export const AI_TOOLS: {
  id: AiToolId;
  name: string;
  description: string;
  planExamples: string[];
}[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "OpenAI workspace & API",
    planExamples: ["Plus", "Team", "Enterprise"],
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic team & API",
    planExamples: ["Pro", "Team", "Enterprise"],
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-native IDE",
    planExamples: ["Pro", "Business", "Enterprise"],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "GitHub code assistant",
    planExamples: ["Individual", "Business", "Enterprise"],
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google AI workspace",
    planExamples: ["Google AI Pro", "Google AI Ultra", "Workspace"],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    description: "Codeium IDE",
    planExamples: ["Pro", "Teams", "Enterprise"],
  },
];

export const PRIMARY_USE_CASES = [
  {
    value: "engineering",
    label: "Engineering & product",
    description: "Coding, reviews, prototyping, and technical documentation",
  },
  {
    value: "go-to-market",
    label: "Go-to-market",
    description: "Sales enablement, marketing copy, and customer outreach",
  },
  {
    value: "operations",
    label: "Operations & finance",
    description: "Reporting, analysis, workflows, and internal tooling",
  },
  {
    value: "support",
    label: "Customer support",
    description: "Ticket triage, knowledge base, and response drafting",
  },
  {
    value: "leadership",
    label: "Leadership & strategy",
    description: "Research, planning, and executive communications",
  },
  {
    value: "mixed",
    label: "Mixed across teams",
    description: "Several teams with different primary workflows",
  },
] as const;

export const AUDIT_STEPS = [
  { id: "tools", title: "AI tools", description: "What you're using today" },
  { id: "details", title: "Plans & spend", description: "Per-tool breakdown" },
  { id: "team", title: "Team", description: "Organization size" },
  { id: "use-case", title: "Use case", description: "How your team works" },
  { id: "review", title: "Review", description: "Confirm & submit" },
] as const;

export type AuditStepId = (typeof AUDIT_STEPS)[number]["id"];

export const STORAGE_KEY = "verispend-audit-draft";

export function getToolMeta(id: AiToolId) {
  return AI_TOOLS.find((t) => t.id === id)!;
}
