# Périmètre MVP — simulateur d'indication de visite

**Description du produit :** Les Clés du Crédit est un outil de pré-qualification financière que les agents immobiliers proposent à leurs acquéreurs avant la visite d'un bien. En quelques minutes, l'acquéreur renseigne sa situation et obtient une indication relative à la visite (vert / orange / rouge) pour le bien visé, prix et travaux inclus, pendant que l'agent reçoit directement le **même signal** dans son tableau de bord — sans jamais voir le détail financier du client.

Rappel du cadre validé : badge de verdict **identique** agent / acquéreur (🟢 Visite recommandée / 🟠 Visite possible / 🔴 Visite peu conseillée) ; seul l'acquéreur voit le détail chiffré et pédagogique. Le verdict Agent repose sur une **simulation de référence** à durée maximale applicable — pas sur la durée préférée de l'acquéreur.

---

## Inclus dans le MVP — quota et compteur de simulations

L'unité de facturation retenue n'est ni le nombre de mandataires, ni le nombre de fiches biens, mais le **nombre de simulations visiteur réellement complétées dans le mois** — c'est la seule unité qui reflète correctement l'usage réel, un bien pouvant recevoir plusieurs visiteurs via un seul lien réutilisable.

- Un compteur simple s'incrémente à chaque formulaire visiteur complété (pas à chaque fiche bien créée, ni à chaque lien généré)
- Quota mensuel fixe et généreux pour toutes les agences au lancement (ex. 50 simulations/mois), identique pour tous — pas de paliers différenciés pour le MVP
- **Pas de facturation à l'usage automatisée (pas de metered billing Stripe)** pour le MVP : en cas de dépassement, un message s'affiche invitant l'agence à contacter le support, traité manuellement le temps d'observer les niveaux de consommation réels sur les premières semaines
- Le compteur et son affichage (ex. "32/50 simulations ce mois-ci") peuvent apparaître dans le dashboard agent, sans logique de blocage complexe à construire dans l'immédiat

→ **Reporté en V2** : paliers tarifaires (Solo / Agence / Réseau) basés sur les seuils réels observés, facturation à l'usage automatisée au-delà d'un palier.

---

## Inclus dans le MVP — rôles et accès

| Rôle | Authentification | Accès |
|---|---|---|
| Acquéreur (client) | Aucune — lien unique envoyé par l'agent | Sa propre simulation pour le bien concerné uniquement |
| Agent immobilier | Compte authentifié (email + magic link) | Ses propres fiches biens et verdicts de ses propres clients uniquement |
| Admin (fondateur) | Accès direct Supabase, pas d'interface dédiée | Tout, via la console Supabase (pas de panel admin pour le MVP) |

**Rôle "agence" (multi-agents avec vue consolidée) : reporté en V2.** Pour le MVP, chaque agent souscrit individuellement. Si une agence souhaite plusieurs comptes agents dès le lancement, créer manuellement plusieurs comptes liés au même moyen de paiement Stripe plutôt que de construire une gestion self-service de hiérarchie de comptes.

**Profil agence — durée locative de marché (Phase 0 point 6) :** à la configuration du compte, renseigner `DUREE_MAX_LOCATIVE_MARCHE` (ex. 20 ou 25 ans) : hypothèse de marché locale pour les investissements locatifs, utilisée comme durée de `reference_simulation`. Jamais présentée à l'acquéreur comme obligation réglementaire.

**Point technique impératif** : la séparation des données entre agents doit être imposée au niveau base de données (Row Level Security Supabase), pas seulement filtrée côté interface — sans ça, un agent pourrait potentiellement accéder aux données d'un autre agent en manipulant une URL ou une requête.

---

## Inclus dans le MVP — deux écrans de résultat distincts (rappel de l'architecture retenue)

Deux interfaces séparées, avec des niveaux d'information différents, conformément à l'architecture confidentielle validée précédemment :

### Écran agent — signal de visite (dashboard authentifié)
- Visible uniquement après connexion de l'agent, jamais par un lien public
- Affiche uniquement : référence du bien, identifiant du client, et le badge 🟢/🟠/🔴 (« Visite recommandée » / « Visite possible » / « Visite peu conseillée ») — **même badge** que l'acquéreur
- Pas de détail financier (pas de revenus, pas de charges, pas de calcul détaillé) — rôle commercial : faut-il organiser la visite ?
- Toute notification poussée sur un canal non sécurisé (SMS, email) utilise une référence pseudonyme, jamais le nom complet ni le statut en clair

