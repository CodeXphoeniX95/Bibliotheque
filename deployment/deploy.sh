#!/bin/bash
# ==============================================
# Script de déploiement sur Google Cloud Run
# Usage : bash deployment/deploy.sh
# ==============================================

set -e

# ===== CONFIGURATION — À modifier =====
PROJECT_ID="ton-project-id"              # Ton ID de projet GCP
REGION="europe-west1"                    # Région (proche de l'Afrique de l'Ouest)
SERVICE_NAME="bibliotheque"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
CLOUD_SQL_INSTANCE="$PROJECT_ID:$REGION:bibliotheque-db"

DB_NAME="bibliotheque"
DB_USER="postgres"
# DB_PASSWORD : à définir manuellement dans Secret Manager

echo "🚀 Déploiement BiblioThèque sur Google Cloud Run"
echo "Projet : $PROJECT_ID | Région : $REGION"

# 1. Authentification et config
gcloud config set project $PROJECT_ID

# 2. Activer les APIs nécessaires
echo "📦 Activation des APIs GCP..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  containerregistry.googleapis.com

# 3. Build et push de l'image Docker
echo "🐳 Build de l'image Docker..."
gcloud builds submit --tag $IMAGE_NAME .

# 4. Créer l'instance Cloud SQL (si elle n'existe pas)
echo "🗄️  Vérification Cloud SQL..."
if ! gcloud sql instances describe bibliotheque-db &>/dev/null; then
  echo "Création de l'instance Cloud SQL PostgreSQL..."
  gcloud sql instances create bibliotheque-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --storage-size=10GB \
    --storage-type=SSD

  gcloud sql databases create $DB_NAME --instance=bibliotheque-db
  echo "✅ Cloud SQL créé. Configure le mot de passe DB_PASSWORD dans Secret Manager."
fi

# 5. Stocker le mot de passe dans Secret Manager
# echo -n "ton_mot_de_passe" | gcloud secrets create db-password --data-file=-

# 6. Déploiement sur Cloud Run
echo "☁️  Déploiement sur Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances $CLOUD_SQL_INSTANCE \
  --set-env-vars "NODE_ENV=production,DB_NAME=$DB_NAME,DB_USER=$DB_USER" \
  --set-env-vars "DB_HOST=/cloudsql/$CLOUD_SQL_INSTANCE" \
  --update-secrets "DB_PASSWORD=db-password:latest" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --port 8080

echo ""
echo "✅ Déploiement terminé !"
echo "🌐 URL de l'application :"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
