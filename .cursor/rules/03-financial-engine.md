# Moteur de Calcul Financier, Logique Métier & Quotas — Les Clés du Crédit

> **Source de vérité unique** des règles financières et décisionnelles (Phase 0 point 7).  
> `perimetre-mvp` décrit le périmètre produit (collecte / affichage) — en cas de contradiction, **ce fichier l'emporte**.  
> Chaque règle est qualifiée : `HCSF` | `BANKING_PRACTICE` | `MARKET_PARAMETER` | `ENGINE_PRUDENTIAL_RULE`.

## 1. Unité de Comptage & Quotas Abonnement
- **Unité de mesure** : L'unité de facturation est le **nombre de simulations visiteur réellement complétées dans le mois** (et non le nombre de fiches biens ni de mandataires)[cite: 4, 5].
- **Quota MVP** : Quota mensuel fixe de **50 simulations complétées par mois et par agence**[cite: 4, 5].
- **Dépassement de quota (MVP)** : Pas de blocage automatisé complexe ni de facturation Stripe à l'usage[cite: 4, 5]. En cas de dépassement des 50 simulations, afficher un message d'avertissement invitant l'agence à contacter le support[cite: 4, 5].

---

## 2. Constantes Financières Métier
- **Plafond d'effort HCSF (référence réglementaire)** : 35 % — voir §2bis.
- **Frais d'acquisition estimés (MVP)** : taux d'estimation initiale **7,5 % (ancien)** / **2,5 % (neuf / VEFA)** — estimations MVP, **pas** des valeurs juridiquement exactes. Voir §2ter.
- **Coefficient locatif** (hypothèse bancaire prudente, **pas** une norme légale HCSF) : `0,70` par défaut, **paramétrable**.
  $$\text{revenu\_locatif\_retenu} = \text{loyer} \times \text{coefficient\_locatif}$$
- **Décote sur dividendes** : −100 % (0 % retenus).
- **Marge de frais de revente** (pour calculer le produit net d'une revente de bien actuel) : 7 %.

---

PLACEHOLDER_CONTINUE