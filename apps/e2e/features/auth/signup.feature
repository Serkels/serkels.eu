#language: fr
Fonctionnalité: Inscription d'un utilisateur

Contexte:
  Soit une base de données nourrie au grain

  Plan du scénario: Inscription de <email>
    Etant donné que je navigue sur la page
    * je clique sur "Créer un compte"
    * je clique sur le champ "Email"
    * je tape "<email>"
    * je clique sur le champ "Mot de passe"
    * je tape "<password>"
    * je clique sur le champ "Confirmer le mot de passe"
    * je tape "<password>"
    * je clique sur le bouton "Terminer"
    * je vois "Vérification"
    * je confirme mon adresse email
    * je vois "Welcome"

  Exemples:
    | email                 | password    |
    | luc@skywalker.xyz     | 4(Q5md#K    |
