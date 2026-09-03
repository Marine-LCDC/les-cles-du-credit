# Plan d'action — 15 jours pour la première vente (version mise à jour)

**Objectif du sprint :** vendre le premier abonnement agence. Le reste (tunnel B2C, formation, gestion de portefeuille de biens) reste en phase bonus ou en V2.

**Ce qui a changé depuis la version initiale de ce plan :**
- ✅ Une bonne partie du cadrage (Phase 1) est **déjà faite** grâce à nos échanges : périmètre MVP détaillé, charte graphique, guide de copywriting, mentions légales, parcours client schématisé, grille tarifaire. Le temps gagné ici est réinjecté dans le développement, dont le périmètre s'est un peu étoffé (lignes dynamiques, ajustement notaire, moteur de calcul par catégorie professionnelle précis).
- ✅ L'adresse complète du bien reste interne à l'agent ; seuls la ville et la référence sont montrées au client.
- ✅ Le lien généré par l'agent est unique **par bien**, réutilisable pour plusieurs visiteurs.
- ✅ Facturation au nombre de simulations visiteur complétées/mois (quota souple, pas de metered billing pour le MVP), pas au nombre de mandataires ni de fiches biens.

**Documents déjà prêts à donner à Cursor** (produits pendant notre échange, à consulter dans cet ordre) :
1. `perimetre-mvp.md` — périmètre fonctionnel détaillé, champs, moteur de verdict, rôles/accès, quota
2. `parcours-client.md` — parcours rédigé + schéma Mermaid
3. `charte-graphique.md` — couleurs, typographie, principes UX/UI
4. `guide-copywriting.md` — ton, formulations, exemples de textes
5. `mentions-legales-version-finale.md` — disclaimers, RGPD, mentions légales
6. `grille-tarifaire.md` — tarifs et logique du tunnel B2C (phase bonus)

---

## Architecture technique retenue

| Brique | Outil | Rôle |
|---|---|---|
| App simulateur + dashboard agent + site vitrine + pages de vente/capture | Code custom (Cursor + Claude) | Le produit et le marketing |
| Hébergement | Vercel (ou Netlify) | Simple, gratuit au début, scalable |
| Paiements (abonnement agent + ventes B2C phase bonus) | Stripe (Checkout + Billing), intégré directement à l'app | Facturation récurrente et one-shot |
| Emails transactionnels et marketing | Brevo | Bienvenue agent, onboarding, séquences prospects, livraison contenu |
| Base de données | Supabase | Comptes agents (RLS activée), fiches biens, triptyque acquéreur/bien/indication de visite, compteur de simulations |

**Stack unifiée :** tout est développé et hébergé sur la même application Next.js — simulateur, dashboard agent, site vitrine, tunnel de vente, pages de capture et intégrations Stripe/Brevo. Pas d'outil externe de funnel.

---

## PHASE 1 — Cadrage (J1) — largement déjà fait

