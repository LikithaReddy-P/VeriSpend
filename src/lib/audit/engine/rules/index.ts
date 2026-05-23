import { chatgptTeamToPlusRule } from "@/lib/audit/engine/rules/chatgpt";
import { claudeTeamToProRule } from "@/lib/audit/engine/rules/claude";
import { copilotUnusedSeatsRule } from "@/lib/audit/engine/rules/copilot";
import {
  dualChatLlmConsolidationRule,
  ideStackConsolidationRule,
} from "@/lib/audit/engine/rules/consolidation";
import { cursorBusinessToProRule } from "@/lib/audit/engine/rules/cursor";
import { geminiUltraToProRule } from "@/lib/audit/engine/rules/gemini";
import { windsurfTeamsToProRule } from "@/lib/audit/engine/rules/windsurf";
import type { AuditRule } from "@/lib/audit/engine/types";

/** Per-tool plan and seat rules — evaluated first. */
export const TOOL_RULES: AuditRule[] = [
  chatgptTeamToPlusRule,
  claudeTeamToProRule,
  cursorBusinessToProRule,
  copilotUnusedSeatsRule,
  geminiUltraToProRule,
  windsurfTeamsToProRule,
].sort((a, b) => a.priority - b.priority);

/** Cross-stack consolidation rules — evaluated after tool rules. */
export const CONSOLIDATION_RULES: AuditRule[] = [
  ideStackConsolidationRule,
  dualChatLlmConsolidationRule,
].sort((a, b) => a.priority - b.priority);

export const ALL_AUDIT_RULES: AuditRule[] = [
  ...TOOL_RULES,
  ...CONSOLIDATION_RULES,
];
