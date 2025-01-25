FROM node:18

# Crear un directorio de trabajo
WORKDIR /app

# Copiar archivos package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto para ng serve
EXPOSE 4200

# Comando para iniciar Angular en modo desarrollo
CMD ["npm", "start"]
