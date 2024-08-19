#language: fr
Fonctionnalité: Page de status
  Contexte:
    Etant donné que je navigue sur la page
    * je clique sur le bouton "Menu Burger"
    * je clique sur "Status"

  Scénario: Voir le statue des servers
    Alors je vois "Api Request"
    * je vois "Database"
    * je vois "Stream"
