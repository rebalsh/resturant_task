
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { catchAsync } from '../../shared/utils/catch-async';

const authService = new AuthService();

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.loginAdmin(req.body);
  
  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: result
  });
});