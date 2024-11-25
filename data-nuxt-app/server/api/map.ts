import { faker } from '@faker-js/faker';
import { ServiceFactory } from '../../services/ServiceFactory';

const generateFakeMapData = (count: number = 1) => {
  return Array.from({ length: count }, () => ({
    roadId: `R${faker.string.numeric(3)}`,
    roadName: faker.location.street(),
    vehicleDensity: faker.number.int({ min: 0, max: 100 }),
    avgSpeed: faker.number.int({ min: 20, max: 120 }),
    congestionLevel: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
    accidentsReported: faker.number.int({ min: 0, max: 5 }),
    weatherCondition: faker.helpers.arrayElement([
      'Clear', 'Rainy', 'Cloudy', 'Foggy', 'Snowy',
    ]),
  }));
};

export default defineEventHandler(async (event) => {
  const serviceFactory = ServiceFactory.getInstance();
  const mapService = await serviceFactory.getMapDataService();

  try {
    const query = getQuery(event);
    const method = event.method;

    if (method === 'POST') {
      const body = await readBody(event);

      // Generate fake data if no body is provided
      if (!body || Object.keys(body).length === 0) {
        const fakeData = generateFakeMapData(1)[0];
        return await mapService.create(fakeData);
      }

      return await mapService.create(body);
    }

    if (method === 'GET') {
      // Generate multiple fake records
      if (query.generate === 'true') {
        const count = parseInt(query.count as string)||1;
        const fakeDataArray = generateFakeMapData(count);
        const promises = fakeDataArray.map(data => mapService.create(data));
        return await Promise.all(promises);
      }

      if (query.roadId) {
        return await mapService.findByRoadId(query.roadId as string);
      }

      return await mapService.findAll({});
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  } catch (error) {
    console.error('Error in MapData operation:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process MapData request',
    });
  }
});