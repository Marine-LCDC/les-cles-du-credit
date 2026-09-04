# Design System — Les Clés du Crédit

## 1. Palette de Couleurs
- Brand Main (Teal) : `#2E7D6B` (Boutons, éléments actifs, en-têtes)
- Brand Light : `#E1F0EC` (Fonds de section, survols)
- Accent Sable : `#C7A97A` (Accents décoratifs, bandeaux d'information)
- Background Client (Sable clair) : `#F5EFE3` (Uniquement sur l'espace client)
- Neutral Dark : `#33322E` (Texte principal)

⚠️ RÈGLE STRICTE SUR LES COULEURS DE STATUT :
Le Teal de marque (`#2E7D6B`) ne doit JAMAIS servir de couleur de statut de visite (vert/orange/rouge).
Les statuts doivent obligatoirement utiliser cette palette dédiée :
- 🟢 Vert statut : `#3B9945`
- 🟠 Orange statut : `#D9822B`
- 🔴 Rouge statut : `#D64545`

## 2. Logo
- Fichier : `assets/brand/logo.png` (rendu 3D — trou de serrure sable, personnage blanc, clé teal).
- Usages forts : landing, splash, connexion agent, réseaux sociaux.
- À petite taille (header, favicon) : prévoir à terme une version aplatie (silhouette).

## 3. Typographie & Composants
- Titres : Font sans-serif arrondie (ex. Poppins / Quicksand).
- Corps de texte : System sans-serif neutre (ex. Inter). Taille min. 16px sur mobile.
- Formes : Coins arrondis généreux (`border-radius: 12px` à `16px`) sur l'espace client.
- Boutons & Zones cliquables : Hauteur minimale de 44px (Mobile-first).
- Pas de MAJUSCULES pour les titres ou boutons.

## 4. Interfaces Client vs Agent
- Client : Fond sable clair `#F5EFE3`, composants aérés, barre de progression explicite ("Étape X sur 5").
- Agent : Fond blanc/gris neutre, densité d'information plus forte, badge de statut (🟢/🟠/🔴) en premier élément visuel.
