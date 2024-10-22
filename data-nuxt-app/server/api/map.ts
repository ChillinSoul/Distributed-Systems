import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  const mapData = {
    roadId: `R${faker.number.int({ min: 1, max: 5 })}`,
    roadName: faker.location.street(),
    vehicleDensity: faker.number.int({ min: 20, max: 100 }),
    avgSpeed: faker.number.int({ min: 30, max: 120 }),
    congestionLevel: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
    accidentsReported: faker.number.int({ min: 0, max: 3 }),
    weatherCondition: faker.helpers.arrayElement(['Clear', 'Rain', 'Fog'])
  };

  // Store in the database
  await prisma.mapData.create({ data: mapData });

  return mapData;
});
