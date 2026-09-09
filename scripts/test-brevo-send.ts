/**
 * Smoke test Brevo (sans Stripe / sans magic link Supabase).
 * Usage : npx tsx --env-file=.env.local scripts/test-brevo-send.ts [email]
 */
import { sendTransactionalEmail } from "../src/lib/brevo/client";
import { getBrevoSender } from "../src/lib/brevo/env";

async function main() {
  const to =
    process.argv[2]?.trim() ||
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    "info@lesclesducredit.fr";
  const sender = getBrevoSender();

  console.log(`Envoi test Brevo → ${to} (from ${sender.email})…`);

  const { messageId } = await sendTransactionalEmail({
    toEmail: to,
    subject: "Test Brevo — Les Clés du Crédit",
    htmlContent: `<p>Ceci est un <strong>e-mail de test</strong> transactionnel.</p>
<p>Si vous le recevez, l’API Brevo et l’expéditeur <code>${sender.email}</code> sont correctement configurés.</p>`,
    textContent: `Ceci est un e-mail de test transactionnel. Expéditeur : ${sender.email}`,
    tags: ["brevo-smoke-test"],
  });

  console.log(`OK — messageId=${messageId}`);
}

main().catch((error) => {
  console.error("Échec envoi Brevo:", error);
  process.exit(1);
});