### Écran client — statut détaillé (sur son téléphone, juste après le formulaire)
- Bandeau non-contractuel en haut
- Badge de résultat coloré avec le **même libellé** que l'agent, plus restitution pédagogique (taux d'effort, RAV, saut de charge, épargne résiduelle, etc.)
- Détail du calcul : prix du bien, travaux, frais d'acquisition, apport, total à financer, mensualité de référence, capacité empruntable
- Après le verdict : possibilité de **simulations personnelles** (ex. durée plus courte) **sans modifier** le verdict transmis à l'agent
- Mention de non-conservation des données financières détaillées

Ces deux écrans sont fonctionnellement indépendants : le client ne voit jamais le dashboard agent, et l'agent ne voit jamais le détail financier du client — seulement le même badge issu de `reference_simulation`.

---

## Inclus dans le MVP — interface agent (fiche bien)

Brique obligatoire, première étape du parcours : sans elle, le concept de verdict lié à un bien précis n'existe pas.

**Champs du formulaire (un seul écran, pas de gestion de portefeuille avancée) :**
- Adresse du bien
- Référence (texte libre, ex. numéro de mandat interne à l'agence)
- Prix d'acquisition
- Ancien / Neuf → calcule automatiquement les **frais d'acquisition estimés** (7,5 % ancien / 2,5 % neuf sur le **prix d'acquisition seul**, pas prix + travaux)
- Affichage UX : montant en € + mention « calculés à X % » + bouton **[Modifier]** pour éditer le **montant en euros** (pas le %)
- Travaux nécessaires : oui/non → si oui, montant estimé demandé (**ligne séparée** du coût global : prix / frais d'acquisition / travaux)

✅ **Phase 0 — point 5 Notaire / frais d'acquisition validé** : taux 7,5 % / 2,5 % = estimations MVP (pas valeurs juridiques exactes) ; agent modifie le montant € ; base = prix seul.

**Persistance minimale recommandée :** sauvegarder chaque fiche bien créée et proposer une liste déroulante "biens récents" lors de la génération d'un nouveau lien, pour éviter à l'agent de ressaisir la même fiche à chaque nouveau client sur le même bien. Pas de recherche, pas d'édition, pas d'archivage — une simple liste suffit pour le MVP.

→ **Reporté en V2** : gestion complète de portefeuille de biens (recherche, édition, statuts, archivage).

---

## Inclus dans le MVP (tel quel, sans simplification)

### Étape 1 — Projet immobilier (détail du pré-remplissage)

- **Pré-remplis par l'agent, affichés en lecture seule pour le client** : localisation (ville uniquement, jamais l'adresse complète — pratique standard du métier pour éviter que le client contourne l'agent avant la visite), prix d'acquisition, ancien/neuf, travaux estimés. Ces champs proviennent directement de la fiche bien créée par l'agent — le client ne peut pas les modifier. **Toute modification (notamment sur les travaux) ne peut être faite que par l'agent, en éditant la fiche bien.** Si le prix évolue en négociation ou si l'estimation travaux change, l'agent met à jour la fiche bien (ce qui génère un nouveau lien ou actualise le lien existant, à trancher techniquement) — le client ne dispose d'aucun moyen d'ajuster ces valeurs lui-même. L'adresse complète, elle, reste un champ interne à l'agent, communiqué au visiteur uniquement une fois la visite fixée, en dehors de l'outil.
- **À la charge du client** : nature du projet (résidence principale / secondaire / investissement locatif), et loyer mensuel attendu si investissement locatif.
- **Toujours en lecture seule côté client** : le client ne dispose d'aucune case « modifier » — seul l'agent peut ajuster le **montant** des frais d'acquisition depuis sa fiche bien. Le client voit le montant final déterminé par l'agent (calcul % initial ou montant modifié), sans pouvoir le changer. Une seule source de vérité (la fiche bien de l'agent).

Tous les autres champs de l'étape 1 tels que décrits initialement.

### Étape 2 — Acheteurs & foyer
Toggle co-emprunt, identité, situation familiale, **nombre de personnes à charge (saisie unique au niveau foyer)**, régime matrimonial.
→ Nécessaire dès le MVP pour calibrer le reste à vivre selon le nombre d'emprunteurs et de personnes à charge (seuils prudentiels indicatifs, pas barème légal).
→ **Régime de la communauté** : le parcours **force** l'ajout d'un co-emprunteur (identité + infos financières). Message du type « votre régime matrimonial vous impose un emprunt en commun ». On ne rajoute jamais silencieusement le salaire d'un conjoint non co-emprunteur.

✅ **Phase 0 — point 4 Co-emprunt validé**
- Revenus et charges analysés **par emprunteur** puis sommés : `revenu_retenu_foyer = E1 + E2 + foyer` ; `charges_foyer = E1 + E2 + communes`.
- **Pas** de plafond Orange automatique si un seul des deux est micro/libéral/intermittent (`profil atypique ≠ dossier atypique` — point 7).
- Plafond Orange uniquement si un revenu **incertain** est **déterminant** pour la finançabilité (test §7.5).
- Personnes à charge : **une seule saisie foyer**.

### Étape 4, Section A — Logement actuel & patrimoine
Statut (locataire/propriétaire/hébergé), mensualité et capital restant dû si propriétaire, et surtout le scénario de l'ancien bien (vente / location / non tranché) en cas de changement de résidence principale.
→ C'est le cœur du calcul du "saut de charge" — indispensable, ne peut pas être simplifié sans casser la pertinence du verdict.

### Étape 4, Section C — Liquidités
Épargne disponible, épargne mensuelle moyenne.
→ Nécessaire pour calculer l'apport réel et affiner le reste à vivre.

### Étape 5 — Financement visé
Apport, taux nominal ciblé, taux d'assurance.  
**Durée pour le verdict Agent** : **pas** choisie librement par l'acquéreur — le moteur utilise automatiquement la durée maximale applicable (RP/RS = 25 ans ; locatif = durée marché agence, cf. point 6).  
La durée personnelle éventuelle n'intervient qu'**après** le verdict, en simulation informative (`personal_simulation`), sans modifier `agent_verdict`.
→ Cœur du calcul de mensualité de référence.

---

## Inclus, avec analyse revenu par revenu (Étape 3) — Phase 0 point 7

Tous les profils (classiques et atypiques) sont **inclus dans le MVP** — jamais masqués : micro, libéral, dirigeants, intermittents, revenus variables, CDI période d'essai, etc.

Source de vérité des formules et retenues : **`03-financial-engine.md`** uniquement. Ce périmètre décrit ce que le MVP collecte / affiche ; en cas de contradiction, le moteur l'emporte.

### Classes d'exploitabilité (par source de revenu)
- **A. Exploitable** → intégré, pas de plafond Orange auto
- **B. Partiellement exploitable** → règle prudente ; Orange **si** déterminant pour la finançabilité
- **C. Non exploitable** → neutralisé ; recalcul sans ce revenu

**Test déterminant** : si le dossier reste Vert **sans** les revenus incertains → Vert. Orange seulement si la finançabilité **dépend** d'un revenu à validation bancaire.

### CDI période d'essai
Pas automatiquement `revenu = 0 €`. Incertitude de stabilité → logique B + test déterminant (§3.1 du moteur). Emprunteur seul souvent Orange (plutôt que Rouge systématique) si finançable une fois sécurisé.

### Orange — signification
« Finançable possible, mais certitude insuffisante pour Vert sans validation complémentaire. » **Pas** un fourre-tout pour dossier inhabituel.

→ **Reporté en V2** : calcul fin différencié (retraitements fiscaux BIC/BNC, barèmes par type de banque).

---

## Inclus dans le MVP — flux complémentaires (lignes dynamiques)

### Étape 4, Section B — Flux complémentaires

Lignes dynamiques dès la V1, conformément à la spec initiale : l'utilisateur peut ajouter autant de lignes que nécessaire, chacune avec un type sélectionné dans un dropdown (rémunération annexe, dividendes, revenus fonciers, pension versée, crédit conso, crédit immobilier, autre charge, autre revenu), un montant mensuel, et une attribution (E1 / E2 / Le foyer si co-emprunt).

Ce choix permet de gérer nativement les cas à plusieurs lignes du même type (ex. plusieurs biens locatifs avec des loyers différents, plusieurs crédits en cours répartis entre les deux emprunteurs) — un cas de figure réel et pas si rare chez les profils investisseurs, comme démontré par votre propre situation personnelle (4 loyers, 3 crédits).

---

## Constantes et règles métier précises (récupérées d'une version antérieure du projet)

À adopter comme valeurs par défaut du moteur de calcul :

| Constante | Valeur |
|---|---|
| Plafond d'effort HCSF (référence) | 35 % |
| Frais d'acquisition estimés — ancien (MVP) | 7,5 % du **prix d'acquisition** (pas prix + travaux) |
| Frais d'acquisition estimés — neuf / VEFA (MVP) | 2,5 % du **prix d'acquisition** |
| Ajustement agent | Montant **€** éditable ([Modifier]), calcul initial auto par % |
| Coefficient locatif (hypothèse bancaire prudente, paramétrable — **pas** norme légale HCSF) | 0,70 par défaut → `revenu_locatif_retenu = loyer × coefficient_locatif` |
| Dividendes | −100 % (0 % retenus) |
| Marge de frais de vente (pour calculer le produit net d'une revente) | 7 % |

**⚠️ Interdit (HCSF)** : calcul différentiel déduisant le loyer de la mensualité du prêt. Les loyers n'entrent qu'au dénominateur (revenus retenus), jamais en réduction du numérateur.

**Taux de revenus retenus par sous-profil professionnel :**

| Sous-profil | Taux retenu |
|---|---|
| CDI confirmé | 100 % du net imposable |
| CDI période d'essai | Pas auto 0 € — incertitude de stabilité + test déterminant (cf. moteur §3.1 / §7) |
| CDD / Intérim | 100 % de la moyenne fiscale annuelle |
| Portage salarial | 100 % du salaire net |
| Dirigeant / Gérant / Artisan-commerçant | 100 % (moyenne ou trajectoire, voir ci-dessous) |
| Micro-entreprise — vente | 29 % du CA brut |
| Micro-entreprise — prestation BIC | 50 % du CA brut |
| Micro-entreprise — libéral BNC | 66 % du CA brut |
| Libéral EI/BNC, profession médicale, intermittent, retraité | 100 % de la référence propre au profil |

**Règle de trajectoire triennale** (pour les revenus sur 3 exercices — indépendants, micro-entreprise, libéraux) : si la trajectoire N-2 → N-1 → N est stable ou en hausse, retenir la moyenne arithmétique des 3 exercices ; si elle est en baisse, retenir uniquement l'année N (règle de prudence).

**Formules logement actuel / apport :**
```
produitNet = max(0, prixVente × (1 − 7%) − capitalRestantDû)
apportMax  = épargneDisponible + produitNet (si scénario "vente")
sautDeCharge = nouvelleMensualitéTotale − chargeLogementActuelle
```
Cas particulier : si le client est hébergé, la charge actuelle est nulle → le saut de charge est intégral.

✅ **Phase 0 — point 2 Endettement HCSF validé**

**Taux d'effort** = (nouvelle mensualité assurance comprise + mensualités des crédits conservés) / revenus retenus × 100.  
Le numérateur inclut assurance emprunteur + **tous** les prêts restant à charge (y compris crédit conso autre banque).

- **≤ 35 %** : conforme à la norme HCSF de référence.
- **> 35 %** : non conforme HCSF, mais pas juridiquement impossible (flexibilité bancaire jusqu'à ~20 % de la production trimestrielle). Dans l'app → **jamais Vert**, max **Orange** = « financement éventuellement possible par dérogation bancaire », pas « conforme HCSF ».
- Ancien mécanisme "dossier premium" permettant un Vert au-delà de 35 % : **écarté**.
- Filet épargne résiduelle (≥ 60 mois) : **conservé** comme filet prudentiel interne (pas HCSF) — au mieux Orange, jamais Vert via ce seul filet (voir arbre ci-dessous).

---

## Moteur de verdict (Phase 0 point 6 validé)

**Objectif agent** : le projet paraît-il finançable dans une configuration réaliste et favorable, et la visite est-elle pertinente ?

**Principe** : tous les indicateurs sont calculés (pas d'arrêt au premier critère défavorable). Pas de « dossier premium » qui contourne les règles.

**Libellés badge :**
| Niveau | Badge |
|---|---|
| 🟢 VERT | Visite recommandée |
| 🟠 ORANGE | Visite possible |
| 🔴 ROUGE | Visite peu conseillée |

**Deux objets :**
- `reference_simulation` : durée max applicable → produit `agent_verdict` (seule donnée transmise à l'agent)
- `personal_simulation` : après le verdict, l'acquéreur teste des durées plus courtes à titre informatif — **ne modifie jamais** le verdict Agent

**Durée de référence (entrée du moteur) :**
- RP / RS : **25 ans**
- Locatif : `DUREE_MAX_LOCATIVE_MARCHE` du profil agence (hypothèse marché, pas règle HCSF) — ex. 20 ans à La Réunion

✅ **Phase 0 — point 1 RAV validé**

**Formule RAV :**
```
RAV = revenus mensuels retenus − charges mensuelles après opération
```
Charges après opération = nouvelle mensualité (assurance comprise) + crédits restants + pensions alimentaires versées + loyer restant après opération + autres charges récurrentes pertinentes.

**Seuils prudentiels indicatifs (configurables — pas un seuil légal / refus bancaire) :**
- 800 € pour 1 emprunteur
- 1 200 € pour 2 emprunteurs
- + 300 € par personne à charge

**Foyer = emprunteurs, pas statut matrimonial.** Conjoint non co-emprunteur : revenu non ajouté automatiquement. Sous régime de communauté → co-emprunteur obligatoire → 2 emprunteurs → seuil 1 200 €.

**Saut de charge** = nouvelle mensualité totale − charge de logement actuelle (loyer ou mensualité de crédit en cours ; 0 si hébergé).

**Saut de charge maîtrisé** si l'une des deux conditions suivantes est vraie :
- RAV ≥ seuil prudentiel indicatif + saut de charge, ou
- Épargne mensuelle moyenne ≥ saut de charge

### Arbre de décision (appliqué à `reference_simulation`)

**1. Élimination directe** : si le RAV est inférieur au seuil prudentiel indicatif → 🔴 **Rouge** (libellé UX : jamais « dossier bancaire refusé »).

**2. Sinon, évaluer le taux d'effort :**

- **Taux d'effort ≤ 35 %**
  - Saut de charge maîtrisé → 🟢 **Vert** (Visite recommandée)
  - Saut de charge non maîtrisé → passer au filet épargne résiduelle (voir ci-dessous)

- **Taux d'effort > 35 %** (non conforme HCSF ; dérogation bancaire possible dans la marge de flexibilité ~20 %)
  - Saut de charge maîtrisé → 🟠 **Orange** (Visite possible — dérogation possible, pas conformité HCSF)
  - Saut de charge non maîtrisé → passer au filet épargne résiduelle

### Filet épargne résiduelle (si saut de charge non maîtrisé) — Phase 0 point 3 validé

**Formules :**
```
épargne résiduelle = épargne mobilisable avant projet − apport réellement consommé
couverture (mois)  = épargne résiduelle / saut de charge mensuel
```
Exemple : saut 400 €, épargne résiduelle 24 000 € → 60 mois.

**Si saut de charge ≤ 0** : ne pas appliquer le test (rien à couvrir).

**Statut** : filet **prudentiel interne** de l'app — **ni règle HCSF ni règle bancaire universelle**. Conservé pour son intelligibilité agent (« le ménage conserve assez d'épargne pour absorber la hausse de dépenses pendant plusieurs années »). Indicateur de **robustesse**, pas une raison de transformer un mauvais dossier en bon dossier → le filet mène au mieux à 🟠 Orange, **jamais** à Vert.

| Couverture | Verdict |
|---|---|
| ≥ 60 mois de saut de charge | 🟠 **Orange** (Visite possible) |
| < 60 mois de saut de charge | 🔴 **Rouge** (Visite peu conseillée) |

### Règle transversale : durée du prêt
Voir § durée de référence ci-dessus. La durée n'est plus un contrôle final « si trop longue → rouge » pour le verdict Agent : elle est l'**entrée** de `reference_simulation`. Les choix de durée plus courte de l'acquéreur restent en `personal_simulation`.

### Règle transversale : profils et incertitude documentaire (Phase 0 point 7)
`profil atypique ≠ dossier atypique`. Retenues individuelles. Plafond Orange seulement si revenu classe B/C **déterminant**. Source de vérité : `03-financial-engine.md`.

---

## Hors MVP (confirmé dans les échanges précédents)
- Tunnel gratuit → payant vers l'acquéreur (phase bonus, conditionnée au temps disponible)
- Gestion multi-biens avancée côté agent (à trancher séparément)
- Calcul fin différencié par catégorie professionnelle atypique (déjà couvert par les taux de retenue précis récupérés — voir section constantes)

---

## Point de vigilance sur le planning des 15 jours

Ce périmètre reste ambitieux pour 15 jours compte tenu de tout ce qu'il y a par ailleurs (site vitrine, page de vente, mailing Brevo, prospection, legal, contenu pédagogique). Le formulaire en 5 étapes se développe vite avec Cursor, mais le moteur de calcul mérite à lui seul 3 à 4 jours pleins de dev et de tests. Si le planning se tend, rogner sur le polish UI plutôt que sur la fiabilité du moteur (source de vérité : `03-financial-engine.md`) — les profils atypiques restent **inclus** (Phase 0 point 7), avec classes d'exploitabilité et test déterminant plutôt qu'un masquage.

**Mise à jour** : la réintégration des lignes dynamiques (Section B) et de l'édition du **montant €** des frais d'acquisition (calcul % initial + [Modifier]) ajoute un peu de complexité par rapport à la version simplifiée initialement prévue — ni l'un ni l'autre n'est un gros morceau de dev isolément, mais cumulés aux autres arbitrages, ça vaut le coup de garder un œil sur le planning J8.
