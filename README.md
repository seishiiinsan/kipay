# Kipay - Les bons comptes font les bons amis 💸

Kipay est une application web moderne de gestion de dépenses partagées (type Tricount ou Splitwise). Elle permet de créer des groupes, d'ajouter des dépenses, et de calculer automatiquement "qui doit combien à qui" pour simplifier les remboursements.

Le projet se distingue par son design **Néo-Brutaliste** affirmé et son expérience utilisateur fluide.

![Kipay Preview](/public/og-image.jpg)

## ✨ Fonctionnalités Clés

*   **Authentification Sécurisée :** Inscription et connexion via Email/Mot de passe (JWT).
*   **Gestion de Groupes :** Création de groupes illimités, invitation par code unique.
*   **Dépenses Intelligentes :**
    *   Ajout rapide avec description, montant et payeur.
    *   Sélection des participants concernés.
    *   Catégorisation (Alimentation, Transport, etc.).
*   **Équilibrage Automatique :** Algorithme de simplification des dettes pour minimiser le nombre de virements.
*   **Tableau de Bord :** Vue d'ensemble des soldes (ce qu'on vous doit vs ce que vous devez).
*   **Statistiques :** Visualisation des dépenses par catégorie et par membre.
*   **Export :** Téléchargement des comptes en CSV.
*   **Design Responsive :** Interface adaptée aux mobiles et aux grands écrans.
*   **Mode Sombre :** Thème clair/sombre géré par l'utilisateur.

## 🛠 Stack Technique

*   **Frontend :** [Next.js 15/16](https://nextjs.org/) (App Router), [React](https://react.dev/).
*   **Styling :** [Tailwind CSS v4](https://tailwindcss.com/).
*   **Backend :** API Routes Next.js (Node.js).
*   **Base de Données :** [PostgreSQL](https://www.postgresql.org/).
*   **Authentification :** JWT (JSON Web Tokens) avec `jose` et `bcryptjs`.
*   **Infrastructure :** Docker & Docker Compose pour la base de données locale.

## 🚀 Installation & Démarrage

### Prérequis

*   Node.js 18+
*   Docker & Docker Compose

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/kipay.git
cd kipay
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer la base de données

Démarrez le conteneur PostgreSQL via Docker :

```bash
docker-compose up -d
```

### 4. Initialiser la base de données

Le script `init.sql` se lance automatiquement à la création du conteneur.
Pour peupler la base avec des données de test (utilisateurs, groupes, dépenses), exécutez :

```bash
cat database/seed.sql | docker-compose exec -T db psql -U kipay -d kipay
```

*Note : Les utilisateurs de test ont tous le mot de passe `password123`.*

### 5. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
# Base de données (correspond au docker-compose.yml)
POSTGRES_USER=kipay
POSTGRES_PASSWORD=kipay
POSTGRES_DB=kipay
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Sécurité (Générez une clé aléatoire pour la prod)
JWT_SECRET_KEY=votre-cle-secrete-tres-longue-et-securisee

# Email (Optionnel, pour Resend)
RESEND_API_KEY=re_...
```

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Rendez-vous sur [http://localhost:3000](http://localhost:3000).

## 📂 Structure du Projet

```
kipay/
├── app/                    # Pages et API (Next.js App Router)
│   ├── api/                # Endpoints Backend
│   │   ├── auth/           # Login, Register
│   │   ├── groups/         # CRUD Groupes, Membres, Dépenses, Stats
│   │   ├── users/          # Profil, Solde global
│   │   └── ...
│   ├── dashboard/          # Espace connecté (Groupes, Profil, Settings)
│   ├── (landing)/          # Page d'accueil publique
│   └── layout.js           # Layout global (Providers)
├── components/             # Composants React réutilisables (UI)
├── context/                # Contextes React (Auth, Toast)
├── database/               # Scripts SQL (Init, Seed, Migrations)
├── lib/                    # Utilitaires (DB connection, Auth helpers)
└── public/                 # Images et assets statiques
```

## 📝 Scripts Utiles

*   **`npm run dev`** : Lance le serveur de développement.
*   **`npm run build`** : Compile l'application pour la production.
*   **`npm run start`** : Lance l'application compilée.

## 🛡️ Sécurité

*   Les mots de passe sont hachés avec `bcrypt` avant stockage.
*   L'accès aux routes API sensibles est protégé par un Middleware vérifiant le token JWT.
*   Les injections SQL sont prévenues grâce à l'utilisation de requêtes paramétrées (`pg`).

## 📄 Licence

Ce projet est sous licence MIT.
