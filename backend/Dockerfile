# Usa una imagen base ligera
FROM node:18-alpine

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json antes de instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps --force

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto del backend
EXPOSE 3000

# Asegurar permisos en entornos de producción
RUN chmod -R 777 /app

# Comando para iniciar el servidor
CMD ["npm", "start"]
