import { Router } from 'express';
import { login } from './auth.controller';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { loginSchema } from './auth.schema';
import { loginLimiter } from '../../shared/middlewares/rate-limiter'; // استيراد

const router = Router();

// مسار تسجيل الدخول مع التحقق من المدخلات عبر Zod
router.post('/login', loginLimiter, validateBody(loginSchema), login);

export default router;