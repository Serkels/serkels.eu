#language: fr
Fonctionnalité: Envoyer un message a Jackie Smith

  Contexte:
    Soit une base de données nourrie au grain

  Scénario: Douglas envoie un message à Jackie Smith
    Etant donné que je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    * je vois dans le titre "Exchange :: Serkels"
    * je clique sur le bouton "Accepter"
    * je clique sur la légende "Link to my profile"
    * je vois dans le titre "About :: Serkels"
    * je clique sur "Messages privés"
    * je vois dans le titre "Inbox :: Serkels"
    * je clique sur "Écrire"
    * je vois dans le titre "Write to :: Inbox :: Serkels"

    Quand je clique sur "Jackie Smith"

    Alors je vois dans le titre "Jackie Smith :: Inbox :: Serkels"
    * je tape "Hey Jackie, tu connais Hiatus Kaiyote ?"
    * je clique sur la légende "Send"
    * je vois "Hey Jackie, tu connais Hiatus Kaiyote ?"
    * je vois dans le titre "Jackie Smith :: Inbox :: Serkels"
