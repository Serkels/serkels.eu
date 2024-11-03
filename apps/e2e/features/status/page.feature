#language: fr
Fonctionnalité: Page de status
  Contexte:
    Etant donné que je navigue sur la page
    * je clique sur "Status"

  Scénario: Voir le statut des serveurs
    Alors je vois "Status"
    * je vois "Api Request🟩"
    * je vois "BFF Request🟩"
    * je vois "Api Database🟩"
    * je vois "BFF Database🟩"
    * je vois "BFF Session🟩"
    * je vois "Stream🟩"

  Scénario: Voir le statut des serveurs
    Soit une base de données nourrie au grain
    * je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    * je clique sur "Status"
    
    Alors je vois "Status"
    * je vois "Api Request🟩"
    * je vois "BFF Request🟩"
    * je vois "Api Database🟩"
    * je vois "BFF Database🟩"
    * je vois "BFF Session🈯️"
    * je vois "Stream🟩"
