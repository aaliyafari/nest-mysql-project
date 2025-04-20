import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { Desk } from '@modules/desks/entities/desk.entity';
import { PricingRule } from '@modules/pricing/entities/pricing-rule.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Desk, PricingRule]), ScheduleModule], 
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
