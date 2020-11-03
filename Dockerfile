FROM node:lts-alpine

RUN apk add git
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build
