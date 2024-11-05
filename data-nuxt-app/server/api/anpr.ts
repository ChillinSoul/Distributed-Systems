import { faker } from '@faker-js/faker';
import { promises as fs } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async () => {
  const anprData = {
    licensePlate: faker.vehicle.vrm(),
    timestamp: faker.date.recent(),
    vehicleType: faker.vehicle.type(),
    speed: faker.number.int({ min: 30, max: 120 }),
    location: `C${faker.number.int({ min: 1, max: 5 })}`
  };

  // Store in the JSON file
  const dataPath = resolve('./data/json/anprData.json');
  let existingData = [];

  try {
    const fileContent = await fs.readFile(dataPath, 'utf8');
    existingData = JSON.parse(fileContent);
  } catch (err) {
    existingData = [];
  }

  existingData.push(anprData);

  await fs.writeFile(dataPath, JSON.stringify(existingData, null, 2));

  return anprData;
});
