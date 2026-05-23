export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export function getResendApiKey(): string {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  return key;
}

export function getResendFromEmail(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("Missing RESEND_FROM_EMAIL");
  return from;
}
