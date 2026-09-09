/** Expéditeur transactionnel — aligné sur la boîte Gmail Workspace. */
export const BREVO_DEFAULT_SENDER_EMAIL = "info@lesclesducredit.fr";
export const BREVO_DEFAULT_SENDER_NAME = "Les Clés du Crédit";

export function getBrevoApiKey(): string {
  const key = process.env.BREVO_API_KEY?.trim();
  if (!key) {
    throw new Error("Variable BREVO_API_KEY requise.");
  }
  return key;
}

export function getBrevoSender(): { email: string; name: string } {
  return {
    email:
      process.env.BREVO_SENDER_EMAIL?.trim() || BREVO_DEFAULT_SENDER_EMAIL,
    name: process.env.BREVO_SENDER_NAME?.trim() || BREVO_DEFAULT_SENDER_NAME,
  };
}

export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim();
  if (!url) {
    throw new Error(
      "Variable NEXT_PUBLIC_APP_URL requise pour les liens e-mail.",
    );
  }
  return url;
}
