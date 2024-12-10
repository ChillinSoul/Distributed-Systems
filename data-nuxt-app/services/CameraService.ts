// services/CameraService.ts
import { BaseShardService } from './base/BaseShardService';
import * as mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';

interface VideoRecord {
  id?: number;
  cameranumber: string;
  numberplate: string;
  typevehicule: string;
  createat: Date;
  shardKey?: bigint;
}

export class CameraService extends BaseShardService {
  private apiBaseUrl = 'http://camera-app-host/api';

  async fetchAndStoreVideos() {
    try {
      // Fetch data from external API
      const response = await fetch(`${this.apiBaseUrl}/videos`);
      if (!response.ok) {
        throw new Error('Failed to fetch video data');
      }
      
      const data = await response.json();
      const videos = data.data;

      // Store each video record
      const promises = videos.map((video: Omit<VideoRecord, "id" | "shardKey">) => this.create(video));
      await Promise.all(promises);

      return videos;
    } catch (error) {
      console.error('Error in fetchAndStoreVideos:', error);
      throw error;
    }
  }

  async create(data: Omit<VideoRecord, 'id' | 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(data.numberplate);
    const shard = this.shardRouter.getShardForKey(shardKey);
    const connection = await mysql.createConnection({
      host: shard.host,
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    });

    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO VideoRecord (cameranumber, numberplate, typevehicule, createat, shardKey) VALUES (?, ?, ?, ?, ?)',
      [data.cameranumber, data.numberplate, data.typevehicule, data.createat, shardKey]
    );

    await connection.end();

    return {
      id: result.insertId,
      ...data,
      shardKey: shardKey.toString(),
    };
  }

  async findAll(params: { orderBy?: { createat: 'desc' | 'asc' } }) {
    const results: VideoRecord[] = [];

    for (const shard of this.shardRouter.getShards().values()) {
      const connection = await mysql.createConnection({
        host: shard.host,
        user: 'manneken',
        password: 'manneken123',
        database: 'mannekendata',
      });

      try {
        const query = `
          SELECT * FROM VideoRecord 
          ORDER BY createat DESC 
        `;
        const [rows] = await connection.query(query);
        results.push(...(rows as VideoRecord[]));
      } catch (error) {
        console.error(`Error querying shard ${shard.host}:`, error);
      } finally {
        await connection.end();
      }
    }

    return results;
  }

  async findByPlate(numberplate: string) {
    const shardKey = this.shardRouter.generateShardKey(numberplate);
    const shard = this.shardRouter.getShardForKey(shardKey);
    const connection = await mysql.createConnection({
      host: shard.host,
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    });

    try {
      const [rows] = await connection.execute(
        'SELECT * FROM VideoRecord WHERE numberplate = ?',
        [numberplate]
      );
      return rows;
    } finally {
      await connection.end();
    }
  }
}