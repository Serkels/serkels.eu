#language: fr
Fonctionnalité: Consulter la biographie d'un étudiant

  Contexte:
    Soit une base de données nourrie au grain
    Etant donné que je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    * je vois dans le titre "Exchange :: Serkels"

  Scénario: La biographie de douglas@yopmail.com
    Etant donné que je visite la page "/@~"
    Alors je vois dans le titre "About :: Serkels"
    * je vois "Biographie"
    * je vois "Ajouté par"
    * je vois "Cercles"
    * je vois "👋"
    * je vois "Domaine d'étude"
    * je vois "Ville"
    * je vois "Intéressé.e par"
    * je vois "Langues parlées"
