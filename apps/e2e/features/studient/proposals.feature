#language: fr
Fonctionnalité: Consulter les échanges proposés d'un étudiant
  Contexte:
    Soit une base de données nourrie au grain

  Scénario: La biographie de douglas@yopmail.com
    Etant donné que je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    * je clique sur le bouton "Accepter"
    
    Quand je clique sur la légende "Link to my profile"
    * je clique sur "Publications"

    Alors je vois dans le titre "Proposals :: Serkels"
