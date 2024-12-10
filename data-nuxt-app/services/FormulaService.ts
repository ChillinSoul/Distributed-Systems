import { BaseShardService } from './base/BaseShardService';
import { ServiceFactory } from './ServiceFactory';
import * as mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';

interface Formula{
  formula: string;
  shardKey: string;
  createdAt: Date;
  updatedAt: Date;

}

export async function fetchData(anprService: any, mapDataService: any) {
  console.log('Fetching ANPR and Map data...');
  const [allAnprData, allMapData] = await Promise.all([
    anprService.findAll({}),
    mapDataService.findAll({}),
  ]);
  return { allAnprData, allMapData };
}

export function createSandbox(allAnprData: any[], allMapData: any[]) {
  console.log('Creating sandbox environment...');
  return {
    map: {
      getSpeed: (roadId: string) => {
        const speeds = allMapData
          .filter((d: any) => d.roadId === roadId)
          .map((d: any) => d.avgSpeed);
        console.log(`Map.getSpeed for roadId=${roadId}:`, speeds);
        return speeds;
      },
      getDensity: (roadId: string) => {
        const densities = allMapData
          .filter((d: any) => d.roadId === roadId)
          .map((d: any) => d.vehicleDensity);
        console.log(`Map.getDensity for roadId=${roadId}:`, densities);
        return densities;
      },
      getAccidents: (roadId: string) => {
        const accidents = allMapData
          .filter((d: any) => d.roadId === roadId)
          .map((d: any) => d.accidentsReported);
        console.log(`Map.getAccidents for roadId=${roadId}:`, accidents);
        return accidents;
      },
      getCongestion: (roadId: string) => {
        const congestion = allMapData
          .filter((d: any) => d.roadId === roadId)
          .map((d: any) => d.congestionLevel);
        console.log(`Map.getCongestion for roadId=${roadId}:`, congestion);
        return congestion;
      },
    },
    anpr: {
      getVehicleCount: (criteria: (data: any) => boolean) => {
        const vehicles = allAnprData.filter((data: any) => {
          try {
            return criteria(data);
          } catch (error) {
            console.error('Error evaluating criteria for ANPR.getVehicleCount:', error);
            return false;
          }
        });
        console.log('ANPR.getVehicleCount:', vehicles.length);
        return vehicles.length;
      },
      getAverageSpeed: (criteria: (data: any) => boolean) => {
        const speeds = allAnprData
          .filter((data: any) => {
            try {
              return criteria(data);
            } catch (error) {
              console.error('Error evaluating criteria for ANPR.getAverageSpeed:', error);
              return false;
            }
          })
          .map((d: any) => d.speed);
        console.log('ANPR.getAverageSpeed speeds:', speeds);
        return speeds;
      },
    },
    avg: (array: number[]) => {
      const average = array.length ? array.reduce((a, b) => a + b, 0) / array.length : 0;
      console.log('Calculating avg for array:', array, 'Result:', average);
      return average;
    },
    sum: (array: number[]) => {
      const sum = array.length ? array.reduce((a, b) => a + b, 0) : 0;
      console.log('Calculating sum for array:', array, 'Result:', sum);
      return sum;
    },
    count: (array: any[]) => {
      const count = array.length;
      console.log('Calculating count for array:', array, 'Result:', count);
      return count;
    },
  };
}

export async function executeFormula(formula: string, sandbox: any) {
  console.log('Preparing to execute formula...');
  const keys = Object.keys(sandbox);
  const values = Object.values(sandbox);

  const asyncFn = new Function(
    ...keys,
    `return (async () => { return ${formula}; })()`
  );

  try {
    return await asyncFn(...values);
  } catch (error) {
    console.error('Error during formula execution:', error);
    throw new Error(`Invalid formula: ${(error as Error).message}`);
  }
}

export class FormulaService extends BaseShardService {
  private anprService: any; // Use `any` temporarily until initialized
  private mapDataService: any; // Use `any` temporarily until initialized

  constructor() {
    super();
    const serviceFactory = ServiceFactory.getInstance();
    console.log('Initializing FormulaService...');
    this.initializeServices(serviceFactory);
  }

  private async initializeServices(serviceFactory: ServiceFactory) {
    try {
      console.log('Fetching ANPRService and MapDataService from ServiceFactory...');
      this.anprService = await serviceFactory.getANPRService();
      console.log('ANPRService initialized:', this.anprService);
      this.mapDataService = await serviceFactory.getMapDataService();
      console.log('MapDataService initialized:', this.mapDataService);
    } catch (error) {
      console.error('Error initializing services in FormulaService:', error);
    }
  }

  async create(data: Formula) {
    const shardKey = this.shardRouter.generateShardKey(data.formula);
    const shard = this.shardRouter.getShardForKey(shardKey);
    const connection = await mysql.createConnection({
      host: shard.host,
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    });

    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO Formula (formula, shardKey) VALUES (?, ?)',
      [data.formula, shardKey]
    );

    await connection.end();

    return {
      id: result.insertId,
      ...data,
      shardKey: shardKey.toString(),
    };
  }

  async findAll(params: { orderBy?: { createdAt: 'desc' | 'asc' } }) {
    const results: any[] = [];


    for (const shard of this.shardRouter.getShards().values()) {
      const connection = await mysql.createConnection({
        host: shard.host,
        user: 'manneken',
        password: 'manneken123',
        database: 'mannekendata',
      });

      try {
        const query = `
          SELECT * FROM Formula 
          ORDER BY createdAt DESC 
        `;
        const [rows] = await connection.query(query);
        results.push(...(rows as any[]));
      } catch (error) {
        console.error(`Error querying shard ${shard.host}:`, error);
      } finally {
        await connection.end();
      }
    }

    return results;
  }
  async delete(shardKey: string) {
    const shard = this.shardRouter.getShardForKey(BigInt(shardKey));
    const connection = await mysql.createConnection({
      host: shard.host,
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    });

    try {
      const [result] = await connection.execute<ResultSetHeader>(
        'DELETE FROM Formula WHERE shardKey = ?',
        [shardKey]
      );

      return result.affectedRows > 0; // Return true if a row was deleted
    } catch (error) {
      console.error(`Error deleting formula with shardKey ${shardKey}:`, error);
      throw error;
    } finally {
      await connection.end();
    }
  }


  async execute(
    formula: string,

  ): Promise<number | string> {
    try {
      console.log('Starting formula execution...');
      console.log('Formula:', formula);
      const { anprService, mapDataService } = this;
  
      const { allAnprData, allMapData } = await fetchData(anprService, mapDataService);
      const sandbox = createSandbox(allAnprData, allMapData);
      const result = await executeFormula(formula, sandbox);
  
      console.log('Formula execution result:', result);
      return result;
    } catch (error) {
      console.error('Error executing formula:', error);
      return `Execution failed: ${(error as Error).message}`;
    }
  }
}