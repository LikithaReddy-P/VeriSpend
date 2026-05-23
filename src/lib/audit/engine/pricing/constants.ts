/**
 * Reference list prices (USD / month) for deterministic audit logic.
 * Sources: public vendor pricing pages; rounded for conservative estimates.
 * Update deliberately when vendors change list prices — not fetched at runtime.
 */
export const PRICING_LAST_UPDATED = "2026-03-01";

export const USD_PER_YEAR = 12;

/** ChatGPT — openai.com/chatgpt/pricing */
export const CHATGPT_PRICING = {
  plusPerSeat: 20,
  teamPerSeat: 30,
  teamMinSeats: 2,
  enterprisePerSeat: 60, // conservative placeholder for modeling
} as const;

/** Claude — anthropic.com/pricing */
export const CLAUDE_PRICING = {
  proPerSeat: 20,
  teamPerSeat: 30,
  teamMinSeats: 5,
  enterprisePerSeat: 50,
} as const;

/** Cursor — cursor.com/pricing */
export const CURSOR_PRICING = {
  proPerSeat: 20,
  businessPerSeat: 40,
  businessMinSeats: 1,
} as const;

/** GitHub Copilot — github.com/features/copilot/plans */
export const COPILOT_PRICING = {
  individualPerSeat: 10,
  businessPerSeat: 19,
  enterprisePerSeat: 39,
} as const;

/** Google Gemini consumer/workspace AI */
export const GEMINI_PRICING = {
  proPerSeat: 20,
  ultraPerSeat: 250,
  workspacePerSeat: 20,
} as const;

/** Windsurf (Codeium) — codeium.com/pricing */
export const WINDSURF_PRICING = {
  proPerSeat: 15,
  teamsPerSeat: 30,
  enterprisePerSeat: 60,
} as const;

/** Heuristics for overlap / consolidation modeling */
export const CONSOLIDATION_HEURISTICS = {
  /** Minimum combined monthly spend before suggesting IDE stack consolidation */
  ideStackMinCombinedSpend: 150,
  /** Minimum combined spend before suggesting dual chat-LLM review */
  chatLlmMinCombinedSpend: 200,
  /** Conservative % of the lower-cost overlapping tool treated as recoverable */
  overlapRecoverableRatio: 0.35,
} as const;

/** Seat utilization assumptions when usage data is unavailable */
export const SEAT_HEURISTICS = {
  /** Flag Copilot seats above this ratio of team size as likely unused */
  copilotSeatToTeamRatio: 0.75,
  /** Small team threshold for business-tier IDE downgrade rules */
  smallTeamMaxSize: 10,
  /** Max seats for ChatGPT Team → Plus downgrade rule */
  chatgptTeamPlusMaxSeats: 2,
  /** Max seats for Cursor Business → Pro downgrade rule */
  cursorBusinessProMaxSeats: 5,
} as const;
