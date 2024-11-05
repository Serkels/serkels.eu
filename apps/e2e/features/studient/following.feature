#language: fr
Fonctionnalité: Consulter les échanges proposés d'un étudiant
  Contexte:
    Soit une base de données nourrie au grain

  Scénario: La biographie de douglas@yopmail.com
    Etant donné que je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    * je visite la page "/@~"
    * je vois dans le titre "About :: Serkels"

    Quand je clique sur "Ajouté par"

    Alors je vois dans le titre "Ajouté par :: Serkels"
    * je vois "Ajouté par"
