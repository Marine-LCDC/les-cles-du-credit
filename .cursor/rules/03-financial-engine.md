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

## 2bis. Endettement / taux d'effort HCSF — Phase 0 point 2 validé

### Formule
$$
\text{Taux d'effort} = \frac{\text{charges d'emprunt}}{\text{revenus retenus}} \times 100
$$
(équivalent mensuel ou annuel — même ratio.)

**Numérateur (charges d'emprunt)** — conforme HCSF :
- mensualité du **nouveau prêt**
- **assurance emprunteur** (obligatoirement intégrée)
- **tous les prêts existants qui restent à charge**, y compris crédits conso détenus dans une autre banque

En pratique (mensuel) :
$$
\frac{\text{nouvelle mensualité assurance comprise} + \text{mensualités crédits conservés}}{\text{revenus retenus}}
$$

### Plafond 35 % et signification Orange (`HCSF` + règle app)
- **≤ 35 %** : conforme à la norme HCSF de référence.
- **> 35 %** : **non conforme** à la norme HCSF, mais **pas juridiquement impossible** — flexibilité bancaire jusqu'à ~**20 %** de la production trimestrielle.
- **Règle app** : au-delà de 35 % → **jamais 🟢 Vert**, maximum 🟠 **Orange**.
- Signification Orange élargie (point 7) : voir §7.9 — pas seulement la dérogation HCSF ; aussi l'incertitude déterminante sur un revenu, etc.

### Revenus locatifs — règles strictes
- Le HCSF impose qu'**une décote** soit appliquée pour le risque locatif, **sans fixer réglementairement** cette décote à 30 %.
- `coefficient_locatif = 0,70` = hypothèse bancaire prudente utilisable dans le simulateur, **paramétrable**, jamais présentée comme norme légale.
- **INTERDIT** : calcul différentiel consistant à déduire le loyer de la mensualité du prêt. Le HCSF l'exclut explicitement. Les loyers entrent uniquement au **dénominateur** (revenus retenus après coefficient), jamais en réduction du numérateur.

---

## 2ter. Frais d'acquisition (notaire) — Phase 0 point 5 validé

### Formule initiale
Pour une acquisition classique :
$$
\text{frais\_acquisition\_estimés} = \text{prix\_acquisition} \times \text{taux}
$$
- Base = **prix du bien uniquement**, **pas** prix + travaux.
- Les **travaux** sont une **ligne séparée** dans le coût global du projet (prix / frais d'acquisition / travaux — distinction Service-Public).

### UX agent (fiche bien)
1. Calcul automatique initial par pourcentage (7,5 % ou 2,5 % selon ancien/neuf).
2. Affichage du **montant en euros**, pas du pourcentage à saisir :
   - « Frais d'acquisition estimés : 18 750 € »
   - « calculés à 7,5 % »
   - bouton **[Modifier]** → l'agent édite le **montant €** (ex. devis notaire réel).
3. Beaucoup plus pratique que d'exiger le pourcentage exact.

### Statut des taux 7,5 % / 2,5 %
Estimations **MVP** utiles pour démarrer — **pas** des valeurs juridiquement exactes. Les frais réels dépendent de plusieurs paramètres. Ne pas confondre avec le forfait fiscal parfois utilisé en calcul de plus-value.

### Côté visiteur
Lecture seule du montant final fixé par l'agent (jamais d'édition client).

---

## 3. Prise en Compte des Revenus par Profil Professionnel

> **Phase 0 point 7** : `profil atypique ≠ automatiquement dossier atypique`. Le statut pro ne détermine jamais à lui seul la couleur du verdict. Voir §7.

### Taux de retenue (calcul revenu par revenu)
| Profil | Montant retenu | Origine |
|---|---|---|
| CDI confirmé | 100 % du net imposable | `BANKING_PRACTICE` |
| CDI période d'essai | Voir §3.1 — **pas** automatiquement 0 € | `ENGINE_PRUDENTIAL_RULE` |
| CDD / Intérim | 100 % de la moyenne fiscale annuelle | `BANKING_PRACTICE` |
| Portage salarial | 100 % du salaire net | `BANKING_PRACTICE` |
| Retraité | 100 % de la pension nette | `BANKING_PRACTICE` |
| Dirigeant / Gérant / Artisan-Commerçant | Trajectoire triennale (§ ci-dessous) | `ENGINE_PRUDENTIAL_RULE` |
| Micro-entreprise (Vente) | 29 % du CA brut | `ENGINE_PRUDENTIAL_RULE` |
| Micro-entreprise (Prestation BIC) | 50 % du CA brut | `ENGINE_PRUDENTIAL_RULE` |
| Micro-entreprise (Libéral BNC) | 66 % du CA brut | `ENGINE_PRUDENTIAL_RULE` |
| Profession libérale EI/BNC / Intermittent | 100 % de la référence propre retenue | `ENGINE_PRUDENTIAL_RULE` |

### Règle de Trajectoire Triennale (Indépendants, Dirigeants) — `ENGINE_PRUDENTIAL_RULE`
Examen des 3 derniers exercices ($N-2$, $N-1$, $N$) :
- Trajectoire **stable ou en hausse** ($N-2 \le N-1 \le N$) : moyenne arithmétique des 3 exercices.
- Trajectoire **en baisse** : retenir uniquement l'année $N$ (prudence).
- Situation dépassant les capacités d'analyse du MVP → traiter comme revenu **partiellement exploitable** (§7.4 B) → plafond Orange si ce revenu est **déterminant** (§7.5).

### 3.1 CDI en période d'essai — `ENGINE_PRUDENTIAL_RULE`
- **Ne pas** traiter automatiquement comme `revenu retenu = 0 €` (ce n'est **pas** une règle réglementaire).
- Identifier une **incertitude de stabilité** : revenu **partiellement exploitable** (§7.4 B).
- Appliquer la règle prudente du moteur, puis le test §7.5 :
  - Dossier finançable **sans** ce revenu (autres revenus sécurisés) → 🟢 **VERT** possible.
  - Finançabilité **dépend** de ce CDI en période d'essai → 🟠 **ORANGE** max.
  - Emprunteur **seul** en période d'essai, finançable une fois la situation sécurisée → plutôt 🟠 **ORANGE** que Rouge systématique uniquement à cause de la période d'essai.
  - Non finançable même dans la configuration réaliste la plus favorable → 🔴 **ROUGE**.

---

## 4. Reste à Vivre (RAV) — Phase 0 point 1 validé

### Formule (source de vérité)
$$RAV = \text{revenus mensuels retenus} - \text{charges mensuelles après opération}$$

**Charges mensuelles après opération** (à soustraire) :
- mensualité du nouveau financement **assurance comprise**
- mensualités des crédits restant en cours
- pensions alimentaires obligatoires versées
- loyer restant effectivement à payer après l'opération
- autres charges récurrentes pertinentes (lignes dynamiques de type charge)

### Seuils prudentiels indicatifs (configurables)
Ces seuils sont une **règle prudentielle interne** de l'application — **pas** un seuil légal HCSF ni un critère de refus bancaire réglementaire. Ne jamais formuler « RAV < 800 € = dossier bancaire refusé ».

| Composition | Seuil prudentiel indicatif |
|---|---|
| 1 emprunteur | 800 € |
| 2 emprunteurs | 1 200 € |
| Personne à charge | +300 € / personne |

Les constantes doivent rester **configurables** dans le code (pas hardcodées dispersées).

### Foyer analysé = emprunteurs, pas statut matrimonial
- On ne raisonne **pas** sur le statut matrimonial pour définir le « couple ».
- Ce qui compte : le foyer **effectivement supporté** par les revenus des emprunteurs analysés.
- **2 co-emprunteurs** → revenus des deux pris en compte → seuil RAV **1 200 €**.
- **Conjoint non co-emprunteur** → son revenu **n'est jamais ajouté automatiquement** aux revenus emprunteurs.

### Régime de la communauté (règle UI + moteur)
Si l'emprunteur est sous le **régime de la communauté**, le parcours **oblige** à ajouter un co-emprunteur (identité + informations personnelles et financières). On se retrouve donc à **2 emprunteurs** → seuil RAV **1 200 €**. Message UX du type : « votre régime matrimonial vous impose un emprunt en commun ».

---

## 4bis. Co-emprunt — Phase 0 point 4 validé

### Agrégation foyer (HCSF : somme des revenus nets avant impôt des co-emprunteurs)
Chaque revenu est analysé **individuellement** (taux de retenue selon le profil de chaque emprunteur), puis agrégé :

$$
\text{revenu\_retenu\_foyer} = \text{revenu\_retenu\_E1} + \text{revenu\_retenu\_E2} + \text{revenus\_foyer\_retenus}
$$
$$
\text{charges\_foyer} = \text{charges\_E1} + \text{charges\_E2} + \text{charges\_communes}
$$

### Pas de plafond Orange automatique « par présence »
- Si E1 est CDI et E2 micro-entrepreneur : **ne pas** plafonner tout le dossier à Orange.
- `profil atypique ≠ automatiquement dossier atypique` (cf. §7).
- Décotes individuelles selon stabilité ; plafond Orange uniquement si un revenu **incertain** est **déterminant** pour la finançabilité (§7.5).

### Personnes à charge
- **Une seule saisie au niveau foyer** (enfants / personnes à charge) — absolument pas une saisie par emprunteur.

### Lignes dynamiques
Attribution E1 / E2 / Foyer : addition correcte dans `revenu_retenu_foyer` ou `charges_foyer` selon le type de ligne.

---

## 5. Formules de Calcul
- **Produit net de vente (ancien bien)** :
  $$produitNet = \max(0, \text{prixVente} \times (1 - 0.07) - \text{capitalRestantDû})$$
- **Apport disponible maximal (si scénario vente)** :
  $$apportMax = \text{épargneDisponible} + produitNet$$
- **Saut de charge** :
  $$sautDeCharge = \text{nouvelleMensualitéTotale} - \text{chargeLogementActuelle}$$
  *(Si le client est hébergé à titre gratuit, chargeLogementActuelle = 0 € → saut de charge intégral).*

- **Condition "Saut de charge maîtrisé"** (au moins une des 2 conditions est VRAIE) :
  1. $RAV \ge RAV_{seuil\ prudentiel} + sautDeCharge$
  2. $\text{Épargne mensuelle moyenne} \ge sautDeCharge$

---

## 5bis. Épargne résiduelle / filet 60 mois — Phase 0 point 3 validé

### Formules
$$
\text{épargne résiduelle} = \text{épargne mobilisable avant projet} - \text{apport réellement consommé par l'opération}
$$
$$
\text{couverture (mois)} = \frac{\text{épargne résiduelle}}{\text{saut de charge mensuel}}
$$

Exemple : saut de charge 400 €, épargne résiduelle 24 000 € → couverture = **60 mois**.

### Quand appliquer le test
- **Si saut de charge ≤ 0** : **sauter totalement** le test des 60 mois — il n'y a rien à couvrir.
- **Si saut de charge > 0** et saut de charge **non maîtrisé** : appliquer le filet (voir arbre §6).

### Statut de la règle (critique)
- Les **60 mois ne sont ni une règle HCSF ni une règle bancaire universelle**.
- C'est un **filet prudentiel interne** de l'application, conservé parce qu'il est **intelligible pour l'agent** :
  > « Le logement augmente fortement les dépenses mensuelles, mais le ménage conserve suffisamment d'épargne pour absorber cette hausse pendant plusieurs années. »
- C'est un **indicateur de robustesse**, **pas** une raison suffisante pour transformer un mauvais dossier en bon dossier.
- Conséquence moteur : le filet peut au mieux aboutir à 🟠 **Orange** — **jamais** à 🟢 Vert.

### Seuils du filet (si test applicable)
| Couverture | Verdict max |
|---|---|
| ≥ 60 mois de saut de charge | 🟠 **Orange** |
| < 60 mois de saut de charge | 🔴 **Rouge** |

---

## 6. Verdict — Phase 0 point 6 validé

### 6.1 Objectif
Répondre à la question agent : **« Au regard des éléments analysés, cet acquéreur est-il en capacité de financer ce bien et est-il pertinent d'organiser une visite ? »**

L'app ne détermine pas les conditions exactes du futur prêt ni ne prédit la décision définitive d'une banque. Elle évalue si le projet paraît **finançable dans une configuration de crédit réaliste et favorable à l'acquéreur**.

### 6.2 Tous les indicateurs sont calculés
Le moteur calcule **systématiquement** l'ensemble des indicateurs **avant** de produire le verdict. Il **ne s'arrête pas** au premier critère défavorable.

Sont notamment calculés : taux d'effort, RAV, saut de charge, épargne résiduelle, couverture du saut de charge, indicateurs de nature/stabilité des revenus, autres règles de prudence.

Cette analyse complète alimente le verdict **et** la restitution pédagogique acquéreur.

### 6.3 Libellés badge (source de vérité UX)
| Niveau | Badge |
|---|---|
| 🟢 VERT | **Visite recommandée** |
| 🟠 ORANGE | **Visite possible** |
| 🔴 ROUGE | **Visite peu conseillée** |

**Agent** — restitution simple (rôle commercial/opérationnel). Pas de détail revenus/charges/crédits/épargne. Sous-texte opérationnel :
- Vert : projet compatible avec les principaux critères analysés.
- Orange : financement envisageable, mais un ou plusieurs éléments nécessitent une validation / analyse bancaire complémentaire.
- Rouge : un ou plusieurs critères rendent le financement peu probable dans la configuration actuelle.

**Acquéreur** — même badge + restitution détaillée pédagogique (taux d'effort, RAV, mensualité, saut de charge, rôle de l'épargne résiduelle, éléments favorables/fragilisants). Pas un accord de prêt.

### 6.4–6.7 Durée de référence (entrée du moteur, pas contrôle final)
La durée servant au **verdict Agent** **n'est pas choisie librement** par l'acquéreur.

Question posée au moteur : **« Existe-t-il une configuration de durée réaliste permettant de financer ce bien ? »** — pas « Peut-il financer sur la durée qu'il préférerait ? ».

| Type de projet | Durée de référence (`durée_reference`) |
|---|---|
| Résidence principale / secondaire | **25 ans** (MVP, hors cas particuliers) |
| Investissement locatif | `min(DUREE_MAX_REGLEMENTAIRE, DUREE_MAX_LOCATIVE_MARCHE)` |

- `DUREE_MAX_REGLEMENTAIRE` : plafond réglementaire paramétré dans le moteur.
- `DUREE_MAX_LOCATIVE_MARCHE` : hypothèse de **marché** renseignée au **profil agence** à la configuration du compte (« Dans votre secteur, quelle durée max. les banques admettent généralement pour un locatif ? » — ex. 20 / 25 ans). **Jamais** présentée à l'acquéreur comme obligation réglementaire.

La durée de référence est une **donnée d'entrée dès le début** : elle fixe la mensualité de référence, puis taux d'effort, RAV, saut de charge, capacité, verdict. On ne calcule pas sur 25 ans pour « vérifier ensuite » si 20 ans est le plafond local.

### 6.8–6.13 Deux objets indépendants

#### A. `reference_simulation` (officielle)
- Utilise `durée_reference = durée_maximale_applicable`
- Calcule tous les indicateurs
- Produit `agent_verdict` ∈ {VERT, ORANGE, ROUGE}
- Seule simulation transmise / enregistrée pour l'agent

#### B. `personal_simulation` (facultative, après le verdict)
- L'acquéreur peut tester une durée plus courte (ex. 20 ans, 15 ans)
- Recalcule les indicateurs à titre **informatif**
- **Ne modifie jamais** `reference_simulation` ni `agent_verdict`
- Ne peut **ni dégrader** ni **améliorer artificiellement** le verdict Agent (ex. Vert sur 25 ans reste Vert même si 15 ans → Orange ; Rouge sur durée max ne devient pas Vert via une durée plus courte)

### 6.12 Pas de « dossier premium »
Aucun excellent patrimoine / épargne / revenus n'annule automatiquement un critère bloquant. Les éléments favorables peuvent améliorer l'analyse globale, expliquer un Orange, ou intervenir **uniquement** dans les règles expressément prévues — jamais contourner arbitrairement ce fichier.

### Arbre de décision (appliqué à `reference_simulation`)
Ordre logique pour **déterminer le niveau** (tous les indicateurs ayant déjà été calculés) :

1. Si $RAV < RAV_{seuil\ prudentiel\ indicatif}$ → 🔴 **ROUGE** (libellé UX : seuil prudentiel indicatif, **jamais** « refus bancaire »).
2. Sinon, taux d'effort :
   - **≤ 35 %** + saut de charge maîtrisé → 🟢 **VERT**
   - **≤ 35 %** + saut non maîtrisé → filet §5bis
   - **> 35 %** + saut maîtrisé → 🟠 **ORANGE** (dérogation possible, pas conformité HCSF)
   - **> 35 %** + saut non maîtrisé → filet §5bis
3. Filet épargne résiduelle (si applicable) : ≥ 60 mois → 🟠 ; < 60 mois → 🔴 ; saut ≤ 0 → filet non appliqué.

### Règle métier finale (durée)
**Le verdict Agent est toujours calculé à partir de la durée maximale réaliste applicable au projet.** Les simulations personnelles de durée plus courte n'impactent pas ce verdict.

---

## 7. Source de vérité, profils atypiques et limite de compétence — Phase 0 point 7 validé

### 7.1 Question posée au moteur
**« Au regard des informations disponibles et des règles analysables automatiquement, cet acquéreur paraît-il en capacité de financer ce bien ? »**

| Verdict | Signification métier |
|---|---|
| 🟢 VERT | Finançabilité estimée favorable → **Visite recommandée** |
| 🟠 ORANGE | Finançabilité possible mais analyse complémentaire nécessaire → **Visite possible** |
| 🔴 ROUGE | Finançabilité estimée insuffisante en l'état → **Visite peu conseillée** |

Le **statut professionnel ne détermine jamais à lui seul** la couleur du dossier.

### 7.2 Profils atypiques inclus dans le MVP (Phase 1)
Inclus, **jamais masqués** : micro-entrepreneurs, professions libérales, dirigeants, intermittents, salariés à revenus variables, CDI en période d'essai, autres situations à stabilité particulière. L'agent obtient une indication tout en reconnaissant les limites du moteur.

### 7.3 Suppression de « profil atypique = orange »
`profil atypique ≠ automatiquement dossier atypique`.  
Exemple : E1 CDI + E2 micro avec historique suffisant → **pas** de `verdict_max = ORANGE` automatique.  
En revanche : `revenu impossible à fiabiliser automatiquement → analyse complémentaire` **peut** plafonner à Orange **si** ce revenu est déterminant (§7.5).

### 7.4 Revenu exploitable par le moteur
Chaque source de revenu est analysée individuellement (nature, montant, ancienneté/historique, régularité si dispo, méthode, montant retenu, **niveau de confiance**).

| Classe | Définition | Conséquence |
|---|---|---|
| **A. Exploitable** | Infos suffisantes pour appliquer une règle documentée | Intégré au calcul ; **pas** de plafond Orange auto |
| **B. Partiellement exploitable** | Estimation possible, certitude bancaire insuffisante | Règle prudente ; plafond **ORANGE** si revenu **nécessaire** (§7.5) |
| **C. Non exploitable** | Éléments insuffisants | Ne pas inventer de valeur ; exclure/neutraliser ; recalculer sans ce revenu |

### 7.5 Test déterminant (règle essentielle)
Avant de plafonner à Orange pour incertitude :

1. Calculer le verdict **sans** le(s) revenu(s) incertains (classe B/C).
2. Si le dossier reste **VERT** sans eux → **VERT** (l'incertitude n'est pas déterminante).
3. Si **sans** eux → ROUGE, mais **avec** une prise en compte prudente possible → VERT ou ORANGE → **ORANGE** (finançabilité dépend d'une validation bancaire).
4. Si non finançable même dans la config réaliste la plus favorable → **ROUGE**.

**L'incertitude ne dégrade le verdict que lorsqu'elle est déterminante pour la finançabilité.**

### 7.6 Dirigeants / indépendants / libéraux / micro
Appliquer les taux et trajectoire de §3. Qualifier chaque méthode (`HCSF` / `BANKING_PRACTICE` / `ENGINE_PRUDENTIAL_RULE`). Ne pas inventer de règle bancaire universelle. Au-delà des capacités MVP → **ORANGE / analyse complémentaire** plutôt qu'une fausse précision.

### 7.7 CDI période d'essai
Voir §3.1. Même logique §7.5.

### 7.8 Articulation avec le point 6 (durée)
Toujours `durée_reference = durée maximale réaliste`. Ne **pas** cumuler artificiellement durée trop courte + profil atypique. Analyser le micro/libéral/etc. **sur la durée de référence** (ex. RP = 25 ans).

### 7.9 Signification définitive de l'Orange
**« Le projet pourrait être finançable, mais l'application n'a pas un niveau de certitude suffisant pour le classer Vert sans validation complémentaire. »**

Orange **peut** venir de : effort > 35 % (flexibilité bancaire), revenu à validation bancaire, situation pro à valider, élément atypique **déterminant**, règle explicite du moteur.  
Orange **ne doit pas** venir du seul fait que le dossier est « inhabituel ».

### 7.10 Source de vérité unique
| Document | Rôle |
|---|---|
| **`03-financial-engine.md`** | **Source de vérité unique** des règles financières et décisionnelles |
| **`perimetre-mvp`** | Ce que le MVP collecte, calcule et affiche — **pas** une 2ᵉ source de formules |

En cas de contradiction : **`03-financial-engine.md` l'emporte**.

### 7.11 Qualification d'origine de chaque règle
| Tag | Signification |
|---|---|
| `HCSF` | Règle réglementaire |
| `BANKING_PRACTICE` | Pratique bancaire suffisamment établie |
| `MARKET_PARAMETER` | Paramètre marché agence (ex. durée max locative) |
| `ENGINE_PRUDENTIAL_RULE` | Convention prudentielle Les Clés du Crédit |

Ne jamais présenter une convention interne comme obligation réglementaire.

### 7.12 Principe métier final
Le moteur ne reproduit pas le travail d'un courtier / analyste crédit.

- Finançabilité suffisamment démontrée → 🟢 **VERT**
- Finançabilité possible mais dépendante d'un élément à validation bancaire → 🟠 **ORANGE**
- Finançabilité insuffisante même dans la config réaliste la plus favorable → 🔴 **ROUGE**

Même logique pour profils classiques et atypiques.

---

## 8. Règles Transversales
- **Durée** : voir §6.4–6.7 (entrée du moteur pour `reference_simulation`).
- **Flux complémentaires (Étape 4, Section B)** : lignes dynamiques (type, montant, attribution E1 / E2 / Foyer) additionnées correctement aux revenus et charges.
- **Origine des constantes clés** : plafond effort 35 % = `HCSF` ; coefficient locatif 0,70 = `ENGINE_PRUDENTIAL_RULE` (paramétrable) ; seuils RAV = `ENGINE_PRUDENTIAL_RULE` ; filet 60 mois = `ENGINE_PRUDENTIAL_RULE` ; durée locative marché = `MARKET_PARAMETER` ; frais acquisition 7,5 %/2,5 % = `ENGINE_PRUDENTIAL_RULE` (estimation MVP).
