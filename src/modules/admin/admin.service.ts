import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '@modules/bookings/entities/booking.entity';
import { Desk } from '@modules/desks/entities/desk.entity';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Desk)
    private deskRepo: Repository<Desk>,
  ) {}

  async getBookingSummary(locationId: number, date: string) {
    try {
      const parsedDate = parseISO(date);

      const utcStart = startOfDay(parsedDate);
      const utcEnd = endOfDay(parsedDate);

      const bookings = await this.bookingRepo
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.desk', 'desk')
        .leftJoin('desk.location', 'location')
        .where('booking.status = :status', { status: BookingStatus.BOOKED })
        .andWhere('location.id = :locationId', { locationId })
        .andWhere('booking.startTime BETWEEN :start AND :end', {
          start: utcStart.toISOString(),
          end: utcEnd.toISOString(),
        })
        .getMany();

      const totalBookings = bookings.length;
      const revenue = bookings.reduce((sum, b) => {
        const price = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return sum + (isNaN(price) ? 0 : price);
      }, 0);

      const desksAtLocation = await this.deskRepo.find({
        where: { location: { id: locationId } },
      });

      const idleDesks = desksAtLocation.length - new Set(bookings.map(b => b.desk.id)).size;

      const hourMap = bookings.reduce((acc, b) => {
        const hour = new Date(b.startTime).getUTCHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      const peakHour = Object.entries(hourMap)
        .reduce((max, entry) => (entry[1] > max[1] ? entry : max), [null, 0])[0];

      return {
        totalBookings,
        revenue,
        idleDesks,
        peakBookingHour: peakHour ? parseInt(peakHour as string, 10) : null
      };
    } catch (error) {
      this.logger.error(`Failed to get booking summary for location ${locationId} on date ${date}`, error.stack);
      throw new InternalServerErrorException('Unable to fetch booking summary');
    }
  }
}
