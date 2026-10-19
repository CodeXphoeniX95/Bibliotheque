# ===== ÉTAPE 1 : Build du frontend React =====
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json .
RUN npm install
COPY frontend/ .
RUN npm run build

# ===== ÉTAPE 2 : Image finale backend + frontend =====
FROM node:20-alpine

WORKDIR /app

# Installer les dépendances backend
COPY backend/package.json .
RUN npm install --production

# Copier le code backend
COPY backend/src ./src

# Copier le build frontend dans /app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Cloud Run impose le port via la variable d'environnement PORT
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["node", "src/index.js"]
