FROM node:18

# Crear un directorio de trabajo
WORKDIR /app

# Copiar archivos package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias y Angular CLI globalmente
RUN npm install -g @angular/cli
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto para Angular CLI
EXPOSE 4200

# Comando para iniciar Angular en modo desarrollo
CMD ["ng", "serve", "--host", "0.0.0.0"]
