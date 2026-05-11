FROM node:20-alpine AS client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY server ./server
COPY --from=client-builder /app/client/dist ./client/dist

EXPOSE 4000
CMD ["node", "server/server.js"]
