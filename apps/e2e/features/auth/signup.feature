#language: fr
Fonctionnalité: Inscription d'un étudiant

Contexte:
  Soit une base de données nourrie au grain

  Scénario: Inscription de Didier
    Etant donné que je navigue sur la page

    Quand je clique sur le bouton "Créer un compte"
    Alors je vous le champ "Adresse email d'inscription"

    Quand je clique sur le champ "Adresse email d'inscription"
    * je tape "didier@yopmail.com"
    Alors je vois le bouton "Valider"
    
    Quand je clique sur le bouton "Valider"
  
    Alors je vois "Consultez votre boite mail pour confirmer votre identité"

    Quand je clique sur le lien de connexion
    * je vois "Créer d'un compte étudiant"

  # Formulaire de création d'un étudiant
    Quand je clique sur "Nom et prénom"
    Et je tape "Didier Dupont"

    Quand je clique sur "Université"
    Et je tape "Paris 1"

    Quand je clique sur "Domaine d'étude"
    Et je tape "Informatique"

    Quand je clique sur "Biographie"
    Et je tape "Je suis un étudiant passionné par la programmation"

    Quand je clique sur "Ville"
    Et je tape "Paris"

    Quand je clique sur "Langues parlées"
    Et je tape "Français"

    Quand je clique sur "Intéressé.e par"
    Et je choisis l'option "Autres"

    Quand je clique sur le bouton "Terminer"
    Alors je vois "Vérification"

  #

    Quand je clique sur le lien de connexion
    Alors je vois "Vous êtes connecté en tant que : Didier Dupont"
