import { BaseShardService } from './base/BaseShardService';
import type { MapData } from '@prisma/client';
import * as mysql from 'mysql2/promise';
import type { RowDataPacket, FieldPacket, ResultSetHeader } from 'mysql2';

export class MapDataService extends BaseShardService {
  async create(data: Omit<MapData, 'id' | 'createdAt' | 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(data.roadId);
    const shard = this.shardRouter.getShardForKey(shardKey);
    const connection = await mysql.createConnection({
      host: shard.host,
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    });

    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO MapData (roadId, roadName, vehicleDensity, avgSpeed, congestionLevel, accidentsReported, weatherCondition, shardKey) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        data.roadId,
        data.roadName,
        data.vehicleDensity,
        data.avgSpeed,
        data.congestionLevel,
        data.accidentsReported,
        data.weatherCondition,
        shardKey,
      ]
    );

    await connection.end();

    return {
      id: result.insertId,
      ...data,
      shardKey: shardKey.toString(),
    };
  }

  async findByRoadId(roadId: string) {
    const shardKey = this.shardRouter.generateShardKey(roadId);
    const shard = this.shardRouter.getShardForKey(shardKey);
    const connection = await mysql.createConnection({
      host: shard.host,
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    });

    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
        'SELECT * FROM MapData WHERE roadId = ?',
        [roadId]
      );

      return rows as any[]; // Return the results
    } catch (error) {
      console.error(`Error querying shard ${shard.host}:`, error);
      throw error;
    } finally {
      await connection.end();
    }
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
          SELECT * FROM MapData 
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
}