# Usa una versión de Node.js estable y compatible con Angular
FROM node:18-bullseye

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias primero
COPY package.json package-lock.json ./

# Instalar Angular CLI globalmente en el contenedor
RUN npm install -g @angular/cli@18.2.12

# Instalar dependencias sin dependencias opcionales para evitar problemas en ARM64
RUN npm ci --omit=optional --legacy-peer-deps

# Instalar Rollup de manera explícita (para evitar problemas en ARM64)
RUN npm install rollup --save-dev --force

# Forzar compatibilidad con arquitectura x64
RUN npm rebuild esbuild --platform=linux --arch=x64

# Copiar el resto del código fuente después de instalar dependencias
COPY . .

# Construir la aplicación en modo producción
RUN npm run build --configuration=production

# Instalar un servidor HTTP ligero para servir Angular
RUN npm install -g http-server

# Exponer el puerto para servir la aplicación en producción
EXPOSE 4200

# Ejecutar el servidor en la carpeta correcta del build (dist)
# 🚀 Usar http-server con historyApiFallback para manejar rutas
CMD ["http-server", "dist/Spike", "-p", "4200", "--proxy", "http://localhost:4200?"]

