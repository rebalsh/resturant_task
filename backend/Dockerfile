# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .

# ✅ أضف هذا السطر قبل prisma generate
ENV DATABASE_URL="file:./dev.db"

RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3005
CMD ["node", "dist/server.js"]
