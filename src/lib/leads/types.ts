export type LeadInput = {
  auditPublicId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
};

export type LeadRow = {
  id: string;
  audit_public_id: string;
  email: string;
  company_name: string | null;
  role: string | null;
  team_size: number | null;
  ip_hash: string | null;
  created_at: string;
};

export type CreateLeadResult =
  | { ok: true; leadId: string; alreadyExists: boolean }
  | { ok: false; error: string };
