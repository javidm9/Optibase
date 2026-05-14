# ============================================================
# Stage 1 — Compilación con Node.js
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

# ARG recibe el valor de API_URL en tiempo de build (Railway Config Var).
# Se inyecta en el fichero de entorno antes de compilar para que Angular
# lo incluya en el bundle estático.
ARG API_URL=""

# Copiar los descriptores de dependencias primero para aprovechar
# la caché de capas: si package.json no cambia, npm install no se repite.
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copiar el resto del código fuente
COPY . .

# Sustituir el apiUrl vacío de environment.prod.ts con el valor real
# de la variable de build API_URL antes de compilar.
RUN sed -i "s|apiUrl: ''|apiUrl: '${API_URL}'|g" src/environments/environment.prod.ts

# Validar que API_URL fue proporcionada
RUN if [ -z "${API_URL}" ]; then echo "WARNING: API_URL no está definida, las llamadas HTTP fallarán en producción"; fi

# Compilar (producción por defecto según angular.json defaultConfiguration)
RUN npm run build

# ============================================================
# Stage 2 — Imagen de ejecución (Express estático, sin SSR)
# ============================================================
FROM node:20-alpine AS runtime

WORKDIR /app

# Copiar únicamente la salida de compilación del stage anterior
COPY --from=build /app/dist ./dist

# Puerto por defecto. Railway asigna el puerto dinámicamente mediante
# la variable de entorno PORT, que server.mjs ya lee con process.env['PORT'] || 4000.
EXPOSE 4000

# URL del backend desplegado en Railway.
# Inyectar como Config Var en Railway con el valor real del servicio backend.
ENV API_URL=""

# Arrancar Express como servidor estático SPA (sin SSR)
CMD ["node", "dist/frontDevelop/server/server.mjs"]
