import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@modules/users/users.module';
import { LocationsModule } from '@modules/locations/locations.module';
import { DesksModule } from '@modules/desks/desks.module';
import { BookingsModule } from '@modules/bookings/bookings.module';
import { PricingModule } from '@modules/pricing/pricing.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './modules/admin/admin.module';
import typeOrmConfig from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot(),
    DesksModule,
    UsersModule,
    LocationsModule,
    PricingModule,
    BookingsModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
