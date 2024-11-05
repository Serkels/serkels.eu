#language: fr
Fonctionnalité: Connexion d'un utilisateur

Contexte:
  Soit une base de données nourrie au grain

  Plan du scénario: Connexion de <email>
    Etant donné que je navigue sur la page
    Quand je me connecte en tant que "<email>"
    Alors je vois "Vous êtes connecté"
  Exemples:
    | email                         |
    | ahmadali.fr@gmail.com         |
    | dino@yopmail.com              |
    | douglas@yopmail.com           |
    | johan@yopmail.com             |
    | onedoesuniversity@yopmail.com |

  Scénario: Connexion d'un utilisateur inconnu
    Etant donné que je navigue sur la page
    Quand je clique sur le champ "Adresse email de connexion"
    * je tape "yohan@yopmail.com"
    * je clique sur le bouton "Se connecter"
    Alors je vois "Aucun utilisateur trouvé."
