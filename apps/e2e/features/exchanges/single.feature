#language: fr
Fonctionnalité: Voir un exchange

  Contexte:
    Soit une base de données nourrie au grain

  Scénario: Un visiteur peux vois un échange
    Etant donné que je navigue sur la page
    Quand je clique sur le bouton "Échanges"
    Alors je vois dans le titre "Exchange :: Serkels"
    * je clique sur le bouton "Accepter"
    * je clique sur le champ "Recherche"
    * je tape "Concert de jazz"
    * je ne vois pas "Bookmark the exchange"
    * je clique sur le bouton "Share the exchange"

  Scénario: Je sauvegarde un échange
    Etant donné que je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    Quand je clique sur le bouton "Échanges"
    Alors je vois dans le titre "Exchange :: Serkels"
    * je clique sur le champ "Recherche"
    * je tape "Concert de jazz"
    * je clique sur le bouton "Bookmark the exchange"
    * je vois "Cet échange est désormais sauvegardé"
