import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Booking, BookingStatus } from './entities/booking.entity';
  import { CreateBookingDto } from './dto/create-booking.dto';
  import { calculateBookingPrice } from './utils/price-calculator';
  import { Desk } from '@modules/desks/entities/desk.entity';
  import { PricingRule } from '@modules/pricing/entities/pricing-rule.entity';
  
  @Injectable()
  export class BookingsService {
    constructor(
      @InjectRepository(Booking)
      private bookingRepo: Repository<Booking>,
      @InjectRepository(Desk)
      private deskRepo: Repository<Desk>,
      @InjectRepository(PricingRule)
      private pricingRepo: Repository<PricingRule>,
    ) {}

    async findBookingById(id: number) {
      return this.bookingRepo.findOne({
        where: { id },
        relations: ['user'], 
      });
    }
  
    async create(dto: CreateBookingDto  & { userId: number }) {
      try {
        const desk = await this.deskRepo.findOne({ where: { id: dto.deskId } });
        if (!desk) throw new NotFoundException('Desk not found');
    
        const newStart = new Date(dto.startTime);
        const newEnd = new Date(dto.endTime);
        newStart.setMilliseconds(0);
        newEnd.setMilliseconds(0);
    
        if (newStart >= newEnd) {
          throw new BadRequestException('Start time must be before end time');
        }
    
        const overlapping = await this.bookingRepo
          .createQueryBuilder('booking')
          .where('booking.deskId = :deskId', { deskId: dto.deskId })
          .andWhere('booking.status = :status', { status: BookingStatus.BOOKED })
          .andWhere(
            '(booking.startTime < :newEnd AND booking.endTime > :newStart) OR (booking.startTime = :newStart AND booking.endTime = :newEnd)',
            { newStart, newEnd },
          )
          .getMany();
    
        if (overlapping.length > 0) {
          throw new BadRequestException('Desk already booked in this time range');
        }
    
        const rules = await this.pricingRepo.find({
          where: { location: { id: desk.locationId } },
        });
    
        const price = calculateBookingPrice(newStart, newEnd, rules);
    
        const booking = this.bookingRepo.create({
          startTime: dto.startTime,
          endTime: dto.endTime,
          user: { id: dto.userId },
          desk: { id: dto.deskId },
          price,
          status: BookingStatus.BOOKED,
        });
    
        return await this.bookingRepo.save(booking);
      } catch (error) {
        throw error;
      }
    }
    
    async cancel(id: number, userId: number, userRole: string) {
      const booking = await this.findBookingById(id);
      if (!booking) throw new NotFoundException('Booking not found');
    
      if (booking.user.id !== userId && userRole !== 'admin') {
        throw new BadRequestException('You are not authorized to cancel this booking');
      }
    
      const now = new Date();
      if (new Date(booking.startTime) <= now) {
        throw new BadRequestException('Cannot cancel after booking start time');
      }
    
      booking.status = BookingStatus.CANCELLED;
      return this.bookingRepo.save(booking);
    }
    
    

    async checkInBooking(id: number): Promise<Booking> {
      const booking = await this.findBookingById(id);    
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }
    
        if (booking.status === BookingStatus.STARTED) {
            throw new BadRequestException('Booking is already started and cannot be checked in again');
        }
    
        if (booking.status !== BookingStatus.BOOKED) {
            throw new BadRequestException('Only booked bookings can be checked in');
        }
    
        const now = new Date();
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);
        const checkInWindowStart = new Date(startTime.getTime() - 5 * 60 * 1000);
    
        if (now < startTime) {
            if (now < checkInWindowStart) {
                throw new BadRequestException('Check-in is only allowed within 5 minutes before the start time');
            }
        } else if (now > endTime) {
            throw new BadRequestException('Check-in is not allowed after the booking end time');
        }
    
        booking.status = BookingStatus.STARTED;
        await this.bookingRepo.save(booking);
    
        return booking;
    }
    
    async simulateAutoCancel() {
        const now = new Date();
        const gracePeriod = new Date(now.getTime() - 15 * 60 * 1000);
            
        const bookings = await this.bookingRepo.find({
          where: { status: BookingStatus.BOOKED },
        });
      
        const toCancel = bookings.filter(b => new Date(b.startTime) <= gracePeriod);
            
        for (const booking of toCancel) {
          booking.status = BookingStatus.CANCELLED;
          await this.bookingRepo.save(booking);
        }
      
        return toCancel;
      }
  }
  