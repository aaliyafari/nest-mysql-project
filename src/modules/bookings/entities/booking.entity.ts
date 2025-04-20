import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Desk } from '@modules/desks/entities/desk.entity';

export enum BookingStatus {
    BOOKED = 'booked',
    STARTED = 'started',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
  }
  

@Entity()

export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @ManyToOne(() => Desk, desk => desk.id)
  desk: Desk;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.BOOKED })
  status: BookingStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
