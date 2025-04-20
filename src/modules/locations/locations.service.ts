import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly repo: Repository<Location>,
  ) {}

  create(dto: CreateLocationDto) {
    const location = this.repo.create(dto);
    return this.repo.save(location);
  }

  findAll() {
    return this.repo.find({ relations: ['desks', 'pricingRules'] });
  }

  async findOne(id: number) {
    const location = await this.repo.findOne({
      where: { id },
      relations: ['desks', 'pricingRules'],
    });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async update(id: number, dto: UpdateLocationDto) {
    const location = await this.findOne(id);
    Object.assign(location, dto);
    return this.repo.save(location);
  }

  async remove(id: number) {
    const location = await this.findOne(id);
    return this.repo.remove(location);
  }
}
