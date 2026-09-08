import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeSecretKey(): string {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Variable STRIPE_SECRET_KEY requise.");
  }
  return secretKey;
}

export function getStripePriceId(): string {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    throw new Error("Variable STRIPE_PRICE_ID requise.");
  }
  return priceId;
}

export function getStripeWebhookSecret(): string {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Variable STRIPE_WEBHOOK_SECRET requise.");
  }
  return webhookSecret;
}

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;
  stripeClient = new Stripe(getStripeSecretKey());
  return stripeClient;
}
