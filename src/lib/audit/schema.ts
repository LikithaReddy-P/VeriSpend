import { z } from "zod";
import { AI_TOOL_IDS } from "@/lib/audit/constants";

const aiToolIdSchema = z.enum(AI_TOOL_IDS);

export const toolDetailSchema = z.object({
  id: aiToolIdSchema,
  plan: z.string().trim().min(1, "Enter your current plan"),
  monthlySpend: z
    .number({ message: "Enter a valid amount" })
    .min(0, "Spend must be zero or more"),
  seats: z
    .number({ message: "Enter a valid number" })
    .int("Seats must be a whole number")
    .min(1, "At least one seat"),
});

export const auditFormSchema = z.object({
  selectedToolIds: z
    .array(aiToolIdSchema)
    .min(1, "Select at least one AI tool"),
  toolDetails: z
    .array(toolDetailSchema)
    .min(1, "Add details for your selected tools"),
  teamSize: z
    .number({ message: "Enter team size" })
    .int("Team size must be a whole number")
    .min(1, "At least one person")
    .max(50_000, "Enter a realistic team size"),
  primaryUseCase: z.string().min(1, "Select your primary use case"),
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;
export type ToolDetailValues = z.infer<typeof toolDetailSchema>;

export const toolsStepSchema = auditFormSchema.pick({ selectedToolIds: true });
export const detailsStepSchema = auditFormSchema.pick({ toolDetails: true });
export const teamStepSchema = auditFormSchema.pick({ teamSize: true });
export const useCaseStepSchema = auditFormSchema.pick({ primaryUseCase: true });

export const defaultAuditFormValues: AuditFormValues = {
  selectedToolIds: [],
  toolDetails: [],
  teamSize: 12,
  primaryUseCase: "",
};

export function createEmptyToolDetail(id: z.infer<typeof aiToolIdSchema>): ToolDetailValues {
  return { id, plan: "", monthlySpend: 0, seats: 1 };
}

export function syncToolDetails(
  selectedIds: z.infer<typeof aiToolIdSchema>[],
  existing: ToolDetailValues[]
): ToolDetailValues[] {
  return selectedIds.map((id) => {
    const found = existing.find((d) => d.id === id);
    return found ?? createEmptyToolDetail(id);
  });
}
