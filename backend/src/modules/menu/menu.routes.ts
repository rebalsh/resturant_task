import { Router } from 'express';
import { getMenu, createDish, updateDish, deleteDish } from './menu.controller';
import { protectAdmin } from '../../shared/middlewares/auth.middleware';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { createMenuSchema, updateMenuSchema } from './menu.schema';

const router = Router();

// مسار عام: يمكن لأي زبون تصفح المنيو ورؤية الأسعار
router.get('/', getMenu);

// مسارات محمية: للأدمن فقط لإنشاء، تعديل، أو حذف طبق
router.post('/', protectAdmin, validateBody(createMenuSchema), createDish);

// استخدمنا PATCH لأنه تعديل جزئي (ممكن نرسل الاسم فقط، السعر فقط، أو كلاهما)
router.patch('/:id', protectAdmin, validateBody(updateMenuSchema), updateDish);

// مسار الحذف
router.delete('/:id', protectAdmin, deleteDish);

export default router;