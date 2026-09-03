# Guide de copywriting — Les Clés du Crédit

Ce document sert de référence à Cursor (ou toute IA de génération de code) pour rédiger ou améliorer tous les textes visibles dans l'application : boutons, titres, messages d'erreur, micro-copy, emails. Objectif : que l'utilisateur se sente en confiance sur un sujet financier sensible, sans jamais se sentir jugé ni perdu.

---

## 1. Ton de marque en une phrase
Un conseiller bienveillant qui explique simplement, jamais un formulaire administratif qui évalue.

## 2. Règles générales (valables partout)
- **Phrases courtes.** Une idée par phrase. Si une phrase a besoin d'une virgule pour tout dire, elle est probablement trop longue.
- **Verbe d'action en premier sur les boutons.** "Voir mon résultat", pas "Cliquez ici pour voir votre résultat".
- **Jamais de point d'exclamation** sur les messages système, confirmations ou erreurs — ça sonne faux sur un sujet financier. Un point suffit.
- **Jamais de MAJUSCULES** pour un titre ou un bouton — ça durcit visuellement un propos qui doit rester rassurant. Réservé uniquement aux bandeaux légaux obligatoires (ex. le disclaimer non-contractuel).
- **Tutoiement ou vouvoiement ?** Vouvoiement partout par défaut (public large, sujet sérieux) — sauf mention contraire explicite du produit (ex. le guide "Optimise tes chances d'obtenir un OUI" tutoie déjà dans son titre, donc rester cohérent en tutoyant tout ce contenu-là spécifiquement).
- **Pas de jargon bancaire non expliqué.** "Taux d'endettement" peut rester (terme grand public connu), mais "reste à vivre théorique", "HCSF", "saut de charge" doivent être reformulés ou accompagnés d'une explication d'une ligne la première fois qu'ils apparaissent.

## 3. Lexique à éviter / à privilégier

| À éviter | Pourquoi | À privilégier |
|---|---|---|
| "Renseignez vos données financières" | Sonne comme un contrôle fiscal | "Voyons ensemble votre projet" |
| "Votre dossier a été rejeté" | Ton d'échec, jugement | "Visite peu conseillée" |
| "Compatible" / "Non compatible" | Risque juridique (avis de solvabilité) | Libellés de visite (section 4) |
| "Vous ne pouvez pas vous permettre ce bien" | Culpabilisant | "L'écart avec votre capacité actuelle est de [montant]" |
| "Validez votre profil" | Ton administratif | "Continuons" / "Étape suivante" |
| "Erreur : champ requis" | Froid, technique | "Il manque encore [nom du champ]" |
| "Soumettre" | Vocabulaire de formulaire administratif | "Voir mon résultat" / "Continuer" |
| "Veuillez patienter" | Passif, un peu froid | "Calcul en cours" / "Presque fini" |

## 4. Messages de statut (résultat de simulation)

Le message doit toujours rester factuel, jamais moralisateur — surtout pour le rouge, où la tentation de "expliquer ce qui ne va pas" peut vite sonner comme un reproche.

**Même libellé badge côté agent et côté acquéreur.** Seuls les sous-textes chiffrés / pédagogiques sont réservés à l'acquéreur.

**🟢 Visite recommandée**
> Titre : "Visite recommandée"
> Sous-texte optionnel : rien de nécessaire, le badge vert suffit à rassurer.
> Incitation vers le simulateur gratuit : "Pour vos prochains projets, gardez votre simulateur personnel — c'est gratuit."

**🟠 Visite possible**
> Titre : "Visite possible"
> Sous-texte (acquéreur uniquement) : pédagogique selon les indicateurs (ex. analyse bancaire complémentaire, financement à affiner).
> Incitation : "Pour affiner votre projet et explorer vos options, téléchargez votre simulateur gratuit."

**🔴 Visite peu conseillée**
> Titre : "Visite peu conseillée"
> Sous-texte (acquéreur uniquement) : "Écart de [montant] par rapport à votre capacité estimée."
> Incitation : "Pour explorer d'autres projets à votre rythme, téléchargez votre simulateur personnel gratuit." (jamais "pour comprendre pourquoi vous avez été refusé" ou toute formulation qui ferait porter une faute au client)

## 5. Étapes du formulaire (progression)

- Le libellé d'étape reste factuel et court : "Étape 2 sur 5", jamais "2/5" seul (moins lisible) ni de formulation plus longue
- Titre de chaque étape en verbe d'action ou en objet direct, jamais en question :
  - Étape 1 : "Votre projet"
  - Étape 2 : "Vous et votre foyer"
  - Étape 3 : "Votre situation professionnelle"
  - Étape 4 : "Votre situation financière"
  - Étape 5 : "Le financement visé"
- Micro-copy de réassurance à faire apparaître au moins une fois par étape sensible (situation pro, finances) : "Vos données ne sont jamais conservées" — jamais répété plus d'une fois par écran pour ne pas paraître anxiogène à force d'insister.

## 6. Champs de formulaire (labels et aide)

- Le label reste court ("Revenu net mensuel", pas "Merci d'indiquer votre revenu net mensuel imposable")
- Le texte d'aide (s'il existe) précise un exemple concret plutôt qu'une règle abstraite : "Ex. 2 400 €" plutôt que "Indiquez le montant figurant sur votre fiche de paie"
- Pour les champs liés à des statuts professionnels moins courants (micro-entreprise, intermittent), ajouter une ligne d'aide qui rassure sur le fait que ce profil est bien pris en compte : "Ce statut est traité avec attention, votre résultat pourra nécessiter une validation complémentaire."

## 7. Messages d'erreur et de validation

- Toujours dire ce qui manque, jamais juste "erreur" : "Il manque le prénom de l'emprunteur 2"
- Jamais de ton culpabilisant même sur une erreur de saisie évidente (ex. revenu à 0) : "Ce montant semble très bas, vérifiez votre saisie" plutôt que "Valeur invalide"

## 8. Messages de chargement (calcul, génération)

Toujours un message d'action au présent, jamais un simple spinner sans texte :
- "Calcul en cours"
- "Préparation de votre résultat"
- Éviter tout humour ou jeu de mots ici — sujet financier sensible, on reste dans le sobre et rassurant (contrairement à un produit grand public plus léger)

## 9. Emails (onboarding agent, livraison du simulateur gratuit, upsells)

- Objet court, jamais en majuscules, jamais de "!!!" ou de mots comme "urgent"/"dernière chance" en objet — ça active les filtres spam et casse la confiance
- Corps : une seule action possible par email, un seul bouton principal
- Toujours un lien de désinscription visible en pied de mail (obligation légale en plus d'une question de confiance)
- Exemple objet de bienvenue agent : "Votre accès Les Clés du Crédit est prêt"
- Exemple objet de livraison simulateur gratuit : "Votre simulateur personnel, comme promis"

## 10. Checklist rapide avant de valider un texte

- [ ] Est-ce que je pourrais le dire à voix haute à quelqu'un de stressé par son achat immobilier, sans que ça sonne froid ou jugeant ?
- [ ] Ai-je évité tout jargon non expliqué ?
- [ ] Le bouton commence-t-il par un verbe ?
- [ ] Y a-t-il un point d'exclamation à supprimer ?
- [ ] Le message rouge (visite déconseillée) reste-t-il factuel, sans reproche ?
