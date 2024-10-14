#language: fr
Fonctionnalité: Consulter la boîte de réception d'un échange

  Contexte:
    Soit une base de données nourrie au grain
    * je navigue sur la page
    * je me connecte en tant que "jackie@yopmail.com"

  Scénario: Jackie consult son échange pour un café à partir de son inbox
    Quand je clique sur la légende "Link to my exchanges inbox"

    Alors je vois dans le titre "Inbox :: Exchanges :: Serkels"
    * je vois "Aucun échange"
    # * je vois "J'aime le café"

  Scénario: Jackie consult son échange pour un café à partir de la liste des échanges
    * je clique sur le champ "Recherche"
    * je tape "café"
    * je vois "P'tit pause café avec l'ami Jackie"

    Quand je clique sur "Voir mes échanges"

    Alors je vois dans le titre "Inbox :: Exchanges :: Serkels"
    * je vois "P'tit pause café avec l'ami Jackie"
    * je vois "Aucune discussion disponible pour le moment"
