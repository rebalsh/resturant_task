import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // الحد الأقصى لعدد المحاولات من نفس الـ IP خلال الفترة المحددة
  standardHeaders: true, // إرجاع معلومات الـ RateLimit في الـ headers
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  // يمكن تخصيص الرسالة أو إضافة key generator بناءً على الـ IP
});