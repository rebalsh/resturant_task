# # Stage 1: Build the application
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/
# RUN npm install

# COPY . .

# # ✅ أضف هذا السطر قبل prisma generate
# ENV DATABASE_URL="file:./dev.db"

# RUN npx prisma generate
# RUN npm run build

# # Stage 2: Production
# FROM node:20-alpine AS runner

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/
# RUN npm install --omit=dev

# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# EXPOSE 3005
# CMD ["node", "dist/server.js"]








# # Stage 1: Build the application
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/
# RUN npm install

# COPY . .

# # إعداد متغير البيئة لبناء بريزما بشكل صحيح
# ENV DATABASE_URL="file:./dev.db"

# RUN npx prisma generate
# RUN npm run build

# # Stage 2: Production
# FROM node:20-alpine AS runner

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/
# RUN npm install --omit=dev

# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# EXPOSE 3005
# CMD ["node", "dist/server.js"]


# # Stage 1: Build the application
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/
# RUN npm install

# COPY . .

# # المسار المطلق الصحيح
# ENV DATABASE_URL="file:///app/prisma/dev.db"

# RUN npx prisma generate
# RUN npm run build

# # Stage 2: Production
# FROM node:20-alpine AS runner

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/
# RUN npm install --omit=dev

# COPY --from=builder /app/dist ./dist

# # لا داعي لنسخ مجلد .prisma هنا لأن أمر التشغيل سيقوم بتوليده تلقائياً مع الجداول

# EXPOSE 3005
# CMD ["node", "dist/server.js"]



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