import { prisma } from '../../shared/config/database';
import { CreateMenuInput, UpdateMenuInput } from './menu.schema';

export class MenuRepository {
  // 1. جلب كل الأطباق
  public async findAll() {
    return await prisma.menu.findMany({
      orderBy: { dishName: 'asc' }, 
    });
  }

  // 2. جلب طبق معين بواسطة الـ ID
  public async findById(id: string) {
    return await prisma.menu.findUnique({
      where: { id },
    });
  }

  // 3. إضافة طبق جديد (للأدمن)
  public async create(data: CreateMenuInput) {
    return await prisma.menu.create({
      data: {
        dishName: data.dishName,
        price: data.price,
      },
    });
  }

  // 4. تحديث الطبق (الاسم، السعر، أو كلاهما)
  public async update(id: string, data: UpdateMenuInput) {
    return await prisma.menu.update({
      where: { id },
      data, // سيتم تحديث الحقول المرسلة فقط
    });
  }

  // 5. حذف الطبق
  public async delete(id: string) {
    return await prisma.menu.delete({
      where: { id },
    });
  }
}