#language: fr
Fonctionnalité: Connexion d'un utilisateur

Contexte:
  Soit une base de données nourrie au grain

  Plan du scénario: Connexion de <email>
    Etant donné que je navigue sur la page
    Quand je me connecte en tant que "<email>"
  Exemples:
    | email                 |
    | douglas@yopmail.com   |
    | johan@yopmail.com     |
    | dino@yopmail.com      |
    | ahmadali.fr@gmail.com |
