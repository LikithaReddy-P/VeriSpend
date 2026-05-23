import { randomBytes } from "node:crypto";

const PUBLIC_ID_LENGTH = 12;
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

/**
 * Short URL-safe public audit ID (e.g. `k7m2p9xq4n1w`).
 */
export function generatePublicAuditId(): string {
  const bytes = randomBytes(PUBLIC_ID_LENGTH);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}
