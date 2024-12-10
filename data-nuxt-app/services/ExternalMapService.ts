// services/ExternalMapService.ts
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
  private apiBaseUrl = 'http://localhost/map-app/api';

  async fetchAndStoreMapData() {
    try {
      // Fetch data from external API
      const response = await fetch(`${this.apiBaseUrl}/map-data`);
      if (!response.ok) {
        throw new Error('Failed to fetch map data');
      }
      
      const data = await response.json();
      
      // Store intersections and roads
      await Promise.all([
        ...data.intersections.map((intersection: Omit<Intersection, "shardKey">) => this.createIntersection(intersection)),
        ...data.roads.map((road: Omit<ExternalRoad, "shardKey">) => this.createRoad(road))
      ]);

      return data;
    } catch (error) {
      console.error('Error in fetchAndStoreMapData:', error);
      throw error;
    }
  }

  async createIntersection(data: Omit<Intersection, 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(data.name);
    const shard = this.shardRouter.getShardForKey(shardKey);
    const connection = await mysql.createConnection({
      host: shard.host,
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    });

    try {
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO Intersection (name, x_coordinate, y_coordinate, shardKey) VALUES (?, ?, ?, ?)',
        [data.name, data.x_coordinate, data.y_coordinate, shardKey]
      );

      const { id, ...rest } = data;
      return {
        id: result.insertId,
        ...rest,
        shardKey: shardKey.toString(),
      };
    } finally {
      await connection.end();
    }
  }

  async createRoad(data: Omit<ExternalRoad, 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(`${data.start_intersection}-${data.end_intersection}`);
    const shard = this.shardRouter.getShardForKey(shardKey);
    const connection = await mysql.createConnection({
      host: shard.host,
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    });

    try {
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO ExternalRoad (start_intersection, end_intersection, length, useable, shardKey) VALUES (?, ?, ?, ?, ?)',
        [data.start_intersection, data.end_intersection, data.length, data.useable, shardKey]
      );

      const { id, ...rest } = data;
      return {
        id: result.insertId,
        ...rest,
        shardKey: shardKey.toString(),
      };
    } finally {
      await connection.end();
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