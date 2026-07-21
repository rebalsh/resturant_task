// import { PrismaClient } from '@prisma/client';

// // إنشاء نسخة موحدة من Prisma Client والاتصال بقاعدة البيانات
// export const prisma = new PrismaClient();

// // دالة للتأكد من نجاح الاتصال عند تشغيل السيرفر
// export const connectDB = async (): Promise<void> => {
//   try {
//     await prisma.$connect();
//     console.log('📦 Database connected successfully (SQLite via Prisma).');
//   } catch (error) {
//     console.error('❌ Database connection failed:', error);
//     process.exit(1);
//   }
// };


import { PrismaClient } from '@prisma/client';

const dbUrl = process.env.DATABASE_URL || 'file:/app/prisma/dev.db';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log(`📦 Database connected successfully to: ${dbUrl}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};