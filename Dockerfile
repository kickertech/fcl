FROM node:lts-alpine

RUN apk add git
RUN npm install -g http-server

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