### J1 — Finalisation et derniers arbitrages
- [x] Périmètre MVP figé (voir `perimetre-mvp.md`) : formulaire 5 étapes, moteur de verdict, rôles, quota
- [x] Mentions légales et disclaimers rédigés (voir `mentions-legales-version-finale.md`)
- [x] Charte graphique et guide de copywriting rédigés
- [x] Grille tarifaire figée : 17€/mois (6 mois) puis 27€/mois, quota de simulations inclus
- [ ] Envoyer la demande de consultation express à un avocat (validation des libellés de visite, de la liaison acquéreur/bien, du statut IOBSP) — en parallèle du dev, non bloquant
- [ ] Constituer la liste de 100-150 agences immobilières pour la prospection LinkedIn (à démarrer dès aujourd'hui, en parallèle du dev)

---

## PHASE 2 — Développement MVP (J2-J9)

### J2 — Setup technique + moteur de calcul (partie stable)
- [ ] Init projet Next.js, déploiement Vercel, setup Supabase (RLS activée dès le départ, pas ajoutée après coup)
- [ ] Moteur de calcul pour les profils à calcul automatique complet : Salarié (tous statuts), Retraité, Indépendant/Dirigeant (moyenne des 3 exercices, avec règle de trajectoire triennale)
- [ ] Constantes intégrées : HCSF 35 %, notaire 7,5 % ancien / 2,5 % neuf (ajustable manuellement par l'agent), décote 30 % sur loyers/fonciers, marge 7 % sur frais de vente
- [ ] Arbre de décision complet codé (élimination RAV, taux d'effort ≤/> 35 %, filet épargne résiduelle à 60 mois, plafond orange au-delà de 35 %, `reference_simulation` sur durée max applicable)

### J3 — Profils professionnels + rôles/accès
- [ ] Calcul revenu par revenu (micro/libéral/intermittent/dirigeants/CDI période d'essai) selon `03-financial-engine.md` : classes A/B/C, test déterminant, **pas** de plafond Orange automatique par simple présence du profil
- [ ] Mise en place des rôles : agent (authentifié, email + magic link), acquéreur (aucun compte, lien unique), admin (accès direct Supabase, pas d'interface dédiée)
- [ ] Vérifier que les Row Level Security Supabase empêchent bien un agent de voir les données d'un autre agent

### J4 — Interface agent : fiche bien + génération de lien
- [ ] Formulaire fiche bien : nom de la résidence, adresse complète (usage interne), référence, prix, ancien/neuf (avec ajustement manuel du taux de notaire), travaux si nécessaires
- [ ] Génération d'un lien unique et réutilisable par bien
- [ ] Persistance minimale : liste déroulante "biens récents" pour réutiliser une fiche existante sans ressaisie

### J5 — Formulaire visiteur (étapes 1 à 3)
- [ ] Étape 1 : projet immobilier — ville et référence du bien pré-remplies en lecture seule (jamais l'adresse complète), reste des champs à la charge du visiteur
- [ ] Étape 2 : acheteurs & foyer (co-emprunt, identité, situation familiale, enfants à charge)
- [ ] Étape 3 : situation professionnelle (formulaire répété par emprunteur si co-emprunt)

### J6 — Formulaire visiteur (étape 4) + flux dynamiques
- [ ] Section A : logement actuel, patrimoine, scénario de l'ancien bien (vente/location/indécis) avec calcul du saut de charge
- [ ] Section B : lignes dynamiques avec dropdown de type (rémunération annexe, dividendes, revenus fonciers, pension versée, crédit conso, crédit immobilier, autre charge, autre revenu), montant, attribution E1/E2/foyer
- [ ] Section C : liquidités (épargne disponible, épargne mensuelle moyenne)

### J7 — Formulaire visiteur (étape 5) + écran de résultat
- [ ] Étape 5 : financement visé (apport, durée, taux nominal, taux d'assurance)
- [ ] Écran de résultat à 3 états (visite recommandée / visite possible / visite peu conseillée) avec détail chiffré (prix, travaux, frais d'acquisition, apport, total à financer, mensualité, capacité empruntable), textes conformes au guide de copywriting

### J8 — Dashboard agent + compteur de simulations
- [ ] Dashboard agent : signal confidentiel par visiteur (badge 🟢 Visite recommandée / 🟠 Visite possible / 🔴 Visite peu conseillée + référence bien + identité visiteur — même badge que l'acquéreur), visible uniquement après connexion
- [ ] Compteur de simulations visiteur du mois, affiché simplement (ex. "32/50 ce mois-ci"), sans blocage automatisé complexe
- [ ] Intégration Stripe : Checkout + webhook de création/mise à jour de compte agent, email de bienvenue via Brevo avec lien de connexion

### J9 — QA et durcissement
- [ ] Test de bout en bout : abonnement agent → email de bienvenue → connexion → fiche bien → lien → simulation visiteur → résultat à l'écran → signal dans le dashboard agent
- [ ] Test mobile (le visiteur remplira très probablement sur téléphone)
- [ ] Vérifier l'affichage des mentions légales et du consentement RGPD partout
- [ ] Vérifier qu'aucun outil annexe (logs, monitoring, analytics) ne capture le détail des formulaires soumis

---

## PHASE 3 — Site vitrine et tunnel de vente (J8-J10, en parallèle de la fin du dev)

### J9 — Pages marketing + Stripe
- [ ] Landing page agent (proposition de valeur, preuve sociale si pilote disponible, CTA clair)
- [ ] Page de commande abonnement avec Stripe Checkout intégré (ou "réserver une démo de 15 min" pour sécuriser la conversion sur les 10 premières ventes)
- [ ] Pages légales (mentions légales, politique de confidentialité, CGU agent)

### J10 — Emails Brevo + copywriting
- [ ] Configurer Brevo : emails transactionnels (bienvenue agent, magic link) et templates marketing
- [ ] Séquence email pour prospects non convertis (objection, ROI chiffré, urgence)
- [ ] Séquence onboarding agent
- [ ] Copywriting des pages en cohérence avec `guide-copywriting.md`

---

## PHASE 4 — Contenu pédagogique (J10-J12, en parallèle)
- [ ] Rédiger le guide "Optimise tes chances d'obtenir un OUI" (contenu web ou espace membre intégré au site)
- [ ] Enregistrer 4-6 vidéos courtes pour la mini-formation (Loom ou équivalent)
- [ ] Livraison automatisée via Brevo + accès espace membre sur le site (phase bonus)

---

## PHASE 5 — Marketing & réseaux sociaux (J1-J15, en continu dès le début)

### Priorité #1 : prospection directe LinkedIn
- [ ] Optimiser le profil LinkedIn
- [ ] À partir de J3 : 15-20 demandes de connexion personnalisées/jour
- [ ] Utiliser les accroches et relances déjà rédigées (constat/douleur, curiosité, offre directe + démo)
- [ ] Objectif : 5-10 démos/appels programmés d'ici J12

### Priorité #2 : groupes Facebook "agents immobiliers"
- [ ] Rejoindre 5-10 groupes actifs, apporter de la valeur avant de mentionner l'outil

### Priorité #3 : contenu LinkedIn organique (en soutien)
- [ ] 1 post/jour à partir de J1 : douleur, démo/GIF dès J8, témoignage pilote, compte à rebours

### Instagram
- Hors priorité pour ce sprint — à activer en V2 pour le tunnel B2C, une fois l'audience organique construite (cf. `projections-ca.md`)

---

## PHASE 6 — Beta test + lancement (J13-J15)

### J13 — Beta test à blanc
- [ ] Accès gratuit à 2-3 agences amies, récupérer un retour et un témoignage si possible

### J14 — Durcissement final
- [ ] Stripe en mode live, test de transaction réel
- [ ] Vérifier mentions légales, consentement RGPD, politique de confidentialité en ligne

### J15 — Lancement
- [ ] Post LinkedIn d'annonce + relance des prospects déjà contactés
- [ ] Onboarding personnalisé du tout premier client

---

## PHASE BONUS (optionnelle, uniquement si le cœur du produit est bouclé avant J12)

⚠️ Ne jamais activer le paiement à 5€ tant que CGV, case de renonciation au droit de rétractation et médiateur de la consommation ne sont pas en place (cf. `mentions-legales-version-finale.md`, section 11).

- [ ] Simulateur gratuit (lead magnet) avec case de consentement marketing + collecte email
- [ ] Simulateur d'estimation indicative générique à 5€ (biens trouvés sur internet, disclaimer renforcé, cf. `grille-tarifaire.md`)
- [ ] CGV e-commerce, médiateur de la consommation, upsells guide (17€) et formation (47€)

---

## Hors scope à J15 (V2)
- Gestion complète de portefeuille de biens côté agent (recherche, édition, archivage)
- Rôle "agence" multi-mandataires en self-service
- Calcul fin différencié par catégorie professionnelle au-delà des taux déjà intégrés
- Paliers tarifaires basés sur l'usage réel observé, facturation à l'usage automatisée
- Tunnel B2C complet et Instagram
