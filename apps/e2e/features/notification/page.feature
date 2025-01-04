#language: fr
Fonctionnalité: Page de notifications
  Scénario: Voir la page de notifications
    Soit une base de données nourrie au grain
    Etant donné que je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    Quand je visite la page "/@~/notifications"
    Alors je vois dans le titre "Notifications :: Serkels"
    * je vois "Notifications"
    * je vois "vous a ajouté dans son cercle."
