// import app from './app';
// import { connectDB } from './shared/config/database';

// const PORT = process.env.PORT || 3000;

// const startServer = async () => {
//   // 1. الاتصال بقاعدة البيانات أولاً
//   await connectDB();

//   // 2. تشغيل سيرفر الـ Express
//   app.listen(PORT, () => {
//     console.log(`🚀 Server is listening on: http://localhost:${PORT}`);
//   });
// };

// startServer();

// 1. تحميل المتغيرات البيئية أولاً قبل استيراد أي شيء آخر
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

// 2. الآن نستورد باقي التطبيق
import app from './app';
import { connectDB } from './shared/config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // الاتصال بقاعدة البيانات أولاً
  await connectDB();

  // تشغيل سيرفر الـ Express
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on: http://localhost:${PORT}`);
  });
};

startServer();