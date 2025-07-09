FROM node:20-slim AS builder

WORKDIR /app

COPY . .

RUN npm install


CMD [ "npm", "run", "dev" ]