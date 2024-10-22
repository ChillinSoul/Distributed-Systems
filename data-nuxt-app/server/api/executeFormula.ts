import { VM } from 'vm2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define types for the data in your ANPR and Map endpoints
interface ANPRData {
  licensePlate: string;
  timestamp: Date;
  vehicleType: string;
  speed: number;
  location: string;
}

interface MapData {
  roadId: string;
  roadName: string;
  vehicleDensity: number;
  avgSpeed: number;
  congestionLevel: string;
  accidentsReported: number;
  weatherCondition: string;
}

export default defineEventHandler(async (event) => {
  const { formula } = await readBody(event);

  // Fetch all data from the database
  const allAnprData: ANPRData[] = await prisma.aNPRData.findMany();
  const allMapData: MapData[] = await prisma.mapData.findMany();

  // VM for secure formula execution
  const vm = new VM({
    timeout: 1000, // Safety measure to prevent infinite loops
    sandbox: {
      map: {
        getSpeed: (roadId: string): number[] => allMapData.filter((d) => d.roadId === roadId).map((d) => d.avgSpeed),
        getDensity: (roadId: string): number[] => allMapData.filter((d) => d.roadId === roadId).map((d) => d.vehicleDensity),
        getAccidents: (roadId: string): number[] => allMapData.filter((d) => d.roadId === roadId).map((d) => d.accidentsReported),
        getCongestion: (roadId: string): string[] => allMapData.filter((d) => d.roadId === roadId).map((d) => d.congestionLevel),
      },
      anpr: {
        getVehicleCount: (criteria: (data: ANPRData) => boolean): number => allAnprData.filter(criteria).length,
        getAverageSpeed: (criteria: (data: ANPRData) => boolean): number[] => allAnprData.filter(criteria).map(d => d.speed),
      },
      avg: (array: number[]): number => array.length ? array.reduce((a: number, b: number) => a + b, 0) / array.length : 0,
      sum: (array: number[]): number => array.length ? array.reduce((a: number, b: number) => a + b, 0) : 0,
      count: (array: any[]): number => array.length,
    },
  });

  let result;
  try {
    result = await vm.run(`(async () => { return ${formula}; })()`);
  } catch (err) {
    throw new Error('Error executing formula: ' + (err as Error).message);
  }

  return { result };
});
