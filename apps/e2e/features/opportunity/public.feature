#language: fr
Fonctionnalité: Opportunités publics

  Contexte:
    Soit une base de données nourrie au grain

  Scénario: Voir les opportunités
    Etant donné que je navigue sur la page
    Quand je clique sur le bouton "Opportunités pros"
    Alors je vois dans le titre "Opportunities :: Serkels"
    * je clique sur le bouton "Accepter"
    * je vois "Opportunités pros"
    * je vois "Recherche"
    * je vois "Cours de langues"
    * je vois "Autres"
    * je vois "Tout"
    # * je vois la légende "List of opportunities"

  Scénario: Voir l'opportunité "Cours de JavaScript"
    Etant donné que je navigue sur la page
    * je clique sur le bouton "Opportunités pros"
    Alors je vois dans le titre "Opportunities :: Serkels"
    * je clique sur le bouton "Accepter"
    Quand je clique sur le champ "Recherche"
    * je tape "Cours de JavaScript"
    # * je clique sur "Cours de JavaScript"
    # Alors je vois dans le titre "Cours de JavaScript :: Serkels"
    # * je vois "Cours de JavaScript"
    # * je vois "JavaScript est un langage de programmation créé en 1995"
    # * je vois "Lien web"
