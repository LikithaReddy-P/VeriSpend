import type { CreateLeadResult, LeadInput } from "@/lib/leads/types";
import { createServerSupabase } from "@/lib/supabase/server";
import type { LeadInsert } from "@/lib/supabase/database.types";

export async function createLead(
  input: LeadInput,
  ipHash: string
): Promise<CreateLeadResult> {
  const supabase = createServerSupabase();
  const normalizedEmail = input.email.trim().toLowerCase();

  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("audit_public_id", input.auditPublicId)
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existing) {
    return { ok: true, leadId: existing.id, alreadyExists: true };
  }

  const row: LeadInsert = {
    audit_public_id: input.auditPublicId,
    email: normalizedEmail,
    company_name: input.companyName?.trim() || null,
    role: input.role?.trim() || null,
    team_size: input.teamSize ?? null,
    ip_hash: ipHash,
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(row as LeadInsert)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: true, leadId: "", alreadyExists: true };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true, leadId: data.id, alreadyExists: false };
}
