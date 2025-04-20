import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Location } from '@modules/locations/entities/location.entity';

@Entity()
export class Desk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Location, location => location.desks)
  @JoinColumn({ name: 'location_id' }) 
  location: Location;

  @Column({ name: 'location_id' })
  locationId: number; 
}
