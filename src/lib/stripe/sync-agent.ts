import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/admin";

export type SubscriptionFields = {
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string;
  subscription_current_period_end: string | null;
  subscription_price_id: string | null;
};

function periodEndIso(subscription: Stripe.Subscription): string | null {
  const end = subscription.items.data[0]?.current_period_end;
  if (!end) return null;
  return new Date(end * 1000).toISOString();
}

function priceIdFromSubscription(
  subscription: Stripe.Subscription,
): string | null {
  return subscription.items.data[0]?.price.id ?? null;
}

export function fieldsFromSubscription(
  subscription: Stripe.Subscription,
  customerId?: string | null,
): SubscriptionFields {
  const customer =
    customerId ??
    (typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id) ??
    null;

  return {
    stripe_customer_id: customer,
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    subscription_current_period_end: periodEndIso(subscription),
    subscription_price_id: priceIdFromSubscription(subscription),
  };
}

/**
 * Crée l'utilisateur Auth si besoin, puis synchronise la ligne agents.
 * L'email de bienvenue Brevo est prévu en phase 3.6.
 */
export async function upsertAgentFromStripe(params: {
  email: string;
  fields: SubscriptionFields;
}): Promise<{ userId: string; created: boolean }> {
  const email = params.email.trim().toLowerCase();
  if (!email) {
    throw new Error("Email agent manquant pour la synchronisation Stripe.");
  }

  const admin = createServiceClient();
  let userId: string | null = null;
  let created = false;

  const { data: existingAgent } = await admin
    .from("agents")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingAgent?.id) {
    userId = existingAgent.id;
  } else {
    const { data: createdUser, error: createError } =
      await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { source: "stripe_checkout" },
      });

    if (createError) {
      // Compte Auth déjà présent sans ligne agents (cas rare) : recherche par email
      const { data: listed, error: listError } =
        await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (listError) {
        throw new Error(
          `Création Auth impossible (${createError.message}) et listUsers a échoué.`,
        );
      }
      const match = listed.users.find(
        (u) => u.email?.toLowerCase() === email,
      );
      if (!match) {
        throw new Error(
          `Impossible de créer ou retrouver l'utilisateur Auth : ${createError.message}`,
        );
      }
      userId = match.id;
    } else if (createdUser.user) {
      userId = createdUser.user.id;
      created = true;
    }
  }

  if (!userId) {
    throw new Error("User ID introuvable après upsert Stripe.");
  }

  // Le trigger handle_new_user crée la ligne agents ; on attend un instant si besoin
  const { data: agentRow } = await admin
    .from("agents")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!agentRow) {
    const { error: insertError } = await admin.from("agents").insert({
      id: userId,
      email,
      ...params.fields,
    });
    if (insertError) {
      throw new Error(
        `Insertion agents impossible : ${insertError.message}`,
      );
    }
  } else {
    const { error: updateError } = await admin
      .from("agents")
      .update({
        email,
        ...params.fields,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      throw new Error(
        `Mise à jour agents impossible : ${updateError.message}`,
      );
    }
  }

  return { userId, created };
}

export async function syncAgentByCustomerId(
  customerId: string,
  fields: Omit<SubscriptionFields, "stripe_customer_id"> & {
    stripe_customer_id?: string | null;
  },
): Promise<boolean> {
  const admin = createServiceClient();
  const { data, error } = await admin
    .from("agents")
    .update({
      ...fields,
      stripe_customer_id: fields.stripe_customer_id ?? customerId,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId)
    .select("id");

  if (error) {
    throw new Error(`Sync customer ${customerId} : ${error.message}`);
  }

  return (data?.length ?? 0) > 0;
}

export async function syncAgentBySubscriptionId(
  subscriptionId: string,
  fields: SubscriptionFields,
): Promise<boolean> {
  const admin = createServiceClient();
  const { data, error } = await admin
    .from("agents")
    .update({
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId)
    .select("id");

  if (error) {
    throw new Error(`Sync subscription ${subscriptionId} : ${error.message}`);
  }

  return (data?.length ?? 0) > 0;
}
