# Grille tarifaire — Les Clés du Crédit

> Décision tarifaire agent mise à jour le **9 sept. 2026** (Stripe live 3.8 : 27 € → 47 €, phases Dashboard, quota 40).

## Vue d'ensemble

| Produit | Cible | Prix | Type | Statut MVP |
|---|---|---|---|---|
| Abonnement agent (lancement) | Agent immobilier (1 siège) | **27 €/mois** pendant **3 mois**, puis **47 €/mois** | Récurrent (Stripe Billing, phases produit), quota **40** simulations / mois | ✅ Inclus dans le MVP |
| Abonnement agent (régime / prix juste solo) | Mandataire solo | **47 €/mois** (ancre « sous 50 » ; fourchette valeur 39–59 €) | Récurrent — après l’intro | 🎯 En vigueur après mois 3 |
| Abonnement agence (multi-usage) | Petite agence / multi-agents | **~99–149 €/mois** | Récurrent — dès que multi-sièges + quota élargi existent | ⏸ V2 |
| Abonnement réseau | Enseigne / réseau | Sur devis / paliers élevés | Multi-agences, quotas élevés, support | ⏸ V2 |
| Simulateur de crédit inversé | Acquéreur | Gratuit | Lead magnet — collecte email + consentement | ⏸ Phase bonus (si le temps le permet) |
| Simulateur d'estimation indicative (biens trouvés sur internet) | Acquéreur | 5 € | Paiement unique — upsell après le simulateur gratuit | ⏸ Phase bonus |
| Guide "Optimise tes chances d'obtenir un OUI" | Acquéreur | 17 € | Paiement unique — upsell après le simulateur à 5 € | ⏸ Phase bonus / V2 |
| Mini-formation complémentaire | Acquéreur | 47 € | Paiement unique — upsell après le guide | ⏸ V2 |

---

## Abonnement agent — prix de lancement vs prix juste

### Prix de lancement (MVP / commercialisation immédiate)

Objectif : maximiser les **premières 10–20 souscriptions** et l’usage réel, pas maximiser le MRR du mois 1.

| Phase | Tarif | Durée / modalité |
|---|---|---|
| **Intro** | **27 €/mois** | **3 premiers mois** (Stripe : phases produit Dashboard — option C) |
| **Régime** | **47 €/mois** | À partir du 4ᵉ mois — affiché clairement dès `/abonnement` et Checkout |

### Décisions figées pour Stripe live (phase 3.8) — 9 sept. 2026

| Décision | Choix |
|---|---|
| Prix intro | **27 € / mois** |
| Prix régime | **47 € / mois** |
| Durée intro | **3 mois** |
| Mécanique | **C — phases produit Dashboard** (1 `STRIPE_PRICE_ID` = offre / phase de départ) |
| Quota | **40** simulations visiteurs vérifiables / mois |

**Config Stripe (option C) — à faire en mode test d’abord, puis live :**

1. Dashboard Stripe → **Products** → créer (ou éditer) le produit « Abonnement agent — Les Clés du Crédit ».
2. Ajouter une offre / prix avec **phases** (ou « pricing phases » / subscription schedule embarqué selon l’UI) :
   - Phase 1 : **27,00 €** TTC (ou HT selon votre régime fiscal), récurrence **mensuelle**, **3 itérations** ;
   - Phase 2 : **47,00 €**, mensuel, **indéfinie**.
3. Copier le `price_…` de la **phase de départ** (ou de l’offre) dans `STRIPE_PRICE_ID` (Vercel Production + `.env.local` si tests locaux).
4. Checkout test : souscrire avec une carte test → dans l’abonnement créé, vérifier qu’il y a bien **2 phases** (27 € × 3 puis 47 €).
5. Répéter en **mode live** avec les clés `pk_live_` / `sk_live_` et un endpoint webhook live pointant vers `https://www.lesclesducredit.fr/api/stripe/webhook`.

L’app Checkout reste en `mode: "subscription"` + un seul `line_items` price — Stripe applique les phases côté produit.

### Prix juste (produit mature, valeur prouvée)

| Profil | Prix juste mensuel | Commentaire |
|---|---|---|
| **Solo** (1 siège) | **~47–49 €/mois** (fourchette **39–59 €**) | Outil métier dédié ; ROI dès quelques visites inutiles évitées |
| **Petite agence** (multi-usage / multi-agents) | **~99–149 €/mois** | Plusieurs sièges + quota élargi + (à terme) vue équipe |
| **Réseau** | Au-delà, paliers / devis | Quotas élevés, admin, facturation centrale |

