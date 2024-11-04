#language: fr
Fonctionnalité: Archiver un échange

  Contexte:
    Soit une base de données nourrie au grain
    * je navigue sur la page
    * je me connecte en tant que "jackie@yopmail.com"
    * je clique sur le champ "Recherche"
    * je tape "café"
    * je clique sur "Voir mes échanges"

  Scénario: Jackie archive son échange
    Quand je clique sur la légende "Menu"
    Et je clique sur "Supprimer"

    # Alors je vois dans le titre "Inbox :: Exchanges :: Serkels"
    # * je vois "P'tit pause café avec l'ami Jackie"
    # * je vois "Aucune discussion disponible pour le moment"
