#language: fr
Fonctionnalité: Access à l'interface admin

Contexte:
  Soit une base de données nourrie au grain

  Scénario: Un utilisateur non connecté
    Etant donné que je navigue sur la page
    * je m'attend a une erreur "NEXT_NOT_FOUND"
    Quand je navigue sur "/admin"
    Alors je vois "404"

  Scénario: Connexion d'un administateur
    Etant donné que je navigue sur la page
    Quand je me connecte en tant que "admin@yopmail.com"
    Alors je vois dans le titre "Admin :: Serkels"

  Plan du scénario: Connexion de <email>
    Etant donné que je navigue sur la page
    * je m'attend a une erreur "NEXT_NOT_FOUND"
    Quand je me connecte en tant que "<email>"
    * je navigue sur "/admin"
    Alors je vois "404"
  Exemples:
    | email                 |
    | ahmadali.fr@gmail.com |
    | dino@yopmail.com      |
