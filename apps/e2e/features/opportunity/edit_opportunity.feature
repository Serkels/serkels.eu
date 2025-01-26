#language: fr
Fonctionnalité: Éditer une opportunité

  @skip
  Scénario: Les visiteurs ne peuvent pas édité une opportunité
    Soit une base de données nourrie au grain
    * je navigue sur la page
    Quand je clique sur le bouton "Opportunités pros"
    Alors je vois dans le titre "Opportunities :: Serkels"
    # Alors je ne vois pas "Créer une opportunité"

  Scénario: Vulfpeck peut éditer l'opportunité "Whale Rock Festival"
    Soit une base de données nourrie au grain
    * je navigue sur la page
    * je me connecte en tant que "partner@vulfpeck.com"
    * je clique sur "Opportunités pros"
    * je vois dans le titre "Opportunities :: Serkels"
    * je clique sur la légende "Link to my profile"
    * je vois dans le titre "About :: Serkels"
    * je clique sur "Mes publications"
    * je clique sur "WHALE ROCK FESTIVAL"
    * je vois dans le titre "WHALE ROCK FESTIVAL :: Serkels"

    Quand je clique sur "Éditer l'opportunité"
    * je vois dans le titre "Edit WHALE ROCK FESTIVAL :: Opportunities :: Serkels"

    * je clique sur "Titre"
    * je tape " 2222"

    * je clique sur "Date limite ?"
    * je tape "2222-11-01"

    * je clique sur "Couverture"
    * je vide le champ
    * je tape "https://picsum.photos/512/512"

    * je clique sur "Description"
    * je vide le champ
    * je tape "> https://vulf.co/courses/dart/lectures/45940163"

    * je clique sur "Lieu"
    * je vide le champ
    * je tape "Paso Robles"

    * je clique sur "Dans quelle catégorie ?"
    * je choisis l'option "Autres"

    * je clique sur "Lien web"
    * je vide le champ
    * je tape "https://www.whalerockmusicfestival.com"

    Quand je clique sur "Publier"
    * je vois dans le titre "WHALE ROCK FESTIVAL 2222 :: Serkels"

    Alors je vois "WHALE ROCK FESTIVAL 2222"
    * je vois "Vulfpeck"
    * je vois "Date limite : 01/11/2222"
    * je vois "Autres"
    * je vois "https://vulf.co/courses/dart/lectures/45940163"
    * je vois "Paso Robles"
