# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

CMD ["node", "dist/main"]
