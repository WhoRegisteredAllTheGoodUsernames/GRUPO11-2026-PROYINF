FROM node:18-alpine

WORKDIR /app/backend

COPY package*.json ./
RUN npm install

COPY ./src /src
COPY ./index.js /
COPY ./package.json /
COPY ./package-lock.json /
COPY ./pruebaa.pdf /
COPY ./spa.traineddata /

# Instalar wait-port globalmente
RUN npm install -g wait-port

# Comando modificado para esperar a PostgreSQL
CMD ["sh", "-c", "wait-port postgres_db:5432 && npm start"]
