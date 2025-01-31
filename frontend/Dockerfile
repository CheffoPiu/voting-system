# Usa una versión de Node estable y compatible
FROM node:18-bullseye

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json antes de instalar dependencias
COPY package.json package-lock.json ./

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli@18.2.12

# Instalar dependencias de forma limpia evitando problemas en ARM64
RUN npm ci --omit=optional --legacy-peer-deps --force

# **Solución para el error de Rollup**
RUN npm install --save-dev rollup --force

# **Forzar reconstrucción de esbuild y compatibilidad con x64**
RUN npm rebuild esbuild --platform=linux --arch=x64
RUN npm rebuild --platform=linux --arch=x64

# Copiar el resto del código fuente antes de construir
COPY . .

# **Verificar que Rollup está correctamente instalado**
RUN node -e "console.log(require.resolve('rollup'))"

# Construir la aplicación en modo producción
RUN npm run build --configuration=production

# Instalar un servidor HTTP ligero para servir Angular
RUN npm install -g http-server

# Exponer el puerto 80 para producción
EXPOSE 80

# Cambiar a la carpeta correcta de dist (ajústalo según el nombre real del proyecto)
CMD ["http-server", "dist/Spike", "-p", "80"]
