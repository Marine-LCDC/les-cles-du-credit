import { NextResponse } from "next/server";
import { getStripe, getStripePriceId } from "@/lib/stripe/client";

export const runtime = "nodejs";

type CheckoutBody = {
  email?: string;
};

function appOrigin(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Adresse e-mail professionnelle requise." },
      { status: 400 },
    );
  }

  try {
    const priceId = getStripePriceId();
    const stripe = getStripe();
    const origin = appOrigin(request);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      client_reference_id: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/abonnement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/abonnement?annule=1`,
      locale: "fr",
      allow_promotion_codes: true,
      metadata: { agent_email: email },
      subscription_data: {
        metadata: { agent_email: email },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Session Checkout sans URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/checkout]", error);
    return NextResponse.json(
      { error: "Impossible de démarrer le paiement. Réessayez." },
      { status: 500 },
    );
  }
}
