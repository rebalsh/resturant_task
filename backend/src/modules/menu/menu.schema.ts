import { z } from 'zod';

export const createMenuSchema = z.object({
  dishName: z.string().trim().min(2, { message: 'Dish name must be at least 2 characters long' }),
  price: z.number().positive({ message: 'Price must be a positive number' }),
});

export const updateMenuSchema = z.object({
  dishName: z.string().trim().min(2, { message: 'Dish name must be at least 2 characters long' }).optional(),
  price: z.number().positive({ message: 'Price must be a positive number' }).optional(),
}).refine((data) => data.dishName !== undefined || data.price !== undefined, {
  message: 'You must provide at least one field to update (dishName or price)',
});

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;