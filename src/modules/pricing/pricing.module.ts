import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { PricingRule } from './entities/pricing-rule.entity';
import { Location } from '@modules/locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PricingRule, Location])],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
