import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Desk } from './entities/desk.entity';
import { CreateDeskDto } from './dto/create-desk.dto';
import { UpdateDeskDto } from './dto/update-desk.dto';

@Injectable()
export class DesksService {
  constructor(
    @InjectRepository(Desk)
    private readonly deskRepository: Repository<Desk>,
  ) {}

  async findAll(): Promise<Desk[]> {
    return this.deskRepository.find({ relations: ['location'] });
  }

  async findOne(id: number): Promise<Desk> {
    const desk = await this.deskRepository.findOne({
      where: { id },
      relations: ['location'],
    });

    if (!desk) {
      throw new NotFoundException(`Desk with ID ${id} not found`);
    }

    return desk;
  }

  async create(dto: CreateDeskDto): Promise<Desk> {
    const desk = this.deskRepository.create(dto);
    return this.deskRepository.save(desk);
  }

  async update(id: number, dto: UpdateDeskDto): Promise<Desk> {
    await this.findOne(id);
    await this.deskRepository.update(id, dto);
    return this.findOne(id); 
  }
  

  async remove(id: number): Promise<void> {
    const result = await this.deskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Desk with ID ${id} not found`);
    }
  }
}
