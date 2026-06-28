



import nodemailer from 'nodemailer';
import { ReservationRepository } from './reservation.repository';
import { CreateReservationInput } from './reservation.schema';
import { AppError } from '../../shared/utils/app-error';

export class ReservationService {
  private reservationRepository = new ReservationRepository();

  private createMailTransporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // دالة مساعدة لبناء رابط الإلغاء
  private getCancellationLink(id: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3005';
    return `${baseUrl}/api/reservations/cancel-public/${id}`;
  }

  public async getAllReservations() {
    return await this.reservationRepository.findAll();
  }

  public async createReservation(input: CreateReservationInput) {
    const reservation = await this.reservationRepository.create(input);
    const cancellationLink = this.getCancellationLink(reservation.id);

    try {
      const transporter = this.createMailTransporter();
      await transporter.sendMail({
        from: '"Our Restaurant" <noreply@restaurant.com>',
        to: (reservation as any).email,
        subject: 'Reservation Received! 🎉',
        html: `
          <h1>Hello ${reservation.name},</h1>
          <p>We have received your reservation request for <strong>${reservation.guests} guests</strong> on <strong>${reservation.date}</strong> at <strong>${reservation.time}</strong>.</p>
          <p>Your reservation status is currently: <strong>PENDING</strong>.</p>
          <p>If you wish to cancel this reservation at any time, please click the link below:</p>
          <a href="${cancellationLink}" style="color: red; font-weight: bold;">Cancel My Reservation</a>
          <br/><br/>
          <p>Thank you for choosing our restaurant!</p>
        `,
      });
      console.log(`✉️ Confirmation email sent to ${(reservation as any).email} for reservation: ${reservation.id}`);
    } catch (mailError) {
      console.error('❌ Failed to send confirmation email:', mailError);
    }

    return reservation;
  }

  public async updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    const existing = await this.reservationRepository.findById(id);
    if (!existing) {
      throw new AppError('Reservation not found', 404);
    }

    const updatedReservation = await this.reservationRepository.updateStatus(id, status);

    // إرسال إيميل للزبون مع رابط الإلغاء أيضاً
    try {
      const transporter = this.createMailTransporter();
      const isConfirmed = status === 'confirmed';
      const cancellationLink = this.getCancellationLink(id);

      await transporter.sendMail({
        from: '"Our Restaurant" <noreply@restaurant.com>',
        to: (existing as any).email,
        subject: isConfirmed ? 'Reservation Confirmed! 🥂' : 'Reservation Cancelled 😔',
        html: `
          <h1>Hello ${existing.name},</h1>
          <p>Your reservation for <strong>${existing.guests} guests</strong> on <strong>${existing.date}</strong> at <strong>${existing.time}</strong> has been:</p>
          <h2 style="color: ${isConfirmed ? 'green' : 'red'};">${status.toUpperCase()}</h2>
          <p>${isConfirmed ? 'We are excited to welcome you to our restaurant! See you soon.' : 'Unfortunately, we cannot accommodate your request at this time. We hope to see you another time.'}</p>
          <br/>
          <!-- إضافة رابط الإلغاء هنا -->
          <p>If you need to cancel this reservation, please use the following link:</p>
          <a href="${cancellationLink}" style="color: red; font-weight: bold;">Cancel My Reservation</a>
          <br/><br/>
          <p>Best regards,<br/>Management Team</p>
        `,
      });
      console.log(`✉️ Status update email (${status}) sent to ${(existing as any).email}`);
    } catch (mailError) {
      console.error('❌ Failed to send status update email:', mailError);
    }

    return updatedReservation;
  }

  public async publicCancelReservation(id: string) {
    const existing = await this.reservationRepository.findById(id);
    if (!existing) {
      throw new AppError('Reservation not found', 404);
    }
    return await this.reservationRepository.updateStatus(id, 'cancelled');
  }
}

export interface IReservation {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}