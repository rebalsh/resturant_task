import { Request, Response, NextFunction } from 'express';
import { MenuRepository } from './menu.repository';
import { AppError } from '../../shared/utils/app-error';
import { catchAsync } from '../../shared/utils/catch-async';

const menuRepo = new MenuRepository();

export const getMenu = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const menu = await menuRepo.findAll();
  res.status(200).json({ status: 'success', data: menu });
});

export const createDish = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newDish = await menuRepo.create(req.body);
  res.status(201).json({ status: 'success', data: newDish });
});

export const updateDish = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // نستخرج id ونؤكد أنه string بعد التحقق
  const id = req.params.id as string;
  if (!id) throw new AppError('Dish ID is required', 400);

  const existing = await menuRepo.findById(id);
  if (!existing) throw new AppError('Dish not found in the menu', 404);

  const updatedDish = await menuRepo.update(id, req.body);
  res.status(200).json({ status: 'success', data: updatedDish });
});

export const deleteDish = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  if (!id) throw new AppError('Dish ID is required', 400);

  const existing = await menuRepo.findById(id);
  if (!existing) throw new AppError('Dish not found in the menu', 404);

  await menuRepo.delete(id);
  res.status(200).json({ status: 'success', message: 'Dish deleted successfully' });
});