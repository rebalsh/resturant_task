import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/app-error';

/**
 * ميدل وير عام للتحقق من صحة مدخلات الـ Body باستخدام مكتبة Zod
 */
export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err: any) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        
        next(new AppError(`Validation Error: [${errorMessages}]`, 400));
      } else {
        next(error);
      }
    }
  };
};