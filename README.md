# Plannificateur académique

> **Page web de l'outil (version antérieure):** https://www-ens.iro.umontreal.ca/~miloszro/conseiller_pedagogique/planner/117510.html

Le planificateur académique est un outil (application web) de planification d’horaires et de cheminements visant à aider les étudiants dans leur parcours universitaire. 

## 📋 Fonctionnalités

### Choix de cours

- [ ] Naviguer et sélectionner un programme d'études avec son orientation
- [ ] Afficher la structure d'un programme liste de cours (blocs, segments) 
- [ ] Rechercher un cours
- [ ] Assigner un cours à un semestre
- [ ] Valider le choix des cours dans un semestre : conflits, disponibilité, nombre de crédits
- [ ] Valider le choix des cours pour l'ensemble du programme (en accord avec la structure du programme)
- [ ] Afficher l'emploi du temps recommandé/la liste des cours, le cas échéant

### Calendrier

- [ ] Afficher l'emploi du temps d'un ensemble de cours d'un semestre
- [ ] Afficher l'emploi du temps d'un ensemble de cours donnés
- [ ] Afficher l'emploi du temps d'un enseignant spécifique
- [ ] Affichage de l'horaire d'une salle spécifique (utilisation de la salle)
- [ ] Afficher les cours préalables d'un cours
- [ ] Proposer des liens d'information supplémentaires sur un cours

## 🌐 Infrastructure

The application infrastructure relies on a series of parser to 

### Parsur

### Base de données

- MongoDB

### API

- FastAPI

### Application

- React

# 📘 Documentation

- Wiki: https://doc.clickup.com/9014343564/d/h/8cmqxwc-94/1fee65e0584de8c
- Données: https://udemontreal-my.sharepoint.com/:f:/r/personal/robin_milosz_umontreal_ca/Documents/planner_CHAL_cheminements/summer2024/equipe_planner

# 🗂️ Organisation

Les dossiers du répertoire sont organisés comme suit:

- `\parser`: contient le code source du parseur de données provenant de Synchro
- `\api`: contient le code source de l'API
- `\utils`: contient des utilitaires partagés entre les différentes parties du projet
- `\app`: contient le code de l'application

# 🌟 Contribution

Si vous êtes intéressé à participer au projet, veuillez prendre contact avec [Robin MILOSZ](mailto:miloszro@iro.umontreal.ca).

## Contributeurs

- Zahra FiyouziSabah [@zahrafiyouzisabah](https://github.com/zahrafiyouzisabah)
- Gauransh KUMAR [@gauranshkumar](https://github.com/gauranshkumar)
- Julien-Charles CYR [@Julien-CharlesC](https://github.com/Julien-CharlesC)

