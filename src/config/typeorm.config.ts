import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Location } from '../modules/locations/entities/location.entity';
import { Desk } from '../modules/desks/entities/desk.entity';
import { Booking } from '../modules/bookings/entities/booking.entity';
import { PricingRule } from '../modules/pricing/entities/pricing-rule.entity';

config();

const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Booking, Desk, Location, PricingRule],
  synchronize: false,
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: false,
  timezone: 'Z',
};

export const dataSource = new DataSource(typeOrmConfig);

export default typeOrmConfig;
