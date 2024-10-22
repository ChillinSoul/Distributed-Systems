import { faker } from '@faker-js/faker';
//import { PrismaClient } from '@prisma/client';

//const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  const anprData = {
    licensePlate: faker.vehicle.vrm(),
    timestamp: faker.date.recent(),
    vehicleType: faker.vehicle.type(),
    speed: faker.number.int({ min: 30, max: 120 }),
    location: `C${faker.number.int({ min: 1, max: 5 })}`
  };

  // Store in the database
//  await prisma.aNPRData.create({ data: anprData });

  return anprData;
});
