# Usa exactamente la misma versión de Node y NPM que en tu local
FROM node:18-slim

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json antes de instalar dependencias
COPY package.json ./

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli@18.2.12

# **Parche para Rollup en ARM64**
RUN npm install rollup --force

# Instalar dependencias evitando errores de compatibilidad
RUN npm install --omit=optional --legacy-peer-deps --force

# Copiar el resto del código fuente
COPY . .

# **Forzar la instalación manual de @rollup/rollup**
RUN npm install --save-dev rollup --legacy-peer-deps --force

# **Recompilar dependencias en ARM**
RUN npm rebuild esbuild --platform=linux --arch=x64

# Construir la aplicación en modo producción
RUN npm run build --configuration=production

# Instalar un servidor HTTP ligero para servir Angular
RUN npm install -g http-server

# Exponer el puerto 80 para producción
EXPOSE 80

# Iniciar el servidor Angular en producción
CMD ["http-server", "dist", "-p", "80"]
