import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import typeOrmConfig from '../../config/typeorm.config';
import { User, Role } from '../../modules/users/entities/user.entity';
import { Desk } from '@modules/desks/entities/desk.entity';
import { Location } from '@modules/locations/entities/location.entity';
import { PricingRule, RuleType } from '@modules/pricing/entities/pricing-rule.entity';
import * as bcrypt from 'bcrypt';

const logger = new Logger('Seeder');

const AppDataSource = new DataSource({
  ...typeOrmConfig,
  synchronize: false,
  migrationsRun: false,
});

async function seed() {
  try {
    await AppDataSource.initialize();

    // ---------- Seed Users ----------
    const userRepo = AppDataSource.getRepository(User);

    const users: { name: string; email: string; password: string; role: Role }[] = [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'Admin@123',
        role: Role.ADMIN,
      },
      {
        name: 'test user1',
        email: 'testuser1@gmail.com',
        password: 'TestUser2@123',
        role: Role.USER,
      },
      {
        name: 'test user2',
        email: 'testuser2@gmail.com',
        password: 'Test@123',
        role: Role.USER,
      },
    ];

    for (const u of users) {
      const exists = await userRepo.findOne({ where: { email: u.email } });

      if (!exists) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const newUser = userRepo.create({ ...u, password: hashedPassword });
        await userRepo.save(newUser);
        logger.log(`Seeded User: ${u.email}`);
      } else {
        logger.warn(`Skipped User (already exists): ${u.email}`);
      }
    }

        // ---------- Seed Locations ----------
        const locationRepo = AppDataSource.getRepository(Location);

        const locations = [
          { name: 'IIT', city: 'Chennai' },
          { name: 'IIT', city: 'Chennai' },
          { name: 'IIT', city: 'Bangalore' },
          { name: 'IIT', city: 'Delhi' },
        ];
    
        for (const loc of locations) {
          const exists = await locationRepo.findOne({
            where: { name: loc.name, city: loc.city },
          });
    
          if (!exists) {
            const newLoc = locationRepo.create(loc);
            await locationRepo.save(newLoc);
            logger.log(`Seeded Location: ${loc.name} - ${loc.city}`);
          } else {
            logger.warn(`Skipped Location (already exists): ${loc.name} - ${loc.city}`);
          }
        }
    

    // ---------- Seed Desks ----------
    const deskRepo = AppDataSource.getRepository(Desk);

    const desks = [
      { name: 'IITA1', locationId: 1 },
      { name: 'IITA2', locationId: 1 },
      { name: 'IITA3', locationId: 1 },
      { name: 'IITA4', locationId: 2 },
      { name: 'IITA5', locationId: 2 },
      { name: 'IITA6', locationId: 2 },
      { name: 'IITA7', locationId: 3 },
      { name: 'IITA8', locationId: 3 },
      { name: 'IITA9', locationId: 3 },
      { name: 'IITA10', locationId: 3 },
    ];

    for (const desk of desks) {
      const exists = await deskRepo.findOne({ where: { name: desk.name } });

      if (!exists) {
        const location = await locationRepo.findOne({ where: { id: desk.locationId } });

        if (!location) {
          logger.warn(`Location with id ${desk.locationId} not found for ${desk.name}`);
          continue;
        }

        const newDesk = deskRepo.create({
          name: desk.name,
          isAvailable: true,
          location,
        });

        await deskRepo.save(newDesk);
        logger.log(`Seeded Desk: ${desk.name}`);
      } else {
        logger.warn(`Skipped Desk (already exists): ${desk.name}`);
      }
    }

    // ---------- Seed Pricing Rules ----------
    const pricingRepo = AppDataSource.getRepository(PricingRule);
    const allLocations = await locationRepo.find();

    for (const location of allLocations) {
      const existingRules = await pricingRepo.find({ where: { location: { id: location.id } } });

      if (existingRules.length > 0) {
        logger.warn(`Skipped Pricing Rules (already exist) for location: ${location.name}`);
        continue;
      }

      const hourlyRule = pricingRepo.create({
        location,
        ruleType: RuleType.HOURLY,
        basePrice: 100,
        multiplier: 1,
        timeRangeStart: '09:00',
        timeRangeEnd: '18:00',
      });

      const dailyRule = pricingRepo.create({
        location,
        ruleType: RuleType.DAILY,
        basePrice: 700,
        multiplier: 1.2,
        timeRangeStart: '00:00',
        timeRangeEnd: '23:59',
      });

      await pricingRepo.save([hourlyRule, dailyRule]);
      logger.log(`Seeded Pricing Rules for location: ${location.name}`);
    }

    logger.log('Seeding complete');
    await AppDataSource.destroy();
  } catch (err) {
    logger.error('Seeding failed', err.stack || err);
    await AppDataSource.destroy();
  }
}

seed();