À ~47 €, le tarif solo reste cohérent avec la valeur (filtre opérationnel visite + moteur sérieux). Au-delà de ~79 € pour un solo **sans** multi-agents ni reporting agence, la friction de vente devient forte pour un produit encore jeune.

---

## Unité de facturation et packaging

Après réflexion, ni le nombre de mandataires ni le nombre de fiches biens créées ne reflètent correctement l'usage réel : un bien très demandé (plusieurs visiteurs sur un même lien réutilisable) génère beaucoup plus de valeur et de coût qu'un bien avec un seul visiteur. L'unité retenue reste le **nombre de simulations visiteur réellement complétées dans le mois**.

### MVP (maintenant)

- **Un seul plan commercial** : abonnement agent individuel (1 siège), intro **27 €** (3 mois) → régime **47 €**.
- Quota mensuel fixe : **40 simulations/mois**, identique pour tous.
- Pas de facturation à l'usage automatisée (pas de metered billing Stripe) — en cas de dépassement, message « contactez-nous », traitement manuel.
- Pas de distinction Solo / Agence / Réseau à l’achat : chaque agent souscrit individuellement. Une agence qui veut plusieurs comptes = plusieurs abonnements (ou rattachement manuel Stripe).

### V2 — distinguer Solo / Agence / Réseau sans se fier à une case à cocher

On ne vend pas un « statut déclaré » (solo vs réseau) : on vend **ce que le plan débloque**. Sinon rien n’empêche un réseau de prendre le tarif solo.

| Dimension | Solo | Petite agence | Réseau |
|---|---|---|---|
| **Sièges** (comptes agents) | 1 | 2–5 | Illimité ou packs |
| **Quota simulations / mois** | Bas / moyen (ex. 30–50) | Moyen (ex. 150–300) | Élevé / metered |
| **Fonctionnalités** | Dashboard perso | Vue équipe, biens partagés | Multi-agences, admin, SSO, facturation centrale |
| **Support** | Self-serve | Email | CSM / devis |
| **Prix indicatif** | ~49 € | ~99–149 € | Sur devis / paliers |

**Ce qui empêche le spoofing du tarif solo :**

1. Limite dure à **1 siège** — partage de compte = UX pourrie + risque ToS / RGPD.
2. **Quota** bas qui force l’upgrade dès que l’usage scale.
3. **Fonctionnalités absentes** (pas de multi-agents, pas de vue consolidée) — principal verrou produit.
4. **CGV** : interdiction de partage de compte ; droit de requalifier (backup, pas seul frein).
5. Signaux d’abus (trop de biens / simulations / emails d’équipe) → invitation à upgrader.

Tant que le multi-agents n’existe pas, les paliers Solo / Agence / Réseau à l’achat restent **prématurés** : plan unique + quota, observer l’usage, puis introduire les paliers.

Détail backlog : [`versions-suivantes.md`](versions-suivantes.md) §4.

---

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

**Panier moyen maximal si l'acquéreur prend tout : 69 €** (5 € + 17 € + 47 €) — bon repère de LTV potentiel par acquéreur, à garder en tête pour prioriser cette phase une fois le MVP agent lancé et validé.

---

## Points légaux à ne pas oublier (cf. fichier mentions légales)

- **Simulateur gratuit** : la case de consentement pour recevoir l'email doit rester décochée par défaut, et son absence ne doit jamais bloquer l'accès à l'outil gratuit lui-même.
- **Simulateur à 5 €, guide à 17 €, formation à 47 €** : ce sont des ventes directes à un consommateur (e-commerce B2C) → CGV obligatoires, droit de rétractation de 14 jours à écarter uniquement via une case de renonciation expresse avant paiement, médiateur de la consommation désigné.
- Chaque email envoyé dans ce tunnel (livraison du gratuit, relances, upsells) doit contenir un lien de désinscription obligatoire.

---

## Rappel MVP

Seul l'**abonnement agent (27 € × 3 mois → 47 € régime, quota 40)** est à construire et à commercialiser dans le sprint actuel. Un seul plan, un siège, quota fixe. L'ensemble du tunnel acquéreur (simulateur gratuit, 5 €, 17 €, 47 €) et les paliers Solo / Agence / Réseau restent en phase bonus / V2 — à activer uniquement si le temps le permet (B2C) ou une fois l’usage réel observé (paliers), et seulement une fois la conformité e-commerce en place pour le B2C.
