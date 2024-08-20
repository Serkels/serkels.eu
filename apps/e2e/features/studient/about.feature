#language: fr
Fonctionnalité: Consulter la biographie d'un étudiant

  Contexte:
    Soit une base de données nourrie au grain

  Scénario: La biographie de douglas@yopmail.com
    Etant donné que je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"

    Quand je clique sur la légende "Link to my profile"

    Alors je vois dans le titre "About :: Serkels"
    * je vois "Biographie"
    * je vois "Abonnés"
    * je vois "Cercles"
    * je vois "👋"
    * je vois "Domaine d'étude"
    * je vois "Ville"
    * je vois "Intéressé.e par"
    * je vois "Langues parlées"
