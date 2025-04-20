import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Desk } from './entities/desk.entity';
import { DesksService } from './desks.service';
import { DesksController } from './desks.controller';
import { Location } from '@modules/locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Desk, Location])], 
  controllers: [DesksController],
  providers: [DesksService],
})
export class DesksModule {}
