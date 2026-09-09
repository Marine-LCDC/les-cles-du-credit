import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe/client";
import { sendAgentWelcomeEmail } from "@/lib/brevo/welcome-agent";
import {
  fieldsFromSubscription,
  syncAgentByCustomerId,
  syncAgentBySubscriptionId,
  upsertAgentFromStripe,
} from "@/lib/stripe/sync-agent";

export const runtime = "nodejs";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email =
    session.metadata?.agent_email ??
    session.customer_email ??
    session.customer_details?.email ??
    session.client_reference_id;

  if (!email) {
    throw new Error("checkout.session.completed sans email agent.");
  }

  const stripe = getStripe();
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    throw new Error("checkout.session.completed sans subscription.");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  const fields = fieldsFromSubscription(subscription, customerId);
  const { created } = await upsertAgentFromStripe({ email, fields });

  // Magic link via Brevo (template HTML côté app). Sans clé API : log seulement
  // pour ne pas bloquer les tests Stripe avant la config Brevo.
  if (!process.env.BREVO_API_KEY?.trim()) {
    console.warn(
      `[stripe] BREVO_API_KEY manquant — bienvenue non envoyée à ${email}.`,
    );
  } else {
    const { messageId } = await sendAgentWelcomeEmail({ email });
    console.info(
      `[stripe] Bienvenue Brevo envoyée à ${email} (messageId=${messageId}, created=${created}).`,
    );
  }

  console.info(
    `[stripe] Agent ${created ? "créé" : "mis à jour"} pour ${email} (${fields.subscription_status}).`,
  );
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const fields = fieldsFromSubscription(subscription);
  const syncedBySub = await syncAgentBySubscriptionId(subscription.id, fields);
  if (syncedBySub) return;

  if (fields.stripe_customer_id) {
    const syncedByCustomer = await syncAgentByCustomerId(
      fields.stripe_customer_id,
      fields,
    );
    if (syncedByCustomer) return;
  }

  const email =
    subscription.metadata?.agent_email?.trim().toLowerCase() ?? null;
  if (email) {
    await upsertAgentFromStripe({ email, fields });
    return;
  }

  console.warn(
    `[stripe] Abonnement ${subscription.id} sans agent local à synchroniser.`,
  );
}

export async function POST(request: Request) {
  let webhookSecret: string;
  try {
    webhookSecret = getStripeWebhookSecret();
  } catch {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET manquant.");
    return NextResponse.json(
      { error: "Webhook non configuré." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe/webhook] Signature invalide", error);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`[stripe/webhook] Erreur sur ${event.type}`, error);
    return NextResponse.json(
      { error: "Traitement webhook échoué." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
