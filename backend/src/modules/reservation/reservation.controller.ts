
import { Request, Response, NextFunction } from 'express';
import { ReservationService } from './reservation.service';
import { AppError } from '../../shared/utils/app-error';
import { catchAsync } from '../../shared/utils/catch-async';

const reservationService = new ReservationService();

export const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const reservations = await reservationService.getAllReservations();
  res.status(200).json({ status: 'success', data: reservations });
});

export const create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newReservation = await reservationService.createReservation(req.body);
  res.status(201).json({ status: 'success', data: newReservation });
});

export const updateStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) throw new AppError('Reservation ID is required', 400);

  const updated = await reservationService.updateReservationStatus(id as string, status);
  res.status(200).json({ status: 'success', data: updated });
});

export const cancelPublic = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) throw new AppError('Reservation ID is required', 400);

  await reservationService.publicCancelReservation(id as string);
  res.status(200).send('<h1>Your reservation has been successfully cancelled. We hope to see you another time!</h1>');
});