# # Stage 1: Build the application
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/
# RUN npm install

# COPY . .

# RUN npx prisma generate
# RUN npm run build

# # Stage 2: Production
# FROM node:20-alpine AS runner

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/
# # نقوم بتثبيت الحزم بما فيها prisma لنتمكن من عمل push لاحقاً
# RUN npm install 

# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# EXPOSE 3005

# # تشغيل Prisma db push لإنشاء الجداول تلقائياً قبل تشغيل السيرفر
# CMD npx prisma db push && node dist/server.js



FROM node:20-alpine

WORKDIR /app

# 1. نسخ ملفات الحزم وتثبيتها
COPY package*.json ./
RUN npm install

# 2. نسخ باقي الملفات (بما فيها مجلد Prisma)
COPY . .

# 3. توليد نسخة جديدة وسليمة تماماً من Prisma Client متوافقة مع PostgreSQL
RUN npx prisma generate

# 4. بناء كود TypeScript
RUN npm run build

EXPOSE 3005

# 5. مزامنة قاعدة البيانات أوتوماتيكياً ثم تشغيل السيرفر
CMD npx prisma db push --accept-data-loss && node dist/server.js