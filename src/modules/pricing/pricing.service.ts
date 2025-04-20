import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingRule } from './entities/pricing-rule.entity';
import { CreatePricingRuleDto } from './dto/create-pricing-rule.dto';
import { UpdatePricingRuleDto } from './dto/update-pricing-rule.dto';
import { Location } from '@modules/locations/entities/location.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(PricingRule)
    private pricingRepo: Repository<PricingRule>,
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
  ) {}

  async create(dto: CreatePricingRuleDto) {
    const location = await this.locationRepo.findOne({ where: { id: dto.locationId } });
    if (!location) throw new NotFoundException('Location not found');

    const rule = this.pricingRepo.create({
      ...dto,
      location,
    });
    return this.pricingRepo.save(rule);
  }

  async findAll() {
    return this.pricingRepo.find({ relations: ['location'] });
  }

  async findOne(id: number) {
    const rule = await this.pricingRepo.findOne({
      where: { id },
      relations: ['location'],
    });
    if (!rule) throw new NotFoundException('Pricing rule not found');
    return rule;
  }

  async update(id: number, dto: UpdatePricingRuleDto) {
    const rule = await this.pricingRepo.findOne({ where: { id } });
    if (!rule) throw new NotFoundException('Pricing rule not found');

    Object.assign(rule, dto);
    return this.pricingRepo.save(rule);
  }

  async remove(id: number) {
    const rule = await this.pricingRepo.findOne({ where: { id } });
    if (!rule) throw new NotFoundException('Pricing rule not found');
    return this.pricingRepo.remove(rule);
  }
}
