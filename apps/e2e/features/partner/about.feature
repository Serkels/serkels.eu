#language: fr
Fonctionnalité: Consulter la section a propos d'un partenaire
  Contexte:
    Soit une base de données nourrie au grain

  Scénario: la section a propos de One Does University
    Etant donné que je navigue sur la page
    * je me connecte en tant que "onedoesuniversity@yopmail.com"
    * je clique sur "Vous êtes connecté"
    * je vois dans le titre "Opportunities :: Serkels"

    Quand je clique sur la légende "Link to my profile"

    Alors je vois dans le titre "About :: Serkels"
    * je vois "À propos"
    * je vois "Opportunités"
    * je vois "Ajouté par"
    * je vois "One does not simply implement, it teaches."
    * je vois "Site web : https://onedoes.github.io"
    * je vois "Ville : Paris"
