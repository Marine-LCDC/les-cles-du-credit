-- Quota MVP figé : 40 simulations / mois (décision tarifaire 9 sept. 2026)
ALTER TABLE public.agents
  ALTER COLUMN simulations_quota_mensuel SET DEFAULT 40;

UPDATE public.agents
SET simulations_quota_mensuel = 40
WHERE simulations_quota_mensuel = 50;

CREATE OR REPLACE FUNCTION public.compteur_simulations_mois()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  uid uuid := auth.uid();
  v_count integer;
  v_quota integer;
begin
  if uid is null then
    raise exception 'Non authentifié';
  end if;

  select simulations_quota_mensuel into v_quota
  from public.agents
  where id = uid;

  select count(*)::integer into v_count
  from public.simulations
  where agent_id = uid
    and created_at >= date_trunc('month', now() at time zone 'Europe/Paris')
    and created_at < date_trunc('month', now() at time zone 'Europe/Paris') + interval '1 month';

  return jsonb_build_object(
    'count', coalesce(v_count, 0),
    'quota', coalesce(v_quota, 40)
  );
end;
$function$;
