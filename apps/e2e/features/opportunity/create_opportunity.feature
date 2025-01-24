#language: fr
Fonctionnalité: Posez une question

  Scénario: Les visiteurs ne peuvent pas créer une opportunité
    Soit une base de données nourrie au grain
    * je navigue sur la page
    Quand je clique sur le bouton "Opportunités pros"
    Alors je vois dans le titre "Opportunities :: Serkels"
    # Alors je ne vois pas "Créer une opportunité"

  Scénario: OneDoesUniversity crée l'opportunité "Jam Session"
    Soit une base de données nourrie au grain
    * je navigue sur la page
    * je me connecte en tant que "onedoesuniversity@yopmail.com"
    * je clique sur "Opportunités pros"
    * je vois dans le titre "Opportunities :: Serkels"
    Quand je clique sur "Créer une opportunité"
    Quand je clique sur "Créer une opportunité"
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

    * je clique sur "Dans quelle categorie ?"
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
