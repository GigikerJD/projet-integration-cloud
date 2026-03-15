FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm install tsx

COPY . .

EXPOSE 4001

CMD ["npx", "tsx", "server.ts"]