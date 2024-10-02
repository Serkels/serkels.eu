#language: fr
Fonctionnalité: Page de status
  Contexte:
    Etant donné que je navigue sur la page
    * je clique sur le bouton "Menu Burger"
    * je clique sur "Status"

  Scénario: Voir le statue des servers
    Alors je vois "Status"
    * je vois "Api Request🟩"
    * je vois "BFF Request🟩"
    * je vois "Api Database🟩"
    * je vois "BFF Database🟩"
    * je vois "BFF Session🟩"
    * je vois "Stream🟩"

  Scénario: Voir le statue des servers
    Soit une base de données nourrie au grain
    * je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    Quand je clique sur le bouton "Menu Burger"
    * je clique sur "Status"
    Alors je vois "Status"
    * je vois "Api Request🟩"
    * je vois "BFF Request🟩"
    * je vois "Api Database🟩"
    * je vois "BFF Database🟩"
    * je vois "BFF Session🈯️"
    * je vois "Stream🟩"
