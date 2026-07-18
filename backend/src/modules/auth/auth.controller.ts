import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/utils/app-error';
import { generateToken } from '../../shared/utils/generate-token';
import { catchAsync } from '../../shared/utils/catch-async';

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username !== adminUsername || password !== adminPassword) {
    throw new AppError('Invalid username or password', 401);
  }

  const token = generateToken({ username });

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: { token }
  });
});