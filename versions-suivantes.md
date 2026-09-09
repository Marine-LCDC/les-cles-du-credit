# Versions suivantes — backlog produit

> Inventaire de ce qui **n’est pas** dans le focus actuel (agent immobilier + indication de visite).  
> À enrichir au fil des décisions. Complète [`roadmap-projet.md`](roadmap-projet.md), [`plan-action-15-jours-lancement.md`](plan-action-15-jours-lancement.md) et [`grille-tarifaire 23 juillet 2026.md`](grille-tarifaire%2023%20juillet%202026.md).

**Focus actuel :** parcours agent → fiche bien → simulation visiteur → verdict visite (🟢 / 🟠 / 🔴).  
**Ce document :** tout le reste — B2C, contenus, upsells, enrichissements agent, marketing.

---

## Comment utiliser ce fichier

- Une case = une intention produit à traiter dans une version ultérieure.
- Quand une idée est tranchée (quoi / pour qui / contrainte), la décrire ici même si le dev n’est pas planifié.
- Ne pas mélanger avec le travail en cours du MVP agent.

---

## 1. Lead magnet acquéreur — guide des chiffres (décision 7 sept. 2026)

### Contexte

Sur l’écran de résultat (`EcranResultat`), l’acquéreur voit une **couleur** et des **chiffres**, mais ne sait pas forcément comment les utiliser pour augmenter les chances que son dossier passe en banque.

L’ancien angle (CTA simulateur + opt-in « recevoir mon simulateur ») a été retiré du parcours faisabilité pour recentrer le MVP sur l’agent et la visite.

### Intention produit

| Élément | Décision |
|--------|----------|
| **Promesse** | Un document / guide qui explique les indicateurs affichés et **comment les jouer** pour renforcer le dossier |
| **Cible** | L’acquéreur devient un **prospect B2C**, distinct de l’offre agents immobiliers |
| **Offre ultérieure** | Produits et contenus différents de ceux vendus aux agents (voir §2) |
| **État actuel dans l’app** | Teaser uniquement (« bientôt disponible »), ton adapté au verdict VERT / ORANGE / ROUGE — **pas** de capture email |

### Tons du teaser (déjà en place, à réutiliser à l’activation)

- **Vert** : Bravo, dossier solide → donner toutes les chances au projet d’aboutir.
- **Orange** : Vous pouvez être finançable → lire / jouer les indicateurs pour renforcer le dossier.
- **Rouge** : Comprendre pourquoi le financement paraît difficile → comment progresser (formulation non jugeante, cf. `02-copywriting.md`).

### À faire plus tard (activation)

- [ ] Rédiger le contenu du guide (titre de travail possible : « Optimise tes chances d’obtenir un OUI » / guide des chiffres du résultat)
- [ ] Remplacer le teaser par une **capture email** (opt-in marketing, case décochée par défaut, non bloquante)
- [ ] Brancher l’envoi / la livraison via **Brevo** (lien de désinscription obligatoire)
- [ ] Adapter les textes légaux (`legal-copy`, page confidentialité) : finalité = guide + infos produits B2C, plus le simulateur comme seul lead magnet
- [ ] Prévoir la suite commerciale : ce prospect peut recevoir des offres **distinctes** de l’abonnement agent

### Hors de cette brique (ne pas confondre)

- Le **simulateur inversé** (`/simulateur`) reste un autre outil d’appel ; son opt-in email peut être réactivé séparément (voir §2).
- Aucun PDF généré par l’app (décision figée dans la roadmap) — le guide peut être page web, espace membre, ou fichier hébergé hors génération dynamique.

---

## 2. Tunnel B2C — produits acquéreur

Référence prix : [`grille-tarifaire 23 juillet 2026.md`](grille-tarifaire%2023%20juillet%202026.md).

⚠️ Ne pas activer de paiement B2C tant que CGV, renonciation au droit de rétractation et médiateur de la consommation ne sont pas en place.

- [ ] **Simulateur gratuit** : opt-in + envoi email réellement fonctionnel (aujourd’hui message « prochainement » côté `/simulateur`)
- [ ] **Simulateur d’estimation indicative** à 5 € (bien trouvé sur internet, disclaimer renforcé)
- [ ] **Guide** à 17 € (upsell) — peut se confondre ou s’aligner avec le lead magnet §1
- [ ] **Mini-formation** à 47 € (vidéos + livraison Brevo / espace membre)
- [ ] CGV e-commerce, case de renonciation express, médiateur
- [ ] Séquences email prospect B2C (relances, upsells)

---

## 3. Contenu pédagogique

- [ ] Rédiger le guide « Optimise tes chances d’obtenir un OUI » (ou équivalent guide des chiffres)
- [ ] Enregistrer 4–6 vidéos courtes (mini-formation)
- [ ] Espace membre / pages de contenu sur le site
- [ ] Livraison automatisée Brevo

---

## 4. Produit agent — enrichissements V2

