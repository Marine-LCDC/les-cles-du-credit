import { getBrevoApiKey, getBrevoSender } from "./env";

const BREVO_SMTP_URL = "https://api.brevo.com/v3/smtp/email";

export type SendTransactionalEmailInput = {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  tags?: string[];
};

export type SendTransactionalEmailResult = {
  messageId: string;
};

/**
 * Envoi transactionnel via l'API HTTP Brevo (sans SDK).
 * L'expéditeur doit être vérifié dans le compte Brevo.
 */
export async function sendTransactionalEmail(
  input: SendTransactionalEmailInput,
): Promise<SendTransactionalEmailResult> {
  const sender = getBrevoSender();
  const response = await fetch(BREVO_SMTP_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": getBrevoApiKey(),
    },
    body: JSON.stringify({
      sender,
      replyTo: sender,
      to: [{ email: input.toEmail, name: input.toName }],
      subject: input.subject,
      htmlContent: input.htmlContent,
      textContent: input.textContent,
      tags: input.tags,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Brevo SMTP ${response.status} : ${body.slice(0, 400) || response.statusText}`,
    );
  }

  const data = (await response.json()) as { messageId?: string };
  if (!data.messageId) {
    throw new Error("Brevo n'a pas renvoyé de messageId.");
  }

  return { messageId: data.messageId };
}
