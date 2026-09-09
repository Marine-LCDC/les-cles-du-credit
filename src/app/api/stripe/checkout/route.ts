import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  parseCompanyBilling,
  type ParsedCompanyBilling,
} from "@/lib/billing/company-info";
import {
  getStripe,
  getStripeCouponId,
  getStripePriceId,
} from "@/lib/stripe/client";

export const runtime = "nodejs";

/** Origine de la page qui a lancé le checkout (localhost ou Vercel). */
function checkoutOrigin(request: Request): string {
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    try {
      return new URL(originHeader).origin;
    } catch {
      /* ignore */
    }
  }
  return new URL(request.url).origin;
}

async function upsertBillingCustomer(
  stripe: Stripe,
  data: ParsedCompanyBilling,
): Promise<string> {
  const metadata = {
    agent_email: data.email,
    siret: data.siret,
    company_name: data.companyName,
  };
  const address: Stripe.AddressParam = {
    line1: data.addressLine1,
    postal_code: data.postalCode,
    city: data.city,
    country: "FR",
  };

  const existing = await stripe.customers.list({
    email: data.email,
    limit: 1,
  });
  const customer = existing.data[0];

  if (customer) {
    await stripe.customers.update(customer.id, {
      name: data.companyName,
      email: data.email,
      address,
      metadata: {
        ...customer.metadata,
        ...metadata,
      },
    });

    const taxIds = await stripe.customers.listTaxIds(customer.id, { limit: 10 });
    const hasVat = taxIds.data.some(
      (taxId) =>
        taxId.type === "eu_vat" &&
        taxId.value.replace(/\s/g, "").toUpperCase() === data.vatNumber,
    );
    if (!hasVat) {
      try {
        await stripe.customers.createTaxId(customer.id, {
          type: "eu_vat",
          value: data.vatNumber,
        });
      } catch (taxError) {
        console.warn(
          "[stripe/checkout] Impossible d’ajouter le n° TVA au customer existant:",
          taxError,
        );
      }
    }

    return customer.id;
  }

  const created = await stripe.customers.create({
    name: data.companyName,
    email: data.email,
    address,
    metadata,
    tax_id_data: [{ type: "eu_vat", value: data.vatNumber }],
  });

  return created.id;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const parsed = parseCompanyBilling(
    (body ?? {}) as Parameters<typeof parseCompanyBilling>[0],
  );
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    console.error(
      "[stripe/checkout] STRIPE_SECRET_KEY ou STRIPE_PRICE_ID manquant dans l’environnement.",
    );
    return NextResponse.json(
      {
        error:
          "Paiement non configuré ici. Ajoutez STRIPE_SECRET_KEY et STRIPE_PRICE_ID dans .env.local, ou testez sur le déploiement Vercel.",
      },
      { status: 503 },
    );
  }

  try {
    const priceId = getStripePriceId();
    const couponId = getStripeCouponId();
    const stripe = getStripe();
    const origin = checkoutOrigin(request);
    const customerId = await upsertBillingCustomer(stripe, parsed.data);

    // Stripe interdit discounts + allow_promotion_codes en même temps.
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: parsed.data.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/abonnement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/abonnement?annule=1`,
      locale: "fr",
      ...(couponId
        ? { discounts: [{ coupon: couponId }] }
        : { allow_promotion_codes: true }),
      metadata: {
        agent_email: parsed.data.email,
        siret: parsed.data.siret,
        company_name: parsed.data.companyName,
      },
      subscription_data: {
        metadata: {
          agent_email: parsed.data.email,
          siret: parsed.data.siret,
          company_name: parsed.data.companyName,
        },
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
    const stripeMessage =
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
        ? (error as { message: string }).message
        : null;
    return NextResponse.json(
      {
        error: stripeMessage
          ? `Impossible de démarrer le paiement : ${stripeMessage}`
          : "Impossible de démarrer le paiement. Réessayez.",
      },
      { status: 500 },
    );
  }
}
