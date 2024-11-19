import { faker } from '@faker-js/faker';
import { prisma } from './db';

export default defineEventHandler(async () => {
  try {
    const anprData = {
      licensePlate: faker.vehicle.vrm(),
      timestamp: faker.date.recent(),
      vehicleType: faker.vehicle.type(),
      speed: faker.number.int({ min: 30, max: 120 }),
      location: `C${faker.number.int({ min: 1, max: 5 })}`
    };

    const saved = await prisma.aNPRData.create({
      data: anprData
    });

    return saved;
  } catch (error) {
    console.error('Error in ANPR data creation:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create ANPR data'
    });
  }
});