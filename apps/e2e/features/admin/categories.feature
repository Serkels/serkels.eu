#language: fr
Fonctionnalité: Gestion des catégories

Contexte:
  Soit une base de données nourrie au grain
  * je navigue sur la page
  * je me connecte en tant que "admin@yopmail.com"

  Scénario: Création d'une catégorie
    Quand je clique sur "Créer une catégorie"
    Alors je vois "Créer une catégorie"
    Quand je clique sur le champ "Nom"
    Et je tape "Test"
    Quand je clique sur le bouton "Créer"
    Alors je vois "Test"
