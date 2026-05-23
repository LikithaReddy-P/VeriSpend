/**
 * Lightweight in-memory rate limiting for API abuse protection (MVP).
 *
 * APPROACH:
 * - Tracks request counts per hashed client IP in a sliding window.
 * - Combined with honeypot validation on lead forms (see /api/leads).
 *
 * LIMITATIONS (document for production):
 * - Serverless platforms (e.g. Vercel) spin up multiple instances; each has its
 *   own memory — limits are best-effort, not global.
 * - Memory resets on cold starts.
 *
 * PRODUCTION UPGRADE:
 * - Replace with Redis / Upstash / Vercel KV for distributed rate limits.
 * - Or enforce limits in Supabase via Edge Functions + IP tables.
 */

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const store = new Map<string, RateLimitEntry>();

export type RateLimitConfig = {
  /** Max requests allowed within the window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
};

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterMs: number };

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= config.windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: config.limit - 1 };
  }

  if (entry.count >= config.limit) {
    const retryAfterMs = config.windowMs - (now - entry.windowStart);
    return { allowed: false, retryAfterMs };
  }

  entry.count += 1;
  return { allowed: true, remaining: config.limit - entry.count };
}

/** Lead endpoint: 5 submissions per IP per hour (best-effort). */
export const LEAD_RATE_LIMIT: RateLimitConfig = {
  limit: 5,
  windowMs: 60 * 60 * 1000,
};
