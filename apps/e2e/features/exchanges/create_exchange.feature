#language: fr
Fonctionnalité: Posez une question

  Scénario: Les visiteurs ne peuvent pas créer un échange
    Soit une base de données nourrie au grain
    * je navigue sur la page
    Quand je clique sur "Échanges"
    * je vois dans le titre "Exchange :: Serkels"

    Alors je ne vois pas "Créer un échange"

  Scénario: Douglas crée l'échange "The Creator"
    Soit une base de données nourrie au grain
    * je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    * je clique sur "Échanges"
    * je vois dans le titre "Exchange :: Serkels"
    Quand je clique sur "Créer un nouvel échange"
    * je vois dans le titre "New :: Exchanges :: Serkels"

    * je clique sur "Je propose"
    * je clique sur "Sur place"

    * je clique sur "Ville"
    * je tape "Nice"

    * je clique sur "Dans quelle categorie ?"
    * je choisis l'option "Autres"

    * je clique sur "Titre"
    * je tape "The Creator"

    * je clique sur "Description"
    * je tape "*The Creator* is a good film and you should watch it ;)"

    * je clique sur "Sans échange"

    Quand je clique sur "Publier"
    Alors je vois "The Creator"
    * je vois "The Creator is a good film"
    * je vois "Proposition"
    * je vois "Nice"
    * je vois "Autres"
    * je vois "Sans échange"
    * je vois "Date limite : flexible"
    * je vois "Voir mes échanges"
