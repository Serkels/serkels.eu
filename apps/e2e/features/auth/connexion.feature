#language: fr
Fonctionnalité: Connexion d'un utilisateur

Contexte:
  Soit une base de données nourrie au grain

  Plan du scénario: Connexion de <email>
    Etant donné que je navigue sur la page
    Quand je me connecte en tant que "<email>"
    Alors je vois dans le titre "<titre>"
  Exemples:
    | email                 | titre                    |
    | admin@yopmail.com     | Admin :: Serkels         |
    | ahmadali.fr@gmail.com | Opportunities :: Serkels |
    | dino@yopmail.com      | Exchange :: Serkels      |
    | douglas@yopmail.com   | Exchange :: Serkels      |
    | johan@yopmail.com     | Exchange :: Serkels      |
