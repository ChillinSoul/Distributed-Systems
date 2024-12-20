import { BaseShardService } from './base/BaseShardService';
import type { ANPRData } from '@prisma/client';
import * as mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';

export class ANPRService extends BaseShardService {
  async create(data: Omit<ANPRData, 'id' | 'createdAt' | 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(data.licensePlate);
    const shard = this.shardRouter.getShardForKey(shardKey);
    const connection = await mysql.createConnection({
      host: shard.host,
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    });

    // Use ResultSetHeader for INSERT queries
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO ANPRData (licensePlate, timestamp, vehicleType, speed, location, shardKey) VALUES (?, ?, ?, ?, ?, ?)',
      [data.licensePlate, data.timestamp, data.vehicleType, data.speed, data.location, shardKey]
    );

    await connection.end();

    return {
      id: result.insertId, // Ensure insertId is correctly typed
      ...data,
      shardKey: shardKey.toString(),
      
    };
  }

  async findByLicensePlate(licensePlate: string) {
    const shardKey = this.shardRouter.generateShardKey(licensePlate);
    const shard = this.shardRouter.getShardForKey(shardKey);
    const prisma = this.getPrismaClient(shard.host);

    return prisma.aNPRData.findMany({
      where: { licensePlate },
    });
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
        // Use `query` with string interpolation
        const query = `
          SELECT * FROM ANPRData 
          ORDER BY createdAt DESC 
        `;
        const [rows] = await connection.query(query); // No parameterized binding here
        results.push(...(rows as any[])); // Cast to `any[]` to handle RowDataPacket
      } catch (error) {
        console.error(`Error querying shard ${shard.host}:`, error);
      } finally {
        await connection.end();
      }
    }
  
    return results;
  }
}