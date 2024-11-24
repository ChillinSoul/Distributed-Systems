import { BaseShardService } from './base/BaseShardService';
import { ANPRService } from './ANPRService';
import { MapDataService } from './MapDataService';
import type { Formula } from '@prisma/client';
import * as mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';

export class FormulaService extends BaseShardService {
  private anprService: ANPRService;
  private mapDataService: MapDataService;

  constructor() {
    super();
    this.anprService = new ANPRService();
    this.mapDataService = new MapDataService();
  }

  async create(data: Omit<Formula, 'id' | 'createdAt' | 'updatedAt' | 'shardKey'>) {
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
  async execute(formula: string): Promise<number | string> {
    try {
      // Define the context with functions and variables
      const context = {
        anpr: {
          getVehicleCount: async (criteria: (data: any) => boolean) => {
            const data = await this.anprService.findAll({ skip: 0, take: 100 }); // Fetch ANPR data
            return data.filter(criteria).length;
          },
        },
        map: {
          getVehicleDensity: async (roadId: string) => {
            const data = await this.mapDataService.findByRoadId(roadId);
            return data.length > 0 ? data[0].vehicleDensity : 0;
          },
          getAccidents: async (roadId: string) => {
            const data = await this.mapDataService.findByRoadId(roadId);
            return data.length > 0 ? data[0].accidentsReported : 0;
          },
        },
        avg: (array: number[]) => array.reduce((a, b) => a + b, 0) / array.length,
        sum: (array: number[]) => array.reduce((a, b) => a + b, 0),
        count: (array: any[]) => array.length,
      };
  
      // Use `eval` or a custom function evaluator to handle async calls
      const keys = Object.keys(context);
      const values = Object.values(context);
  
      // Wrap async calls within an eval-able async function
      const asyncFn = new Function(
        ...keys,
        `return (async () => { return (${formula}); })()`
      );
  
      return await asyncFn(...values);
    } catch (error) {
      console.error(`Error executing formula: ${formula}`, error);
      return 'Execution failed';
    }
  }
}