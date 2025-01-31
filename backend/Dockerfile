# 🏗️ Usa una imagen base ligera de Node.js para optimizar el contenedor
FROM node:18-alpine

# 📁 Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# 🔽 Copiar los archivos de dependencias antes del código fuente para aprovechar la caché de Docker
COPY package*.json ./

# 📦 Instalar dependencias sin romper compatibilidad de versiones
RUN npm install --legacy-peer-deps

# 📂 Copiar todo el código fuente al contenedor después de instalar dependencias
COPY . .

# 🔐 Ajustar permisos para evitar problemas de acceso en entornos de producción
RUN chmod -R 755 /app

# 🌐 Exponer el puerto 3000 para que el backend sea accesible
EXPOSE 3000

# 🚀 Comando de inicio del backend
CMD ["npm", "start"]
