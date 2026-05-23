import type { PublicAuditSnapshot } from "@/lib/audit/db/types";

export type AuditRow = {
  id: string;
  public_id: string;
  tool_count: number;
  tools: PublicAuditSnapshot["tools"];
  recommendations: PublicAuditSnapshot["recommendations"];
  total_monthly_spend_usd: number;
  total_monthly_savings_usd: number;
  total_annual_savings_usd: number;
  recommendation_count: number;
  overspend_detected: boolean;
  audited_at: string;
  created_at: string;
};

export type AuditInsert = {
  id?: string;
  public_id: string;
  tool_count: number;
  tools: PublicAuditSnapshot["tools"];
  recommendations: PublicAuditSnapshot["recommendations"];
  total_monthly_spend_usd: number;
  total_monthly_savings_usd: number;
  total_annual_savings_usd: number;
  recommendation_count: number;
  overspend_detected: boolean;
  audited_at: string;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      audits: {
        Row: AuditRow;
        Insert: AuditInsert;
        Update: Partial<AuditInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
