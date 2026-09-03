# Roadmap projet — Les Clés du Crédit

> Document de référence avec durées en heures par tâche.
> Complète [`plan-action-15-jours-lancement.md`](plan-action-15-jours-lancement.md).

**Total estimé : ~63 h Cursor + ~35,5 h de votre temps = ~98,5 h (~3 semaines)**

---

## Légende des durées

| Colonne | Signification |
|---------|---------------|
| **Cursor (h)** | Temps passé en session Cursor (génération IA + itérations techniques) |
| **Vous (h)** | Votre temps actif (arbitrages, validation, config comptes, tests) |
| **Total (h)** | Somme des deux — temps réel à bloquer dans votre agenda |

*Hypothèse : 1 session Cursor ≈ 2-4 h ; les tâches peuvent s'enchaîner sur la même journée.*

---

## Principe produit confirmé : aucun PDF

**Décision figée** : l'application ne génère, n'édite et ne télécharge **aucun PDF**.

| Qui | Ce qu'il voit |
|-----|---------------|
| **Visiteur / client** | Écran de résultat détaillé à l'écran (🟢 Visite recommandée / 🟠 Visite possible / 🔴 Visite peu conseillée + chiffres) — cf. [`ecran_resultat_vert_final.html`](ecran_resultat_vert_final.html) |
| **Agent immobilier** | **Même badge** 🟢/🟠/🔴 dans le **dashboard authentifié** + référence bien + identité visiteur — sans détail financier |

---

## Vue d'ensemble — toutes les tâches en heures

| # | Tâche | Cursor (h) | Vous (h) | Total (h) |
|---|-------|-----------:|---------:|----------:|
| **Phase 0** | | | | **3 h** |
| 0.1 | Trancher les 7 points métier | 0 | 2 | 2 |
| 0.2 | Réserver le nom de domaine | 0 | 0,25 | 0,25 |
| 0.3 | Créer Vercel + lier GitHub | 0 | 0,5 | 0,5 |
| 0.4 | Préparer logo / assets charte | 0 | 0,25 | 0,25 |
| **Phase 1** | | | | **~44 h** |
| 1.1 | Setup Next.js + charte + déploiement Vercel | 3 | 0,5 | 3,5 |
| 1.2 | Simulateur inversé complet | 3 | 1 | 4 |
| 1.3 | Moteur financier + 15 cas de test | 8 | 4 | 12 |
| 1.4 | Wizard faisabilité (7 étapes, 1-2 emprunteurs) | 10 | 2 | 12 |
| 1.5 | Écran résultat client (sans PDF) | 2 | 1 | 3 |
| 1.6 | QA mobile + 5 profils types + mentions légales | 3 | 3 | 6 |
| **Phase 2** | | | | **~8 h** |
| 2.1 | Recruter testeurs + partager URL | 0 | 1 | 1 |
| 2.2 | Tests terrain (3-5 personnes) | 0 | 4 | 4 |
| 2.3 | Corrections suite retours | 2 | 1 | 3 |
| 2.4 | Décision go/no-go Phase 3 | 0 | 0,5 | 0,5 |
| **Phase 3** | | | | **~47 h** |
| 3.1 | Créer Supabase + schema + RLS + auth magic link | 5 | 1,5 | 6,5 |
| 3.2 | Fiche bien agent + lien réutilisable | 4 | 1 | 5 |
| 3.3 | Formulaire visiteur 5 étapes (réutilise moteur) | 5 | 1 | 6 |
| 3.4 | Dashboard agent (signal badge) + compteur simulations | 4 | 1 | 5 |
| 3.5 | Stripe Checkout + webhook + produit abonnement | 4 | 2 | 6 |
| 3.6 | Brevo — email bienvenue agent + template | 2 | 1,5 | 3,5 |
| 3.7 | Page vente + landing + mentions légales en ligne | 4 | 2 | 6 |
| 3.8 | Connecter domaine + SPF/DKIM Brevo + Stripe live | 1 | 3 | 4 |
| 3.9 | QA bout en bout (parcours agent complet) | 3 | 2 | 5 |
| | **TOTAL** | **~63 h** | **~35,5 h** | **~98,5 h** |

**Calendrier réaliste : ~3 semaines** (en répartissant ~5-6 h/jour dont ~3 h Cursor + ~2 h vous).

---

## Comptes et infrastructure — quand les créer (avec durée)

| Outil | Quand | Vous (h) | Ce que vous fournissez à Cursor |
|-------|-------|---------:|----------------------------------|
| **Nom de domaine** | Phase 0 : réserver · Phase 3.8 : connecter | 0,25 + 1 | Nom choisi · accès DNS |
| **Vercel** | Phase 0 | 0,5 | Compte lié à GitHub |
| **Supabase** | Phase 3.1 | 1 | URL projet + clés `anon` et `service_role` |
| **Stripe** | Phase 3.5 (test) · 3.8 (live) | 1 + 0,5 | Clés test/live + Price ID 17 €/mois |
| **Brevo** | Phase 3.6 · 3.8 (SPF/DKIM) | 1 + 0,5 | Clé API + expéditeur vérifié |

---

## Phase 0 — Préparation

**Total : 3 h (votre temps uniquement — pas de session Cursor)**

