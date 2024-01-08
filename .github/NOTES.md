
# Grid of 10 (gap 35px) 1085px 1366px

Colum 77px

Holy grail with Space between + Connection avec le footer
(3col) + auto + (6col) + auto + (3col)

Holy grail
(2col) + auto + (8col)

11eme col avec les marges de coté

Accueil
6 col ( 4 pour le text + 3 pour le panel)
Icon 2 col

col de gauche sa ns shadom 5px 5px

## Colum 77

## Main - 6

## aside - 2

### To clarify

- Primary Gradiant use variant of primary colors
  § Change the gradient en function du contenu pour garder l'inclinaison des couleurs d'origin
- Verification of official fonts and global font size
  § 14 pixel de base
  § font roboto par default
- Echange is very different that other pages
  - aside title color § C'est le meme que les autre
  - no aside shadow § pas de shadow
- Opportunity left aside bar should stretch to the footer ?
- FAQ layout style should match Opportuniy or echange ?

§ Header (button 121px) padding

# TODO

- Change text base size to 14px without changing the spacings values in the tailwind theme.
- opportunité
- separate category per subject
- supprimer les liens sur tous les inputs !
- cacher les messages bloqué dans les questions
- question répondu
  - add metadata repo
  - the user how ask can validate the answer
  - button "useful answer" section display by default
  - users can still answer answered questions
  - button response keep displaying reponses
  - question owner can "unpin" useful reponses
  - line on the bottom of the card same as default footer line but align left with the text
- studient user "university mandatory
- add sentry browser secret on vercel !

# FUTUR

- Gestion de group (privé / public)
- recherche de group par nom / ville / category (nom unique)
- recherche d'utilisateur

# 02/11/2023

- Exchange

  - Change "When" date to "expiry_date" (date limite)
  - date should be greater than today
  - Display expiry_date in exchange header
    - danger => if the date is in the past
    - warning => if the date is today
    - success => if the date is in the futur
  - Sort exchange by expiry_date in exchange header
  - Add filter to allow display old exchanges (successful or not)
  - A exchange is successful if all the places are taken

- opportunity
  - Display expiry_date in exchange header
    - danger => if the date is in the past
    - warning => if the date is today
    - success => if the date is in the futur
