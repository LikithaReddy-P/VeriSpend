import { createHash } from "node:crypto";

/**
 * Extract client IP from proxy headers (Vercel, etc.).
 * Falls back to a sentinel when unavailable — still rate-limits as a group.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** One-way hash for storing IP on lead rows without keeping raw IPs long-term. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}
