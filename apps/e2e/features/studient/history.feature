#language: fr
Fonctionnalité: Consulter les échanges réussis d'un étudiant

  Contexte:
    Soit une base de données nourrie au grain

  Scénario: La biographie de douglas@yopmail.com
    Etant donné que je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"

    Quand je clique sur la légende "Link to my profile"
    Alors je vois dans le titre "About :: Serkels"
    * je clique sur "Échanges Réussis"

    Alors je vois dans le titre "History :: Serkels"
