/**
 * Test email de bienvenue agent + magic link (Brevo + Supabase).
 * Usage : npx tsx --env-file=.env.local scripts/test-brevo-welcome.ts email@example.com
 */
import { createServiceClient } from "../src/lib/supabase/admin";
import { sendAgentWelcomeEmail } from "../src/lib/brevo/welcome-agent";

async function ensureAuthUser(email: string): Promise<void> {
  const admin = createServiceClient();
  const { data: listed, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listError) {
    throw new Error(`listUsers : ${listError.message}`);
  }

  const existing = listed.users.find((u) => u.email?.toLowerCase() === email);
  if (existing) return;

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { source: "brevo_welcome_test" },
  });
  if (createError) {
    throw new Error(`createUser : ${createError.message}`);
  }
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("Usage : npx tsx --env-file=.env.local scripts/test-brevo-welcome.ts email@example.com");
    process.exit(1);
  }

  console.log(`Préparation compte Auth pour ${email}…`);
  await ensureAuthUser(email);

  console.log("Envoi bienvenue Brevo + magic link…");
  const { messageId } = await sendAgentWelcomeEmail({ email });
  console.log(`OK — messageId=${messageId}`);
  console.log("Ouvre la boîte mail et clique « Ouvrir mon espace agent » (localhost:3000).");
}

main().catch((error) => {
  console.error("Échec:", error);
  process.exit(1);
});
