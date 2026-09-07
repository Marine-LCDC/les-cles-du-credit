-- Migration appliquée via Supabase MCP : init_agents_biens_simulations_rls
-- + harden_function_grants
-- Conservée ici pour l'historique local du repo.

-- Tables : agents, biens, simulations
-- RLS activée sur les 3 tables
-- RPC publiques : get_bien_public, enregistrer_simulation
-- RPC authentifiée : compteur_simulations_mois
-- Trigger : handle_new_user → agents
