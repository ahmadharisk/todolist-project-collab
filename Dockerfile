# Tahap 1: build frontend React menjadi file statis
FROM node:24-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Tahap 2: backend Express, sekaligus menyajikan hasil build frontend
FROM node:24-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/server.js ./
COPY --from=frontend /app/dist ./public

# Database disimpan di /data supaya bisa dipasang volume
RUN mkdir /data && chown node:node /data
ENV DB_PATH=/data/todos.db
USER node

EXPOSE 3001
CMD ["node", "--disable-warning=ExperimentalWarning", "server.js"]
