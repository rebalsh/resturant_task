

import dotenv from 'dotenv';
import path from 'path';

// تحميل .env فقط إذا لم تكن المتغيرات معرّفة مسبقاً (كما في حالة Docker)
dotenv.config({ path: path.join(__dirname, '../.env'), override: false });

import app from './app';
import { connectDB } from './shared/config/database';

const PORT = process.env.PORT || 3005;

const startServer = async () => {
  // الاتصال بقاعدة البيانات
  await connectDB();

  // تشغيل سيرفر الـ Express
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on: http://localhost:${PORT}`);
  });
};

startServer();