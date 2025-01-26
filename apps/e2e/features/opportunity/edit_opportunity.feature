#language: fr
Fonctionnalité: Posez une question

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
    * je clique sur "Mes publications"
    * je clique sur "WHALE ROCK FESTIVAL"
    * je vois dans le titre "WHALE ROCK FESTIVAL :: Serkels"

    Quand je clique sur "Éditer l'opportunité"
    * je vois dans le titre "New :: Opportunities :: Serkels"

    * je clique sur "Titre"
    * je tape "Jam Session"

    * je clique sur "Date limite ?"
    * je tape "2222-11-01"

    * je clique sur "Couverture"
    * je tape "https://picsum.photos/512/512"

    * je clique sur "Description"
    * je tape "On organise des jam sessions pour les étudiants !"
    * je tape "Vous venez ?"

    * je clique sur "Lieu"
    * je tape "Paris"

    * je clique sur "Dans quelle catégorie ?"
    * je choisis l'option "Autres"

    * je clique sur "Lien web"
    * je tape "https://onedoes.github.io"

    Quand je clique sur "Publier"
    * je vois dans le titre "Jam Session :: Serkels"

    Alors je vois "Jam Session"
    * je vois "One Does University"
    * je vois "Date limite : 01/11/2222"
    * je vois "Autres"
    * je vois "On organise des jam sessions pour les étudiants !"
    * je vois "Paris"
