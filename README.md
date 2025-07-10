# phone-manager

## Description

Phone-manager est une application web permettant la gestion des téléphones (ajout, modification, suppression, affichage) via une interface frontend React et un backend Node.js avec Express. Les données sont stockées dans une base PostgreSQL.

## Technologies utilisées

- Backend : Node.js, Express.js
- Frontend : React
- Base de données : PostgreSQL
- Conteneurisation : Docker

## Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/NidhalDjerbi/phone-manager.git
```

2. Installer les dépendances en local pour backend et frontend :

```bash
cd backend
npm install

cd ../frontend
npm install
```

3. Créer un fichier `.env` à partir du fichier `.env.sample` dans les dossiers backend et frontend et adapter les variables d’environnement si besoin.

4. Lancer la base de données PostgreSQL avec Docker Compose :

```bash
docker-compose up db
```

5. **Construire** le frontend (pour la production) :

```bash
cd frontend
npm run build
```

6. Lancer les tests unitaires (backend et frontend) :

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

7. Lancer le backend (en développement) :

```bash
cd backend
npm run dev
```

8. Lancer le frontend (en développement) :

```bash
cd frontend
npm run dev
```

## Lancer l'application via docker-compose (alternative plus simple):

```bash
docker-compose up --build
```

## Utilisation

- Accéder à l’application frontend via `http://localhost:3000` (ou le port configuré)
- Gérer les téléphones : créer, modifier, supprimer, afficher la liste

## Fonctionnalités principales

- CRUD complet sur les téléphones (IMEI, modèle, marque, etc.)
- Validation des données côté backend
- Interface utilisateur réactive avec React
- Persistance des données dans PostgreSQL

## Structure du projet

- `/backend` : code backend Node.js/Express
- `/frontend` : code frontend React
- `docker-compose.yml` : orchestration des services (DB + backend + frontend)

## Auteur

NJ.

## Licence

MIT
