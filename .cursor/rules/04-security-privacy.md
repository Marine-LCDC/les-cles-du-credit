# Sécurité & Confidentialité des Données — Les Clés du Crédit

## 1. Étanchéité de l'Adresse du Bien (Côté Client)
- **Règle absolue** : L'adresse complète n'est jamais transmise au visiteur[cite: 3].
- Sur le formulaire client et l'écran de résultat, **seules la ville et la référence du bien sont affichées (en lecture seule)**[cite: 3, 4].
- L'adresse complète est à usage strictement interne pour l'agent immobilier et ne doit jamais transiter dans le payload de l'API appelé côté client (ne pas la requêter dans le frontend client)[cite: 3, 4].

## 2. Étanchéité des Données Financières (Côté Agent)
- **Règle absolue** : L'agent ne voit que le feu vert/orange/rouge (le statut)[cite: 4].
- L'agent n'a **jamais accès au détail financier du client** (pas de revenus, pas de charges, pas de calcul détaillé, pas d'apport)[cite: 4].
- L'écran agent affiche uniquement : la référence du bien, l'identifiant ou l'identité du visiteur, et le badge de visite (🟢/🟠/🔴 avec libellé "Visite recommandée" / "Visite possible" / "Visite peu conseillée")[cite: 3, 4].

## 3. Sécurité de la Base de Données (Supabase)
- **Point technique impératif** : La séparation des données entre agents doit obligatoirement être imposée au niveau de la base de données via les **Row Level Security (RLS) de Supabase**[cite: 4].
- Il est strictement interdit de filtrer les données uniquement côté interface (frontend)[cite: 4]. Sans RLS, un agent pourrait potentiellement accéder aux données d'un autre agent via une requête réseau[cite: 4].

## 4. Sécurité des Notifications Externes
- Toute notification poussée vers l'agent sur un canal non sécurisé (SMS, email) doit utiliser une **référence pseudonyme** (ex. "Dossier #245")[cite: 4].
- Ne jamais inclure le nom complet de l'acquéreur ni le statut de visite en clair dans ces notifications[cite: 4].
