import { faker } from '@faker-js/faker';
import { prisma } from './db';

export default defineEventHandler(async () => {
  try {
    const mapData = {
      roadId: `R${faker.number.int({ min: 1, max: 5 })}`,
      roadName: faker.location.street(),
      vehicleDensity: faker.number.int({ min: 20, max: 100 }),
      avgSpeed: faker.number.int({ min: 30, max: 120 }),
      congestionLevel: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
      accidentsReported: faker.number.int({ min: 0, max: 3 }),
      weatherCondition: faker.helpers.arrayElement(['Clear', 'Rain', 'Fog'])
    };

    const saved = await prisma.mapData.create({
      data: mapData
    });

    return saved;
  } catch (error) {
    console.error('Error in map data creation:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create map data'
    });
  }
});