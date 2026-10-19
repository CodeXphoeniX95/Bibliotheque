# 📚 BiblioThèque Numérique

Application web de gestion de bibliothèque — React + Vite + Node.js + PostgreSQL (Cloud SQL) + Google Cloud Run.

---

## 🗂 Structure du projet

```
bibliotheque/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # Header, BookCard, BookModal
│   │   ├── pages/          # Home, Livres, Emprunts, Admin
│   │   ├── context/        # ToastContext (notifications)
│   │   └── api.js          # Appels axios vers le backend
│   └── vite.config.js
├── backend/                # Node.js + Express
│   └── src/
│       ├── config/
│       │   ├── db.js       # Connexion PostgreSQL (local + Cloud SQL)
│       │   └── init.sql    # Script création des tables
│       ├── routes/
│       │   ├── livres.js   # CRUD livres
│       │   ├── emprunts.js # Gestion des emprunts
│       │   └── stats.js    # Statistiques dashboard
│       └── index.js        # Serveur Express principal
├── deployment/
│   └── deploy.sh           # Script déploiement GCP
├── Dockerfile              # Build multi-stage (frontend + backend)
└── README.md
```

---

## 🚀 DÉMARRAGE LOCAL (Développement)

### Prérequis
- Node.js 20+
- PostgreSQL installé localement
- Git

### Étape 1 — Configurer la base de données

```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE bibliotheque;"

# Initialiser les tables + données de test
psql -U postgres -d bibliotheque -f backend/src/config/init.sql
```

### Étape 2 — Configurer le backend

```bash
cd backend
cp .env.example .env
# Éditer .env avec tes identifiants PostgreSQL

npm install
npm run dev
# ✅ Backend démarre sur http://localhost:5000
```

### Étape 3 — Configurer le frontend

```bash
cd frontend
npm install
npm run dev
# ✅ Frontend démarre sur http://localhost:3000
```

Ouvre http://localhost:3000 dans ton navigateur.

---

## ☁️ DÉPLOIEMENT SUR GOOGLE CLOUD RUN

### Prérequis
- Compte Google Cloud avec facturation activée
- `gcloud` CLI installé et configuré
- Docker installé

### Étape 1 — Configurer gcloud

```bash
gcloud auth login
gcloud config set project TON_PROJECT_ID
```

### Étape 2 — Modifier le script de déploiement

Édite `deployment/deploy.sh` et remplace :
- `ton-project-id` → ton vrai Project ID GCP
- `europe-west1` → ta région préférée

### Étape 3 — Créer le mot de passe DB dans Secret Manager

```bash
echo -n "ton_mot_de_passe_fort" | gcloud secrets create db-password --data-file=-
```

### Étape 4 — Lancer le déploiement

```bash
chmod +x deployment/deploy.sh
bash deployment/deploy.sh
```

Le script va automatiquement :
1. ✅ Activer les APIs Google Cloud
2. ✅ Builder l'image Docker (frontend + backend)
3. ✅ Créer l'instance Cloud SQL PostgreSQL
4. ✅ Déployer le service sur Cloud Run
5. ✅ Afficher l'URL publique de ton app

### Étape 5 — Initialiser la DB en production

```bash
# Se connecter à Cloud SQL via proxy
cloud-sql-proxy TON_PROJECT_ID:europe-west1:bibliotheque-db

# Dans un autre terminal :
psql -U postgres -h 127.0.0.1 -d bibliotheque -f backend/src/config/init.sql
```

---

## 🔌 API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/livres | Liste tous les livres (filtres: search, genre, disponible) |
| GET | /api/livres/:id | Détail d'un livre |
| POST | /api/livres | Créer un livre |
| PUT | /api/livres/:id | Modifier un livre |
| DELETE | /api/livres/:id | Supprimer un livre |
| GET | /api/emprunts | Liste tous les emprunts |
| POST | /api/emprunts | Créer un emprunt |
| PUT | /api/emprunts/:id/retour | Enregistrer un retour |
| GET | /api/stats | Statistiques globales |
| GET | /health | Health check Cloud Run |

---

## 💰 Coût estimé sur Google Cloud

| Service | Coût estimé |
|---------|------------|
| Cloud Run (0 à 3 instances) | ~$0 (free tier) |
| Cloud SQL db-f1-micro | ~$7-10/mois |
| Container Registry | ~$0.10/GB |
| **Total** | **~$7-10/mois** |

---

## 🛠 Technologies utilisées

- **Frontend** : React 18, Vite 5, React Router, Axios
- **Backend** : Node.js, Express, node-postgres (pg)
- **Base de données** : PostgreSQL 15 (Cloud SQL)
- **Déploiement** : Google Cloud Run, Docker multi-stage
- **Sécurité** : Secret Manager pour les mots de passe

---

Développé pour apprendre le déploiement fullstack sur Google Cloud.
