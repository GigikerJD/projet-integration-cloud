# Rapport de Projet — Intégration du Cloud
## Application de Gestion de Tâches Cloud-Native

**Auteur :** FERROL Nelgie
**Formation :** M2 APP — 2025/2026
**Module :** S9 — Intégration du Cloud
**Date :** Mars 2026

---

## Table des matières

1. [Introduction et objectifs](#1-introduction-et-objectifs)
2. [Architecture globale](#2-architecture-globale)
3. [Infrastructure Docker](#3-infrastructure-docker)
4. [Backend — API REST](#4-backend--api-rest)
5. [Frontend — Interface utilisateur](#5-frontend--interface-utilisateur)
6. [Sécurité et authentification](#6-sécurité-et-authentification)
7. [Base de données](#7-base-de-données)
8. [Flux applicatifs](#8-flux-applicatifs)
9. [Structure des fichiers](#9-structure-des-fichiers)
10. [Bilan et perspectives](#10-bilan-et-perspectives)

---

## 1. Introduction et objectifs

### 1.1 Présentation du projet

Ce projet consiste en le développement d'une **application web de gestion de tâches** conçue selon les principes **cloud-native**. L'objectif principal est de mettre en œuvre les concepts d'intégration du cloud à travers une architecture **microservices conteneurisée**.

L'application permet à des utilisateurs authentifiés de créer, gérer et suivre leurs tâches selon différents niveaux de priorité et de statut. Un système de rôles (ADMIN / CLIENT) différencie les droits d'accès.

### 1.2 Objectifs pédagogiques

| Objectif | Technologie utilisée |
|----------|---------------------|
| Conteneurisation des services | Docker + Docker Compose |
| Architecture microservices | 2 backends + frontend + BDD |
| API REST sécurisée | Express.js + JWT |
| Interface moderne | Vue 3 + TypeScript |
| Persistance des données | MongoDB |
| Build multi-étapes | Dockerfile multi-stage |

---

## 2. Architecture globale

### 2.1 Vue d'ensemble

L'application suit une architecture **4 couches** orchestrées par Docker Compose :

```
┌─────────────────────────────────────────────────────────────┐
│                     Réseau Docker Interne                    │
│                                                             │
│  ┌──────────────┐        ┌──────────────┐                  │
│  │   Frontend   │───────▶│  Backend     │──────┐           │
│  │  (Nginx:80)  │        │  (Node:4001) │      │           │
│  └──────────────┘        └──────────────┘      │           │
│         ▲                ┌──────────────┐      ▼           │
│         │                │  Backend1    │  ┌────────────┐  │
│    [Navigateur]          │  (Node:4002) │─▶│  MongoDB   │  │
│                          └──────────────┘  │  (:27017)  │  │
│                                            └────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Ports exposés

| Service | Port interne | Port externe | Rôle |
|---------|-------------|-------------|------|
| frontend | 80 | 80 | Serveur statique Nginx |
| backend | 4001 | 4001 | API principale |
| backend1 | 4002 | 4002 | API secondaire |
| mongodb | 27017 | 27017 | Base de données |

### 2.3 Dépendances entre services

```
frontend  ──depends_on──▶  backend
backend   ──depends_on──▶  mongodb
backend1  ──depends_on──▶  mongodb
```

---

## 3. Infrastructure Docker

### 3.1 Docker Compose (`docker-compose.yml`)

Le fichier `docker-compose.yml` orchestre les 4 services. Chaque service est isolé dans son propre conteneur et communique via le réseau Docker interne.

**Particularités :**
- Le service `mongodb` utilise un **volume nommé** (`mongodb-data`) pour la persistance des données entre redémarrages.
- La base de données cible est `cloud-taskmanager`.
- Les variables d'environnement injectées incluent `PORT` et `MONGO_URI`.

### 3.2 Dockerfile — Backend

```dockerfile
FROM node:20-alpine          # Image légère Alpine Linux
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev \      # Installation des dépendances production uniquement
 && npm install tsx           # Ajout de tsx pour TypeScript
COPY . .
EXPOSE 4001
CMD ["npx", "tsx", "server.ts"]  # Exécution TypeScript sans compilation préalable
```

**Points clés :**
- Base `node:20-alpine` : image minimaliste (~50MB vs ~900MB pour node:20)
- `npm ci --omit=dev` : n'installe pas les dépendances de développement en production
- `tsx` permet d'exécuter du TypeScript directement sans étape de compilation

### 3.3 Dockerfile — Frontend (Multi-stage)

```dockerfile
# ── Stage 1 : Build ─────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build            # Génère le dossier /app/dist

# ── Stage 2 : Serve ─────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Configuration nginx pour Vue Router (HTML5 History mode)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Avantage du multi-stage build :**
- L'image finale ne contient **pas Node.js** — uniquement Nginx + les fichiers statiques compilés.
- Réduction drastique de la taille de l'image finale (~20MB vs ~400MB).
- Séparation claire entre environnement de build et de production.

### 3.4 Variables d'environnement

| Variable | Valeur | Service |
|----------|--------|---------|
| `PORT` | 4001 | backend |
| `PORT` | 4002 | backend1 |
| `MONGO_URI` | `mongodb://mongodb:27017/cloud-taskmanager` | backend, backend1 |
| `JWT_SECRET` | (défini dans .env) | backend |

---

## 4. Backend — API REST

### 4.1 Stack technique

| Dépendance | Version | Rôle |
|-----------|---------|------|
| Express | 5.2.1 | Framework HTTP |
| Mongoose | 9.2.4 | ODM MongoDB |
| jsonwebtoken | 9.0.3 | Authentification JWT |
| bcrypt | 6.0.0 | Hashage des mots de passe |
| TypeScript | 5 | Typage statique |
| tsx | — | Exécution TypeScript |
| nodemon | — | Hot reload (développement) |
| cors | — | Gestion des origines |

### 4.2 Structure du backend

```
backend/src/
├── server.ts               ← Point d'entrée Express
├── config/
│   └── database.ts         ← Connexion MongoDB
├── models/
│   ├── User.ts             ← Schéma utilisateur (Mongoose)
│   └── Task.ts             ← Schéma tâche (Mongoose)
├── routes/
│   ├── authRoutes.ts       ← /api/auth (login, register)
│   ├── taskRoutes.ts       ← /api/tasks (CRUD)
│   └── userRoutes.ts       ← /api/users (profil)
└── middlewares/
    └── authMiddleware.ts   ← Vérification JWT + rôles
```

### 4.3 Modèles de données

#### Modèle Utilisateur (`User.ts`)

```typescript
{
  email:     String (unique, required),
  password:  String (hashé bcrypt, 12 rounds),
  firstname: String,
  lastname:  String,
  role:      String,  // ex: "ADMIN", "CLIENT"
  birthdate: Date,
  createdAt: Date,    // auto (timestamps)
  updatedAt: Date     // auto (timestamps)
}
```

#### Modèle Tâche (`Task.ts`)

```typescript
{
  title:       String (required),
  userID:      String (required, lien vers l'utilisateur),
  description: String,
  status:      Enum ["to do", "in progress", "done", "archived"],
  priority:    Enum ["low", "medium", "high"],
  dueDate:     Date (optionnel),
  completedAt: Date (défaut: Date.now),
  createdAt:   Date,  // auto
  updatedAt:   Date   // auto
}
```

### 4.4 Endpoints de l'API

#### Authentification (`/api/auth`)

| Méthode | Route | Description | Auth requise |
|---------|-------|-------------|-------------|
| POST | `/api/auth/register` | Inscription + retourne JWT | Non |
| POST | `/api/auth/login` | Connexion + retourne JWT (7j) | Non |

**Exemple — Corps de requête Login :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse"
}
```

**Exemple — Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Utilisateurs (`/api/users`)

| Méthode | Route | Description | Auth requise |
|---------|-------|-------------|-------------|
| GET | `/api/users/:id` | Profil d'un utilisateur (sans mot de passe) | JWT |
| GET | `/api/users/` | Liste de tous les utilisateurs | JWT + ADMIN |

#### Tâches (`/api/tasks`)

| Méthode | Route | Description | Auth requise |
|---------|-------|-------------|-------------|
| GET | `/api/tasks` | Tâches de l'utilisateur connecté (tri: date desc) | JWT |
| GET | `/api/tasks/all` | Toutes les tâches | JWT + ADMIN |
| GET | `/api/tasks/:id` | Une tâche (vérif. propriété) | JWT |
| POST | `/api/tasks` | Créer une tâche (status défaut: "to do") | JWT |
| PUT | `/api/tasks/:id` | Mettre à jour une tâche | JWT |
| DELETE | `/api/tasks/:id` | Supprimer une tâche | JWT |

### 4.5 Middleware d'authentification (`authMiddleware.ts`)

Le middleware intercepte chaque requête protégée et :

1. Extrait le token JWT du header `Authorization: Bearer <token>`
2. Vérifie la signature avec `JWT_SECRET`
3. Injecte les données utilisateur (`id`, `role`) dans `req.user`
4. Pour les routes admin : vérifie que `req.user.role === "ADMIN"`

```typescript
// Interface étendue
interface AuthRequest extends Request {
  user?: { id: string; role: string }
}
```

### 4.6 Backend1

Le service `backend1` (port 4002) est une instance secondaire avec la même configuration de dépendances que `backend`. Il partage la même base MongoDB. Ce service illustre le principe de **scalabilité horizontale** des microservices — plusieurs instances du même service peuvent coexister.

---

## 5. Frontend — Interface utilisateur

### 5.1 Stack technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| Vue 3 | 3.x | Framework SPA |
| TypeScript | 5.9 | Typage statique |
| Vite | 7.3.1 | Bundler & dev server |
| Tailwind CSS | 4.2.1 | Framework CSS utilitaire |
| Pinia | 3.0.4 | State management |
| Vue Router | 5.0.3 | Routing SPA |
| TanStack Vue Query | 5.92.9 | Cache & gestion des requêtes |
| Axios | 1.13.6 | Client HTTP |
| universal-cookie | 8.0.1 | Gestion des cookies |
| lucide-vue-next | 0.577.0 | Bibliothèque d'icônes |

### 5.2 Structure du frontend

```
frontend/src/
├── main.ts                  ← Point d'entrée (Pinia + Router + Vue Query)
├── App.vue                  ← Composant racine
├── style.css                ← Styles globaux
├── config/
│   └── router.ts            ← Définition des routes
├── stores/
│   └── authStores.ts        ← Store Pinia (auth)
├── models/
│   ├── api.models.ts        ← Types & appels API Axios
│   └── api.user.ts          ← Appels API utilisateur
├── pages/
│   ├── Home.vue             ← Page d'accueil (landing)
│   ├── Forms.vue            ← Conteneur login/register
│   ├── Dashboard.vue        ← Tableau de bord des tâches
│   └── Settings.vue         ← Paramètres (stub)
├── components/
│   ├── forms/
│   │   ├── Login.vue        ← Formulaire de connexion
│   │   └── Register.vue     ← Formulaire d'inscription
│   └── dashboard/
│       └── Task.vue         ← Carte de tâche
└── layout/
    ├── Layout.vue           ← Wrapper principal
    ├── Header.vue           ← Barre de navigation
    └── Footer.vue           ← Pied de page
```

### 5.3 Routing et navigation

```typescript
// Routes définies dans router.ts
const routes = [
  {
    path: '/',
    component: Layout,         // Wrapper avec Header + Footer
    children: [
      { path: '/',          component: Home,       // Accueil public
        meta: { title: 'Accueil', withContent: true }
      },
      { path: '/forms',     component: Forms,      // Login/Register
        meta: { requiresAuth: false, withContent: false }
        // ↑ redirige vers /dashboard si déjà connecté
      },
      { path: '/dashboard', component: Dashboard,  // Tableau de bord
        meta: { requiresAuth: true, withContent: true }
      },
      { path: '/settings',  component: Settings,   // Paramètres
        meta: { requiresAuth: true, withContent: true }
      }
    ]
  }
]
```

**Guards de navigation :**
- `requiresAuth: true` → redirige vers `/forms` si non authentifié
- Sur `/forms` → redirige vers `/dashboard` si déjà connecté

### 5.4 State management (Pinia)

Le store `authStore` gère l'état d'authentification :

```typescript
// authStores.ts
const authStore = defineStore('auth', {
  state: () => ({
    loggedIn: cookies.get('loggedIn') || 'false',  // "true" / "false"
    token:    cookies.get('token') || ''           // JWT token
  }),
  getters: {
    getLoggedIn: (state) => state.loggedIn === 'true',
    getToken:    (state) => state.token
  },
  actions: {
    login(token: string) {
      cookies.set('token', token, { path: '/', domain: 'localhost' })
      cookies.set('loggedIn', 'true', { path: '/', domain: 'localhost' })
      this.token = token
      this.loggedIn = 'true'
    },
    logout() {
      cookies.remove('token')
      cookies.remove('loggedIn')
      this.token = ''
      this.loggedIn = 'false'
    }
  }
})
```

**Persistance :** L'état est sauvegardé dans les **cookies du navigateur** pour survivre aux rechargements de page.

### 5.5 Pages principales

#### Page d'accueil (`Home.vue`)
- Section hero avec titre et boutons d'action
- Grille 3 colonnes présentant les fonctionnalités
- Boutons adaptatifs selon l'état de connexion

#### Page Formulaires (`Forms.vue`)
- Onglets de basculement entre Login et Register
- Design plein écran sans header/footer (`withContent: false`)

#### Composant Login (`Login.vue`)
- Formulaire email + mot de passe
- Pattern "floating label" (labels animés)
- Gestion du chargement via Vue Query `useMutation`
- Affichage des erreurs backend
- Redirection automatique vers `/dashboard` après succès

#### Dashboard (`Dashboard.vue`)
- Message de bienvenue avec prénom de l'utilisateur
- Badge de rôle (ADMIN / CLIENT)
- Cartes de statistiques :
  - Nombre total de tâches
  - Tâches "In Progress"
  - Tâches "Done"
  - Tâches "To Do"
- Liste des tâches avec composant `Task.vue`
- Utilise `useQuery` pour fetcher le profil utilisateur

#### Composant Tâche (`Task.vue`)
- Affiche : titre, description, statut, date
- Badge de statut coloré :
  - "to do" → gris
  - "in progress" → bleu
  - "done" → vert
- Design en carte responsive (Tailwind)

### 5.6 Gestion des environnements

Le frontend utilise des variables d'environnement Vite selon le contexte :

**Développement** (`.env`) :
```
VITE_AUTH_URL  = http://localhost:4001/api/auth
VITE_USERS_URL = http://localhost:4001/api/users
VITE_TASKS_URL = http://localhost:4001/api/tasks
```

**Production** (`.env.production`) :
```
VITE_AUTH_URL  = /api/auth
VITE_USERS_URL = /api/users
VITE_TASKS_URL = /api/tasks
```
En production, les URLs relatives permettent à Nginx d'agir comme **reverse proxy** et de router les requêtes vers le backend approprié.

---

## 6. Sécurité et authentification

### 6.1 Flux d'authentification

```
┌──────────┐   1. POST /api/auth/login    ┌──────────┐
│ Frontend │ ─────────────────────────── ▶│ Backend  │
│          │    { email, password }        │          │
│          │ ◀ ─────────────────────────── │          │
│          │   2. { token: JWT }           │ Vérifie  │
│          │                               │ bcrypt   │
│ Stockage │   3. Cookie (token, loggedIn) │ + Signe  │
│ Pinia +  │                               │ JWT      │
│ Cookies  │                               └──────────┘
└──────────┘

┌──────────┐   4. GET /api/tasks          ┌──────────┐
│ Frontend │ ─────────────────────────── ▶│ Backend  │
│          │   Authorization: Bearer JWT   │          │
│          │ ◀ ─────────────────────────── │ Vérifie  │
│          │   5. Données protégées        │ JWT      │
└──────────┘                               └──────────┘
```

### 6.2 Mécanismes de sécurité

| Mécanisme | Implémentation | Détail |
|-----------|---------------|--------|
| Hashage mot de passe | bcrypt | 12 rounds de salt |
| Authentification | JWT | Expiration 7 jours |
| Transport du token | HTTP Header | `Authorization: Bearer <token>` |
| Persistance session | Cookies | Domain: localhost |
| Contrôle d'accès | RBAC | Rôles ADMIN / CLIENT |
| Protection CORS | cors middleware | Origines: localhost:5173 (dev) |
| Exclusion du mot de passe | Mongoose projection | `.select('-password')` |

### 6.3 Contrôle d'accès basé sur les rôles (RBAC)

```
Rôle CLIENT :
  ✓ Voir ses propres tâches
  ✓ Créer / modifier / supprimer ses tâches
  ✓ Voir son profil
  ✗ Accès à la liste des utilisateurs
  ✗ Accès aux tâches des autres utilisateurs

Rôle ADMIN :
  ✓ Tout ce que CLIENT peut faire
  ✓ Voir toutes les tâches (GET /api/tasks/all)
  ✓ Voir tous les utilisateurs (GET /api/users/)
```

---

## 7. Base de données

### 7.1 MongoDB

Le projet utilise **MongoDB 7** comme base de données NoSQL.

**Connexion** (`database.ts`) :
```
URI : mongodb://mongodb:27017/cloud-taskmanager
      └──────┘  └───────┘      └───────────────┘
      Protocole  Nom du service  Nom de la base
                 Docker Compose
```

**Persistance** : Volume Docker nommé `mongodb-data` garantit que les données survivent aux redémarrages des conteneurs.

### 7.2 Collections

| Collection | Modèle | Champs principaux |
|-----------|--------|------------------|
| `users` | User.ts | email, password (hash), firstname, lastname, role |
| `tasks` | Task.ts | title, userID, status, priority, dueDate |

### 7.3 Indexation et relations

- `users.email` : index unique (contrainte d'unicité)
- `tasks.userID` : référence non-relationnelle vers `users._id`
- Timestamps automatiques (`createdAt`, `updatedAt`) sur les deux collections

---

## 8. Flux applicatifs

### 8.1 Inscription d'un utilisateur

```
1. Utilisateur remplit le formulaire Register.vue
2. POST /api/auth/register { email, password, firstname, lastname, role }
3. Backend vérifie que l'email n'existe pas déjà
4. Hashage du mot de passe (bcrypt, 12 rounds)
5. Sauvegarde en base (collection users)
6. Génération JWT signé (expiration 7j)
7. Retour { token } au frontend
8. Store Pinia : login(token) → cookies
9. Redirection vers /dashboard
```

### 8.2 Connexion d'un utilisateur

```
1. Utilisateur remplit le formulaire Login.vue
2. POST /api/auth/login { email, password }
3. Backend recherche l'utilisateur par email
4. bcrypt.compare(password, user.password)
5. Si succès : génération JWT { id, role }
6. Retour { token } au frontend
7. Store Pinia : login(token) → cookies
8. Redirection vers /dashboard
```

### 8.3 Affichage du Dashboard

```
1. Navigation vers /dashboard
2. Guard router : vérifie getLoggedIn (cookie)
3. Dashboard.vue monte → useQuery('user', getUserApi)
4. GET /api/users/:id  (token dans header)
5. Middleware authMiddleware vérifie JWT
6. Retour des données utilisateur
7. Affichage : bienvenue + badge rôle + stats + tâches
```

### 8.4 Gestion des tâches

```
Créer une tâche :
POST /api/tasks  { title, description, priority, dueDate }
→ userID automatiquement assigné depuis le JWT
→ status par défaut : "to do"

Lister ses tâches :
GET /api/tasks
→ Filtre automatique sur userID du JWT
→ Triées par createdAt DESC

Modifier une tâche :
PUT /api/tasks/:id  { status: "done" }
→ Vérification ownership (userID == JWT.id) ou rôle ADMIN

Supprimer une tâche :
DELETE /api/tasks/:id
→ Même vérification ownership
```

---

## 9. Structure des fichiers

### 9.1 Arborescence complète

```
projet-integration-cloud/
│
├── docker-compose.yml           ← Orchestration des 4 services
├── .gitignore                   ← Exclusions Git
├── RAPPORT.md                   ← Ce rapport
│
├── backend/                     ← Service API principal (port 4001)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                     ← Variables d'env (ignoré par git)
│   └── src/
│       ├── server.ts            ← Express app + montage des routes
│       ├── config/
│       │   └── database.ts      ← Connexion Mongoose
│       ├── models/
│       │   ├── User.ts          ← Schema + Model Mongoose
│       │   └── Task.ts          ← Schema + Model Mongoose
│       ├── routes/
│       │   ├── authRoutes.ts    ← POST /register, POST /login
│       │   ├── taskRoutes.ts    ← CRUD /tasks
│       │   └── userRoutes.ts    ← GET /users
│       └── middlewares/
│           └── authMiddleware.ts ← JWT + RBAC
│
├── backend1/                    ← Service API secondaire (port 4002)
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── src/
│       └── server.ts            ← Stub serveur Express
│
└── frontend/                    ← Application Vue 3 (port 80)
    ├── Dockerfile               ← Multi-stage build
    ├── vite.config.ts
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── index.html
    ├── .env                     ← Dev (URLs localhost)
    ├── .env.production          ← Prod (URLs relatives)
    └── src/
        ├── main.ts              ← createApp + plugins
        ├── App.vue              ← <RouterView/>
        ├── style.css
        ├── config/
        │   └── router.ts
        ├── stores/
        │   └── authStores.ts
        ├── models/
        │   ├── api.models.ts    ← Axios + types API
        │   └── api.user.ts
        ├── pages/
        │   ├── Home.vue
        │   ├── Forms.vue
        │   ├── Dashboard.vue
        │   └── Settings.vue
        ├── components/
        │   ├── forms/
        │   │   ├── Login.vue
        │   │   └── Register.vue
        │   └── dashboard/
        │       └── Task.vue
        └── layout/
            ├── Layout.vue
            ├── Header.vue
            └── Footer.vue
```

### 9.2 Commandes de déploiement

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build --no-cache

# Développement frontend (hot reload)
cd frontend && npm run dev

# Développement backend (hot reload)
cd backend && npm run dev
```

---

## 10. Bilan et perspectives

### 10.1 Ce qui a été réalisé

| Fonctionnalité | Statut |
|---------------|--------|
| Conteneurisation Docker (4 services) | Implémenté |
| API REST complète (auth + tâches + users) | Implémenté |
| Authentification JWT avec bcrypt | Implémenté |
| Contrôle d'accès RBAC (ADMIN/CLIENT) | Implémenté |
| Frontend Vue 3 avec TypeScript | Implémenté |
| State management Pinia + cookies | Implémenté |
| Routing protégé (guards) | Implémenté |
| Gestion serveur-état (Vue Query) | Implémenté |
| Multi-stage Docker build (frontend) | Implémenté |
| Architecture microservices (2 backends) | Implémenté |
| Persistance MongoDB avec volume | Implémenté |
| Environnements séparés (dev/prod) | Implémenté |

### 10.2 Points d'amélioration possibles

| Amélioration | Description |
|-------------|-------------|
| Load balancing | Ajouter Nginx en reverse proxy pour distribuer la charge entre backend et backend1 |
| CI/CD | Intégrer GitHub Actions pour les tests et le déploiement automatique |
| Tests | Ajouter des tests unitaires (Jest) et end-to-end (Cypress/Playwright) |
| HTTPS | Configurer TLS/SSL pour les communications sécurisées |
| Rate limiting | Protéger l'API contre les attaques par force brute |
| Logs centralisés | Mettre en place ELK Stack (Elasticsearch, Logstash, Kibana) ou similaire |
| Déploiement cloud | Migrer vers Kubernetes (K8s) ou un service cloud (AWS ECS, GCP Cloud Run) |
| Refresh token | Implémenter un mécanisme de rafraîchissement automatique du JWT |
| Pagination | Ajouter la pagination sur les listes de tâches et d'utilisateurs |
| Notifications | Ajout de notifications en temps réel (WebSocket ou SSE) |

### 10.3 Concepts cloud appliqués

Ce projet illustre concrètement les principaux concepts d'**intégration du cloud** :

1. **Conteneurisation** : chaque service s'exécute dans un conteneur Docker isolé et reproductible.
2. **Microservices** : découpage fonctionnel en services indépendants (frontend, API, base de données).
3. **Infrastructure as Code** : l'infrastructure est décrite dans `docker-compose.yml`, versionnable et reproductible.
4. **Scalabilité horizontale** : backend1 démontre qu'on peut dupliquer un service sans modification.
5. **Séparation dev/prod** : variables d'environnement distinctes, Dockerfiles optimisés pour la production.
6. **Immutabilité** : les images Docker sont reconstruites à chaque déploiement, pas modifiées.
7. **Stateless API** : l'API ne conserve pas d'état de session côté serveur (JWT stateless).

---

*Rapport généré le 15 mars 2026 — FERROL Nelgie — M2 APP S9 Intégration du Cloud*
