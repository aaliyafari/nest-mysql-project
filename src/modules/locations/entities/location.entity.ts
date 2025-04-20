import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Desk } from '@modules/desks/entities/desk.entity';
import { PricingRule } from '@modules/pricing/entities/pricing-rule.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @OneToMany(() => Desk, desk => desk.location)
  desks: Desk[];

  @OneToMany(() => PricingRule, pricingRule => pricingRule.location)
  pricingRules: PricingRule[];
}
