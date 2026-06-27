# مرحلة البناء (Build)
FROM node:20-alpine AS builder 

WORKDIR /app

# نسخ ملفات package.json وتثبيت الاعتماديات
COPY package*.json ./
RUN npm ci

# نسخ باقي الملفات وبناء المشروع
COPY . .
RUN npm run build

# مرحلة التشغيل (Production)
FROM nginx:alpine

# نسخ ملفات البناء إلى مجلد Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# نسخ إعدادات Nginx المخصصة
COPY nginx.conf /etc/nginx/conf.d/default.conf

# المنفذ الذي سيعمل عليه Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]