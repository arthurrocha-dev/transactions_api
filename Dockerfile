# Dockerfile
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

RUN npm install -g @nestjs/cli

COPY package*.json ./

COPY . .

RUN yarn install

RUN yarn build

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/main"]
