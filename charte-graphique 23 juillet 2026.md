# Charte graphique — Les Clés du Crédit

## Inspiration : votre logo
Trois éléments à exploiter : le **sable/beige** du trou de serrure (chaleur, pierre, immobilier), le **teal/émeraude** de la clé (confiance, clarté, "on vous ouvre une porte"), et le **gris neutre** du personnage (sobriété, sérieux). C'est une bonne base — ni froid comme une banque, ni criard comme une appli fintech grand public.

---

## 1. Palette de couleurs

### Couleur de marque (structure de l'interface)
- **Teal principal** : `#2E7D6B` (un cran plus profond que le teal du logo, pour un meilleur contraste texte/fond) — boutons, liens, éléments actifs, en-têtes
- **Teal clair** : `#E1F0EC` — fonds de section, survols discrets

### Couleur secondaire (chaleur, immobilier)
- **Sable** : `#C7A97A` — accents décoratifs, bandeaux d'information secondaire, séparateurs
- **Sable clair** : `#F5EFE3` — fond de page général (plus chaleureux qu'un blanc pur, évoque la pierre/le foyer sans être criard)

### Neutres (texte, structure)
- Du blanc `#FFFFFF` au gris foncé `#33322E` (teinte légèrement chaude, pas un gris froid bleuté) pour texte et bordures

### ⚠️ Couleurs sémantiques (statuts) : à garder DISTINCTES de la couleur de marque
C'est le point le plus important de cette charte. Votre couleur de marque est un teal proche du vert — or le statut "visite prioritaire" utilise aussi du vert. Si les deux se ressemblent trop, l'utilisateur ne saura plus si le vert qu'il voit est "la couleur de l'appli" ou "visite prioritaire". Les statuts doivent donc utiliser une palette **volontairement différente** de la marque :
- 🟢 Vert statut : `#3B9945` (vert franc, différent du teal de marque)
- 🟠 Orange statut : `#D9822B`
- 🔴 Rouge statut : `#D64545`

Le teal de marque n'apparaît **jamais** comme couleur de statut, uniquement dans les éléments d'interface neutres (boutons, en-têtes, liens). Ça garde une distinction claire entre "l'identité de l'appli" et "le résultat de votre dossier".

---

## 2. Typographie

- **Titres** : une sans-serif à terminaisons arrondies et chaleureuses (ex. Poppins, Quicksand, ou équivalent système) — donne un ton accessible sans sacrifier le sérieux
- **Texte courant** : une sans-serif système neutre et très lisible (Inter, ou la police système par défaut du téléphone) — priorité à la vitesse de chargement et à la lisibilité sur mobile
- Casse standard partout (jamais de MAJUSCULES pour les titres ou boutons — ça durcit visuellement un propos qui doit rester rassurant)
- Taille de texte courant minimum 16px sur mobile (lisibilité, surtout pour un public qui inclut des profils moins à l'aise avec le numérique)

---

## 3. Iconographie

- Style **trait fin, arrondi**, jamais d'icônes pleines/agressives (cohérent avec les formes arrondies du logo — le trou de serrure, la tête du personnage)
- Une icône par action clé plutôt que du texte seul : maison pour le bien, portefeuille pour le budget, personne pour le profil — aide la compréhension rapide, surtout pour les utilisateurs pressés ou peu à l'aise avec les formulaires financiers

---

## 4. Principes UX/UI par interface

### Écran client (acquéreur) — priorité à la confiance et à la simplicité
- **Fond sable clair** plutôt que blanc pur ou gris froid type banque — sensation plus chaleureuse et moins "institution financière austère"
- **Un indicateur de progression visible** en haut du formulaire à 5 étapes ("Étape 2 sur 5") — essentiel pour un formulaire long : sans repère, le risque d'abandon grimpe fortement
- **Micro-copy rassurante à chaque étape** : rappels courts du type "Vos données ne sont jamais conservées" ou "Encore 2 minutes" — répété discrètement, pas juste une fois en bas de page
- **Coins arrondis généreux** (12-16px) sur toutes les cartes et boutons — écho direct à la forme arrondie du logo, et visuellement plus doux qu'une interface bancaire classique à angles droits
- **Zones cliquables larges** (boutons d'au moins 44px de hauteur) — pensé mobile d'abord, y compris pour des utilisateurs moins habitués aux petits écrans
- Éviter tout vocabulaire bancaire intimidant : "Voyons ensemble votre projet" plutôt que "Renseignez vos données financières"

### Dashboard agent — priorité à l'efficacité
- Densité plus compacte que l'écran client (l'agent est un utilisateur régulier, pas un visiteur ponctuel — il préfère voir plus d'informations d'un coup d'œil)
- Le badge de statut (🟢/🟠/🔴) doit être le premier élément visuel de chaque ligne, avant même le nom du client — l'agent doit pouvoir scanner sa liste en quelques secondes
- Pas de fioriture décorative ici (pas de sable/beige en fond) — priorité à la lisibilité et à la rapidité de lecture, un fond blanc ou gris très clair suffit

### Ton éditorial (textes, boutons, messages d'erreur)
- Phrases courtes, verbe d'action en premier sur les boutons ("Voir mon résultat", pas "Cliquez ici pour voir votre résultat")
- Jamais de point d'exclamation sur les messages système (ça sonne faux/agressif pour un sujet aussi sensible que l'argent)
- En cas de résultat rouge (visite peu conseillée) : ton factuel et non culpabilisant, jamais de vocabulaire d'échec ("Visite peu conseillée", jamais "vous ne pouvez pas vous permettre ce bien")

---

## 5. Logo — usage recommandé

**Fichier source (projet)** : `assets/brand/logo.png`  
**Archive / CDN** : https://d1yei2z3i6k35z.cloudfront.net/1029184/68e663c6153e4_logolescl%C3%A9sducr%C3%A9dit4.png

- Le logo actuel (rendu 3D réaliste) fonctionne bien en usage isolé (favicon, écran de démarrage, page de connexion agent), mais sa texture 3D détaillée risque de mal vieillir à petite taille (barre de navigation, favicon 16x16) et de jurer avec une interface plate/épurée comme celle recommandée ici.
- Suggestion : garder ce visuel comme image de marque forte (landing page, réseaux sociaux), mais prévoir à terme une version simplifiée en aplat (silhouette du trou de serrure + clé, sans le rendu 3D) pour les usages interface (header d'app, favicon) — plus cohérent avec le style flat recommandé pour l'ensemble du produit.
