import { ImageResponse } from "next/og";
import { getSharedAudit } from "@/lib/audit/get-shared-audit";
import { formatUsd } from "@/lib/currency";
import { site } from "@/lib/site";
import { LOW_SAVINGS_THRESHOLD_USD } from "@/lib/audit/results-constants";

export const alt = "VeriSpend AI spend audit savings summary";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgImageProps = {
  params: Promise<{ id: string }>;
};

export default async function AuditOgImage({ params }: OgImageProps) {
  const { id } = await params;
  const audit = await getSharedAudit(id);

  const monthlySavings =
    audit?.snapshot.summary.totalMonthlySavingsUsd ?? 0;
  const annualSavings =
    audit?.snapshot.summary.totalAnnualSavingsUsd ?? 0;
  const toolCount = audit?.snapshot.toolCount ?? 0;
  const monthlySpend =
    audit?.snapshot.summary.totalMonthlySpendUsd ?? 0;
  const hasSavings = monthlySavings >= LOW_SAVINGS_THRESHOLD_USD;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "linear-gradient(145deg, #0f0f14 0%, #1a1528 45%, #0d1117 100%)",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            V
          </div>
          <span style={{ fontSize: 28, fontWeight: 600 }}>{site.name}</span>
          <span
            style={{
              fontSize: 18,
              color: "#94a3b8",
              marginLeft: "auto",
            }}
          >
            AI spend audit
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {hasSavings ? (
            <>
              <span
                style={{
                  fontSize: 22,
                  color: "#6ee7b7",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Estimated recoverable spend
              </span>
              <span
                style={{
                  fontSize: 96,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "#34d399",
                  letterSpacing: "-0.03em",
                }}
              >
                {formatUsd(annualSavings)}
                <span style={{ fontSize: 40, color: "#6ee7b7" }}>/year</span>
              </span>
              <span style={{ fontSize: 32, color: "#cbd5e1" }}>
                {formatUsd(monthlySavings)}/month · {toolCount}{" "}
                {toolCount === 1 ? "tool" : "tools"}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1 }}>
                AI stack audit
              </span>
              <span style={{ fontSize: 28, color: "#94a3b8" }}>
                {toolCount} {toolCount === 1 ? "tool" : "tools"} ·{" "}
                {formatUsd(monthlySpend)}/mo analyzed
              </span>
              <span style={{ fontSize: 24, color: "#64748b" }}>
                Finance-grade spend insights
              </span>
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <span>{site.tagline}</span>
          <span>verispend.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
