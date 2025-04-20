import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '@modules/bookings/entities/booking.entity';
import { Desk } from '@modules/desks/entities/desk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Desk])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
