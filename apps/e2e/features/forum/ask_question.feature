#language: fr
Fonctionnalité: Posez une question

  Scénario: Poser une question sur le forum
    Soit une base de données nourrie au grain
    * je navigue sur la page
    * je me connecte en tant que "douglas@yopmail.com"
    * je clique sur le bouton "Discussions"
    * je vois dans le titre "Discussions :: Serkels"
    * je clique sur le bouton "Pose une question aux étudiant.e.s ..."
    * je clique sur le champ "Pose une question aux étudiant.e.s ..."
    * je tape "Comment je peux faire pour résoudre mon problème ?"
    Quand je clique sur le bouton "Envoyer"
    Alors je vois "Question postée."
    * je vois "Comment je peux faire pour résoudre mon problème ?"
