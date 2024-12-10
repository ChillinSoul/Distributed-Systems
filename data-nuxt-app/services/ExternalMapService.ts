import { BaseShardService } from './base/BaseShardService';
import * as mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';

interface Intersection {
  id: number;
  name: string;
  x_coordinate: number;
  y_coordinate: number;
}

interface ExternalRoad {
  id: number;
  start_intersection: number;
  end_intersection: number;
  length: number;
  useable: boolean;
}

export class ExternalMapService extends BaseShardService {
  private apiBaseUrl = 'http://map-app-service/api';
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY = 2000; // 2 seconds

  private async createDatabaseConnection(shard: any) {
    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        const connection = await mysql.createConnection({
          host: shard.host,
          user: 'manneken',
          password: 'manneken123',
          database: 'mannekendata',
          connectTimeout: 10000, // 10 seconds
        });
        
        // Test the connection
        await connection.query('SELECT 1');
        return connection;
      } catch (error) {
        retries++;
        console.error(`Connection attempt ${retries} failed:`, error);
        if (retries === this.MAX_RETRIES) {
          throw new Error(`Failed to connect to database after ${this.MAX_RETRIES} attempts`);
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
      }
    }
    throw new Error('Failed to establish database connection');
  }

  async fetchAndStoreMapData() {
    try {
      console.log('Fetching map data from:', `${this.apiBaseUrl}/map-data`);
      // Fetch data from external API
      const response = await fetch(`${this.apiBaseUrl}/map-data`);
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`Failed to fetch map data: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', {
        intersectionCount: data.intersections?.length || 0,
        roadsCount: data.roads?.length || 0
      });
      
      // Store intersections first, then roads to maintain referential integrity
      if (data.intersections?.length) {
        for (const intersection of data.intersections) {
          await this.createIntersection(intersection).catch(error => {
            console.error('Error storing intersection:', error);
          });
        }
      }

      if (data.roads?.length) {
        for (const road of data.roads) {
          await this.createRoad(road).catch(error => {
            console.error('Error storing road:', error);
          });
        }
      }

      return data;
    } catch (error) {
      console.error('Error in fetchAndStoreMapData:', error);
      throw error;
    }
  }

  async createIntersection(data: Omit<Intersection, 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(data.name);
    const shard = this.shardRouter.getShardForKey(shardKey);
    let connection;

    try {
      connection = await this.createDatabaseConnection(shard);
      
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO Intersection (name, x_coordinate, y_coordinate, shardKey) VALUES (?, ?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE x_coordinate=VALUES(x_coordinate), y_coordinate=VALUES(y_coordinate)',
        [data.name, data.x_coordinate, data.y_coordinate, shardKey]
      );

      const { id, ...rest } = data;
      return {
        id: result.insertId || id,
        ...rest,
        shardKey: shardKey.toString(),
      };
    } finally {
      if (connection) {
        await connection.end().catch(console.error);
      }
    }
  }
  async deleteIntersection(data: Omit<Intersection, 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(data.name);
    const shard = this.shardRouter.getShardForKey(shardKey);
    let connection;

    try {
      connection = await this.createDatabaseConnection(shard);
      
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO Intersection (name, x_coordinate, y_coordinate, shardKey) VALUES (?, ?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE x_coordinate=VALUES(x_coordinate), y_coordinate=VALUES(y_coordinate)',
        [data.name, data.x_coordinate, data.y_coordinate, shardKey]
      );

      const { id, ...rest } = data;
      return {
        id: result.insertId || id,
        ...rest,
        shardKey: shardKey.toString(),
      };
    } finally {
      if (connection) {
        await connection.end().catch(console.error);
      }
    }
  }

  async deleteRoad(data: Omit<ExternalRoad, 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(`${data.start_intersection}-${data.end_intersection}`);
    const shard = this.shardRouter.getShardForKey(shardKey);
    let connection;

    try {
      connection = await this.createDatabaseConnection(shard);
      
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO ExternalRoad (start_intersection, end_intersection, length, useable, shardKey) VALUES (?, ?, ?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE length=VALUES(length), useable=VALUES(useable)',
        [data.start_intersection, data.end_intersection, data.length, data.useable, shardKey]
      );

      const { id, ...rest } = data;
      return {
        id: result.insertId || id,
        ...rest,
        shardKey: shardKey.toString(),
      };
    } finally {
      if (connection) {
        await connection.end().catch(console.error);
      }
    }
  }

  async findAllIntersections() {
    const results: Intersection[] = [];

    for (const shard of this.shardRouter.getShards().values()) {
      const connection = await mysql.createConnection({
        host: shard.host,
        user: 'manneken',
        password: 'manneken123',
        database: 'mannekendata',
      });

      try {
        const [rows] = await connection.query('SELECT * FROM Intersection');
        results.push(...(rows as Intersection[]));
      } finally {
        await connection.end();
      }
    }

    return results;
  }

  async findAllRoads() {
    const results: ExternalRoad[] = [];

    for (const shard of this.shardRouter.getShards().values()) {
      const connection = await mysql.createConnection({
        host: shard.host,
        user: 'manneken',
        password: 'manneken123',
        database: 'mannekendata',
      });

      try {
        const [rows] = await connection.query('SELECT * FROM ExternalRoad');
        results.push(...(rows as ExternalRoad[]));
      } finally {
        await connection.end();
      }
    }

    return results;
  }

  async getShortestPath(startId: number, endId: number) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/shortest-path?start=${startId}&end=${endId}`
      );
      if (!response.ok) {
        throw new Error('Failed to calculate shortest path');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in getShortestPath:', error);
      throw error;
    }
  }
}