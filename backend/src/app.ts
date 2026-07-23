

import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import reservationRoutes from './modules/reservation/reservation.routes';
import menuRoutes from './modules/menu/menu.routes';
import { errorHandler } from './shared/middlewares/errorHandler.middleware';

const app: Application = express();

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🪵 ميدلوير لطباعة كل طلب يصل للسيرفر مباشرة في الـ Logs
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running smoothly!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/menu', menuRoutes);

app.use(errorHandler);

export default app;