| Tâche | Cursor (h) | Vous (h) | Total (h) |
|-------|-----------:|---------:|----------:|
| 0.1 Trancher 7 points métier (✅ **tous validés**) | 0 | 2 | 2 |
| 0.2 Réserver le nom de domaine | 0 | 0,25 | 0,25 |
| 0.3 Créer Vercel + lier GitHub | 0 | 0,5 | 0,5 |
| 0.4 Logo + assets charte | 0 | 0,25 | 0,25 |

---

## Phase 1 — Cœur produit testable (V1 publique)

**Total : ~44 h · Comptes requis : Vercel uniquement**

| Tâche | Cursor (h) | Vous (h) | Total (h) | Livrable |
|-------|-----------:|---------:|----------:|----------|
| **1.1 Setup** | 3 | 0,5 | 3,5 | App déployée sur `*.vercel.app` |
| **1.2 Simulateur inversé** | 3 | 1 | 4 | `/simulateur` fonctionnel |
| **1.3 Moteur financier** ⚠️ | 8 | 4 | 12 | 15 cas de test validés |
| **1.4 Wizard faisabilité** | 10 | 2 | 12 | `/faisabilite` 7 étapes |
| **1.5 Écran résultat** | 2 | 1 | 3 | Verdict visite prioritaire / possible / déconseillée à l'écran |
| **1.6 QA** | 3 | 3 | 6 | OK mobile + 5 profils types |

**Détail tâche 1.3 (non compressible) :**

| Sous-tâche | Cursor (h) | Vous (h) |
|------------|-----------:|---------:|
| Codage `revenus-retenus.ts` | 2 | 0,5 |
| Codage `calculs-globaux.ts` + `verdict.ts` | 2 | 0,5 |
| Rédaction 15 cas de test | 1 | 1 |
| Validation cas par cas avec dossiers réels | 2 | 2 |
| Corrections suite écarts | 1 | 0 |

---

## Phase 2 — Validation terrain

**Total : ~8 h · Comptes requis : Vercel uniquement**

| Tâche | Cursor (h) | Vous (h) | Total (h) |
|-------|-----------:|---------:|----------:|
| 2.1 Recruter 3-5 testeurs + envoyer URL | 0 | 1 | 1 |
| 2.2 Collecter retours (formulaire ou WhatsApp) | 0 | 4 | 4 |
| 2.3 Corrections prioritaires dans Cursor | 2 | 1 | 3 |
| 2.4 Décision go/no-go Phase 3 | 0 | 0,5 | 0,5 |

*Les 4 h de tests terrain peuvent s'étaler sur 3-5 jours calendaires (30-45 min/testeur).*

---

## Phase 3 — MVP agent B2B

**Total : ~47 h · Comptes : Supabase → Stripe → Brevo → domaine**

Architecture : [`plan-action-15-jours-lancement.md`](plan-action-15-jours-lancement.md) — Next.js + Vercel + Supabase + Stripe + Brevo.

| Tâche | Cursor (h) | Vous (h) | Total (h) | Compte |
|-------|-----------:|---------:|----------:|--------|
| **3.1 Supabase + auth + RLS** | 5 | 1,5 | 6,5 | Supabase |
| **3.2 Fiche bien + lien réutilisable** | 4 | 1 | 5 | — |
| **3.3 Formulaire visiteur 5 étapes** | 5 | 1 | 6 | — |
| **3.4 Dashboard agent + compteur** | 4 | 1 | 5 | — |
| **3.5 Stripe Checkout + webhook** | 4 | 2 | 6 | Stripe test |
| **3.6 Brevo email bienvenue** | 2 | 1,5 | 3,5 | Brevo |
| **3.7 Page vente + mentions légales** | 4 | 2 | 6 | — |
| **3.8 Domaine + SPF/DKIM + Stripe live** | 1 | 3 | 4 | Domaine |
| **3.9 QA bout en bout** | 3 | 2 | 5 | — |

**Test de bout en bout (3.9)** : abonnement → email Brevo → connexion → fiche bien → lien → simulation → résultat écran → signal dashboard.

---

## Synthèse par phase

| Phase | Cursor (h) | Vous (h) | Total (h) | Semaine indicative |
|-------|-----------:|---------:|----------:|-------------------|
| Phase 0 — Préparation | 0 | 3 | 3 | Semaine 0 |
| Phase 1 — V1 publique | 29 | 11,5 | 40,5 | Semaine 1 |
| Phase 2 — Tests terrain | 2 | 6,5 | 8,5 | Semaine 1-2 |
| Phase 3 — MVP agent | 32 | 15 | 47 | Semaine 2-3 |
| **TOTAL** | **~63 h** | **~35,5 h** | **~98,5 h** | **~3 semaines** |

---

## Prochaine action concrète

| Quand | Tâche | Durée |
|-------|-------|------:|
| **Aujourd'hui** | Phase 0 complète (arbitrages + domaine + Vercel) | 3 h |
| **Demain** | Phase 1.1 Setup Next.js + 1er déploiement | 3,5 h |
| **J+2** | Phase 1.2 Simulateur inversé | 4 h |
| **J+3 à J+4** | Phase 1.3 Moteur financier | 12 h |
