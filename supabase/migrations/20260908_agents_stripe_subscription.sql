-- Phase 3.5 — Abonnement Stripe sur public.agents
-- (miroir de la migration appliquée via Supabase MCP)

alter table public.agents
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text not null default 'inactive',
  add column if not exists subscription_current_period_end timestamptz,
  add column if not exists subscription_price_id text;

alter table public.agents
  drop constraint if exists agents_subscription_status_check;

alter table public.agents
  add constraint agents_subscription_status_check
  check (
    subscription_status = any (
      array[
        'inactive'::text,
        'incomplete'::text,
        'trialing'::text,
        'active'::text,
        'past_due'::text,
        'canceled'::text,
        'unpaid'::text,
        'paused'::text
      ]
    )
  );

create unique index if not exists agents_stripe_customer_id_uidx
  on public.agents (stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists agents_stripe_subscription_id_uidx
  on public.agents (stripe_subscription_id)
  where stripe_subscription_id is not null;

comment on column public.agents.stripe_customer_id is 'Customer ID Stripe (cus_…)';
comment on column public.agents.stripe_subscription_id is 'Subscription ID Stripe (sub_…)';
comment on column public.agents.subscription_status is 'Statut abonnement Stripe synchronisé via webhook';
comment on column public.agents.subscription_current_period_end is 'Fin de période de facturation courante';
comment on column public.agents.subscription_price_id is 'Price ID Stripe actif (price_…)';

-- Agents déjà créés avant Stripe : accès conservé pendant la bascule
update public.agents
set subscription_status = 'active'
where stripe_customer_id is null
  and subscription_status = 'inactive';
