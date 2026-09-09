import { createServiceClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "./client";
import { BREVO_DEFAULT_SENDER_EMAIL, getAppUrl } from "./env";

const SUBJECT = "Votre accès Les Clés du Crédit est prêt";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildWelcomeHtml(params: {
  loginUrl: string;
  appUrl: string;
}): string {
  const loginUrl = escapeHtml(params.loginUrl);
  const appUrl = escapeHtml(params.appUrl);
  const contact = escapeHtml(BREVO_DEFAULT_SENDER_EMAIL);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background:#F5EFE3;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#33322E;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F5EFE3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 8px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#2E7D6B;font-weight:600;">
              Les Clés du Crédit
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0;font-size:22px;line-height:1.35;font-weight:600;color:#33322E;">
              Votre espace agent est prêt
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 0;font-size:16px;line-height:1.55;color:#5C5A54;">
              Merci pour votre abonnement. Un clic suffit pour ouvrir votre tableau de bord et créer votre première fiche bien.
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;" align="center">
              <a href="${loginUrl}" style="display:inline-block;background:#2E7D6B;color:#FFFFFF;text-decoration:none;font-size:16px;font-weight:600;padding:14px 28px;border-radius:12px;">
                Ouvrir mon espace agent
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 0;font-size:14px;line-height:1.5;color:#5C5A54;">
              Ce lien de connexion est personnel et à durée limitée. Si le bouton ne fonctionne pas, copiez cette adresse dans votre navigateur&nbsp;:<br />
              <a href="${loginUrl}" style="color:#2E7D6B;word-break:break-all;">${loginUrl}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 28px;font-size:13px;line-height:1.5;color:#5C5A54;border-top:1px solid #E8E2D6;margin-top:24px;">
              Besoin d’aide&nbsp;? Écrivez-nous à
              <a href="mailto:${contact}" style="color:#2E7D6B;">${contact}</a>.<br />
              <a href="${appUrl}/connexion" style="color:#2E7D6B;">Demander un nouveau lien</a>
              si celui-ci a expiré.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildWelcomeText(params: {
  loginUrl: string;
  appUrl: string;
}): string {
  return [
    "Les Clés du Crédit — Votre espace agent est prêt",
    "",
    "Merci pour votre abonnement. Ouvrez votre tableau de bord avec ce lien de connexion :",
    params.loginUrl,
    "",
    `Si le lien a expiré, demandez-en un nouveau : ${params.appUrl}/connexion`,
    "",
    `Besoin d’aide ? ${BREVO_DEFAULT_SENDER_EMAIL}`,
  ].join("\n");
}

/**
 * Génère un magic link Supabase et l'envoie via Brevo (sans e-mail natif Supabase).
 */
export async function sendAgentWelcomeEmail(params: {
  email: string;
}): Promise<{ messageId: string }> {
  const email = params.email.trim().toLowerCase();
  const appUrl = getAppUrl();
  const admin = createServiceClient();

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent("/espace-agent")}`,
    },
  });

  if (error) {
    throw new Error(`generateLink magiclink : ${error.message}`);
  }

  const tokenHash = data.properties.hashed_token;
  if (!tokenHash) {
    throw new Error("generateLink sans hashed_token.");
  }

  const loginUrl =
    `${appUrl}/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}` +
    `&type=magiclink&next=${encodeURIComponent("/espace-agent")}`;

  return sendTransactionalEmail({
    toEmail: email,
    subject: SUBJECT,
    htmlContent: buildWelcomeHtml({ loginUrl, appUrl }),
    textContent: buildWelcomeText({ loginUrl, appUrl }),
    tags: ["agent-welcome"],
  });
}
