import { Booking } from '../entities/booking.entity';
import { BookingStatus } from '../entities/booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { LessThan } from 'typeorm';

@Injectable()
export class AutoCancelUtils {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  async autoCancelBookings() {
    const currentTime = new Date();
    const bookingsToCancel = await this.bookingRepo.find({
      where: {
        status: BookingStatus.BOOKED,
        startTime: LessThan(currentTime),
      },
    });

    const autoCancelledBookings = [];
    
    for (const booking of bookingsToCancel) {
      const bookingStartTime = new Date(booking.startTime);
      const timeDifference = currentTime.getTime() - bookingStartTime.getTime();
      
      if (timeDifference > 15 * 60 * 1000) {
        booking.status = BookingStatus.CANCELLED;
        await this.bookingRepo.save(booking);
        autoCancelledBookings.push(booking);
      }
    }

    return autoCancelledBookings;
  }
}
