# Grille tarifaire — Les Clés du Crédit

## Vue d'ensemble

| Produit | Cible | Prix | Type | Statut MVP |
|---|---|---|---|---|
| Abonnement agence | Agent immobilier | 17 €/mois les 6 premiers mois, puis 27 €/mois | Récurrent (Stripe Billing), quota de simulations visiteur inclus | ✅ Inclus dans le MVP |
| Simulateur de crédit inversé | Acquéreur | Gratuit | Lead magnet — collecte email + consentement | ⏸ Phase bonus (si le temps le permet) |
| Simulateur d'estimation indicative (biens trouvés sur internet) | Acquéreur | 5 € | Paiement unique — upsell après le simulateur gratuit | ⏸ Phase bonus |
| Guide "Optimise tes chances d'obtenir un OUI" | Acquéreur | 17 € | Paiement unique — upsell après le simulateur à 5 € | ⏸ Phase bonus / V2 |
| Mini-formation complémentaire | Acquéreur | 47 € | Paiement unique — upsell après le guide | ⏸ V2 |

---

## Unité de facturation retenue pour l'abonnement agence

Après réflexion, ni le nombre de mandataires ni le nombre de fiches biens créées ne reflètent correctement l'usage réel : un bien très demandé (plusieurs visiteurs sur un même lien réutilisable) génère beaucoup plus de valeur et de coût qu'un bien avec un seul visiteur, sans que ça se voie dans un compteur de fiches. L'unité retenue est donc le **nombre de simulations visiteur réellement complétées dans le mois**, quel que soit le nombre de biens, de mandataires ou de liens à l'origine.

- **Pour le MVP** : un quota mensuel généreux et fixe pour tous (ex. 50 simulations/mois), identique quelle que soit la taille de l'agence. Pas de facturation à l'usage automatisée (pas de metered billing Stripe) — en cas de dépassement, un message invite l'agence à vous contacter, géré manuellement le temps d'avoir de la vraie donnée sur les niveaux de consommation réels.
- **En V2**, une fois les seuils réels observés sur plusieurs semaines d'usage : mise en place de paliers tarifaires (ex. Solo / Agence / Réseau) basés sur ces quotas de simulations, avec éventuellement une facturation à l'usage automatisée au-delà d'un palier.



## Détail du tunnel acquéreur

### 1. Simulateur de crédit inversé — Gratuit
Permet de calculer n'importe quelle variable (capital empruntable, taux, durée, mensualité) à partir des trois autres. Objectif : **outil d'appel**, pas un produit rentable en soi. Sa vraie fonction est de récupérer l'email de l'acquéreur et son consentement pour être recontacté, avec une case à cocher dédiée (cf. section légale ci-dessous).

### 2. Simulateur d'estimation indicative — 5 €
Différent du simulateur lié au bien de l'agent. Ici, l'acquéreur renseigne **lui-même** le prix d'un bien qu'il a trouvé sur internet (petites annonces, sites d'agences, etc.) et l'outil lui donne un ordre d'idée sur sa capacité d'emprunt face à ce prix. **Aucune vérification n'est faite sur ce prix** (contrairement au simulateur agence où le prix vient d'une fiche bien réelle) — c'est un outil d'estimation personnelle, pas un outil de pré-qualification pour une transaction en cours.

⚠️ **Disclaimer renforcé nécessaire** pour ce produit, plus insistant encore que pour le simulateur agence : *"Cette estimation est fournie à titre purement indicatif, à partir d'un prix que vous avez renseigné vous-même sans vérification. Elle n'a aucune valeur autre qu'un ordre d'idée personnel et ne constitue ni une évaluation bancaire, ni un conseil en financement."*

### 3. Guide "Optimise tes chances d'obtenir un OUI" — 17 €
Upsell immédiat après l'achat du simulateur à 5 €. Contenu pédagogique en ligne sur le fonctionnement bancaire et les leviers pour optimiser un dossier de crédit.

### 4. Mini-formation — 47 €
Upsell supplémentaire, reprend les éléments du guide en format vidéo/plus interactif.

**Panier moyen maximal si l'acquéreur prend tout : 69 €** (5 € + 17 € + 47 €) — bon repère de LTV potentiel par acquéreur, à garder en tête pour prioriser cette phase une fois le MVP agence lancé et validé.

---

## Points légaux à ne pas oublier (cf. fichier mentions légales)

- **Simulateur gratuit** : la case de consentement pour recevoir l'email doit rester décochée par défaut, et son absence ne doit jamais bloquer l'accès à l'outil gratuit lui-même.
- **Simulateur à 5 €, guide à 17 €, formation à 47 €** : ce sont des ventes directes à un consommateur (e-commerce B2C) → CGV obligatoires, droit de rétractation de 14 jours à écarter uniquement via une case de renonciation expresse avant paiement, médiateur de la consommation désigné.
- Chaque email envoyé dans ce tunnel (livraison du gratuit, relances, upsells) doit contenir un lien de désinscription obligatoire.

---

## Rappel MVP

Seul l'**abonnement agence (17 € → 27 €)** est à construire et à commercialiser dans les 15 jours. L'ensemble du tunnel acquéreur (simulateur gratuit, 5 €, 17 €, 47 €) reste en phase bonus — à activer uniquement si le temps le permet, et seulement une fois la conformité e-commerce (CGV, rétractation, médiateur) en place.
