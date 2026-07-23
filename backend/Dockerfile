

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .

ENV DATABASE_URL="file:/app/prisma/dev.db"

RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
# تثبيت prisma CLI ليعمل أمر db push أثناء تشغيل الحاوية
RUN npm install prisma --no-save

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3005
CMD sh -c "npx prisma db push --accept-data-loss && node dist/server.js"