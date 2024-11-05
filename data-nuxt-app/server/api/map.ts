import { faker } from '@faker-js/faker';
import { promises as fs } from 'fs';
import { resolve } from 'path';

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

  // Store in the JSON file
  const dataPath = resolve('../data/json/mapData.json');
  let existingData = [];

  try {
    const fileContent = await fs.readFile(dataPath, 'utf8');
    existingData = JSON.parse(fileContent);
  } catch (err) {
    existingData = [err];
  }

  existingData.push(mapData);

  await fs.writeFile(dataPath, JSON.stringify(existingData, null, 2));

  return mapData;
});