Référence prix et packaging : [`grille-tarifaire 23 juillet 2026.md`](grille-tarifaire%2023%20juillet%202026.md) (décision 8 sept. 2026).

### 4.1 Portefeuille & multi-agents

- [ ] Gestion complète de portefeuille de biens (recherche, édition, archivage)
- [ ] Rôle « agence » multi-mandataires en self-service (sièges, invitations, vue consolidée des signaux)
- [ ] Option d’abonnement annuel (si confirmée)

### 4.2 Paliers tarifaires Solo / Agence / Réseau (décision 8 sept. 2026)

**Principe :** on ne distingue pas les clients par une case « Je suis solo / agence / réseau » à l’achat — c’est contournable. On distingue par **ce que le plan débloque** (sièges, quotas, features). Sans ça, rien n’empêche un réseau de souscrire au tarif solo.

**Prix cibles (indicatif, à calibrer avec l’usage réel observé) :**

| Plan | Prix juste | Sièges | Quota sim. / mois (ex.) | Différenciateurs |
|---|---|---|---|---|
| **Solo** | **~49 €/mois** (fourchette 39–59) | 1 | 30–50 | Dashboard perso uniquement |
| **Agence** | **~99–149 €/mois** | 2–5 | 150–300 | Vue équipe, biens / signaux partagés |
| **Réseau** | Sur devis / paliers élevés | Packs / illimité | Élevé ou metered | Multi-agences, admin, facturation centrale, support dédié |

**MVP actuel (rappel) :** un seul plan commercial — intro **27 €** (3 mois) → régime **47 €** (phases Stripe Dashboard). Pas de paliers à l’achat tant que multi-sièges n’existe pas. Une agence qui veut plusieurs agents = plusieurs abonnements individuels (ou rattachement manuel Stripe). Quota MVP : **40** simulations / mois.

**Ce qui empêche le spoofing du tarif solo (à construire en V2) :**

- [ ] Limite dure **1 siège** sur le plan Solo (pas de partage de compte autorisé — CGV + UX)
- [ ] Quotas différenciés par plan + **blocage / upgrade** au dépassement (plus seulement « contactez-nous »)
- [ ] Features Agence / Réseau absentes du Solo (vue consolidée, invitations, admin) — principal verrou produit
- [ ] CGV : interdiction de partage de compte ; droit de requalifier / résilier
- [ ] Signaux d’abus (volume biens / simulations, emails d’équipe) → nudge d’upgrade
- [ ] Facturation à l’usage automatisée (metered billing Stripe) au-delà d’un palier, une fois les seuils réels connus
- [ ] Page pricing / checkout multi-plans (Solo vs Agence vs contact Réseau)

**Ordre recommandé :** observer 4–8 semaines d’usage MVP → figer les seuils de quota → ship multi-sièges + plans → activer metered billing si besoin.

---

## 5. Marketing & acquisition (hors sprint agent)

- [ ] Instagram pour le tunnel B2C
- [ ] Contenu organique LinkedIn en régime de croisière
- [ ] Séquences Brevo prospects agents non convertis (si pas faites en MVP)

---

## 6. Légal / conformité à ne pas oublier

- [ ] Consultation avocat (libellés de visite, liaison acquéreur/bien, statut IOBSP) — déjà listé en cadrage, à suivre
- [ ] Vérifier qu’aucune réutilisation commerciale des données visite (prospection / revente de leads) sans consentement distinct
- [ ] Consentement distinct pour le lead magnet B2C vs finalité « suivi dossier / indication de visite » agent

---

## Journal des décisions reportées

| Date | Décision | Où c’est visible aujourd’hui |
|------|----------|------------------------------|
| 9 sept. 2026 | **Stripe live figé** — intro **27 €** × **3 mois** → régime **47 €** ; mécanique **C phases Dashboard** ; quota **40**/mois | [`grille-tarifaire 23 juillet 2026.md`](grille-tarifaire%2023%20juillet%202026.md), UI `/abonnement` + CGU, migration quota DB |
| 8 sept. 2026 | Avant Stripe live (3.8), options à trancher (49 vs 47, A/B/C, quota 40) — **tranché le 9 sept.** | Voir ligne du 9 sept. |
| 8 sept. 2026 | Abonnement agent : abandon 17→27 € ; hypothèse temporaire 29→49 remplacée le 9 sept. par **27→47** ; prix juste solo ~47–49 € (39–59) ; agence multi-usage ~99–149 € en V2 | [`grille-tarifaire 23 juillet 2026.md`](grille-tarifaire%2023%20juillet%202026.md), §4.2 ci-dessous, UI `/abonnement` |
| 7 sept. 2026 | Retrait CTA simulateur + opt-in sur `/faisabilite` ; teaser guide des chiffres selon verdict ; capture email + lead magnet plus tard | `src/app/faisabilite/components/EcranResultat.tsx` |
| 7 sept. 2026 | Phase 2 terrain clôturée — **GO Phase 3** (retours positifs sur l’app) | [`roadmap-projet.md`](roadmap-projet.md) |
