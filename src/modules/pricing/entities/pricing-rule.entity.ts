import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Location } from '@modules/locations/entities/location.entity';

export enum RuleType {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

@Entity()
export class PricingRule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Location, location => location.id)
  location: Location;
  

  @Column({
    type: 'enum',
    enum: RuleType,
    default: RuleType.HOURLY, 
  })
  ruleType: RuleType;

  @Column('decimal')
  basePrice: number;

  @Column('decimal')
  multiplier: number;

  @Column()
  timeRangeStart: string;

  @Column()
  timeRangeEnd: string;
}
