
import { Request, Response, NextFunction } from 'express';
import { MenuService } from './menu.service';
import { AppError } from '../../shared/utils/app-error';
import { catchAsync } from '../../shared/utils/catch-async';

const menuService = new MenuService();

export const getMenu = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const menu = await menuService.getMenuList();
  res.status(200).json({ status: 'success', data: menu });
});

export const createDish = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newDish = await menuService.addDish(req.body);
  res.status(201).json({ status: 'success', data: newDish });
});

export const updateDish = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) throw new AppError('Dish ID is required', 400);

  const updatedDish = await menuService.updateDish(id as string, req.body);
  res.status(200).json({ status: 'success', data: updatedDish });
});

export const deleteDish = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) throw new AppError('Dish ID is required', 400);

  await menuService.deleteDish(id as string);
  res.status(200).json({ status: 'success', message: 'Dish deleted successfully' });
});