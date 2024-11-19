import { VM } from 'vm2';
import { prisma } from './db';

export default defineEventHandler(async (event) => {
  try {
    const { formula } = await readBody(event);

    // Fetch data from database
    const [allAnprData, allMapData] = await Promise.all([
      prisma.aNPRData.findMany(),
      prisma.mapData.findMany()
    ]);

    const vm = new VM({
      timeout: 1000,
      sandbox: {
        map: {
          getSpeed: (roadId: string) => allMapData
            .filter(d => d.roadId === roadId)
            .map(d => d.avgSpeed),
          getDensity: (roadId: string) => allMapData
            .filter(d => d.roadId === roadId)
            .map(d => d.vehicleDensity),
          getAccidents: (roadId: string) => allMapData
            .filter(d => d.roadId === roadId)
            .map(d => d.accidentsReported),
          getCongestion: (roadId: string) => allMapData
            .filter(d => d.roadId === roadId)
            .map(d => d.congestionLevel),
        },
        anpr: {
          getVehicleCount: (criteria: Function) => allAnprData.filter(data => {
            try {
              return criteria(data);
            } catch {
              return false;
            }
          }).length,
          getAverageSpeed: (criteria: Function) => allAnprData
            .filter(data => {
              try {
                return criteria(data);
              } catch {
                return false;
              }
            })
            .map(d => d.speed),
        },
        avg: (array: number[]) => array.length ? 
          array.reduce((a, b) => a + b, 0) / array.length : 0,
        sum: (array: number[]) => array.length ? 
          array.reduce((a, b) => a + b, 0) : 0,
        count: (array: any[]) => array.length,
      },
    });

    const result = await vm.run(`(async () => { return ${formula}; })()`);
    return { result };
  } catch (error) {
    console.error('Error executing formula:', error);
    throw createError({
      statusCode: 500,
      message: `Error executing formula: ${error.message}`
    });
  }
});