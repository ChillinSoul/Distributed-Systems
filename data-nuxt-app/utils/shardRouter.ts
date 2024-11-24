import mysql from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';

export class ShardRouter {
  private shardRegistry: Map<number, { host: string; minKey: bigint; maxKey: bigint }> = new Map()

  async initialize() {
    const connection = await mysql.createConnection({
      host: 'mysql-shard-0.mysql-shard',
      user: 'manneken',
      password: 'manneken123',
      database: 'mannekendata',
    })

    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM ShardRegistry');
    rows.forEach(shard => {
      this.shardRegistry.set(shard.shardId, {
        host: shard.host,
        minKey: shard.minKey,
        maxKey: shard.maxKey
      })
    })

    await connection.end()
  }

  getShardForKey(key: bigint) {
    for (const [shardId, shard] of this.shardRegistry) {
      if (key >= shard.minKey && key <= shard.maxKey) {
        return { shardId, ...shard }
      }
    }
    throw new Error(`No shard found for key: ${key}`)
  }

  generateShardKey(value: string): bigint {
    let hash = BigInt(0)
    for (let i = 0; i < value.length; i++) {
      hash = (hash * BigInt(31) + BigInt(value.charCodeAt(i))) % BigInt(1000000)
    }
    return hash
  }

  getShards() {
    return this.shardRegistry
  }
}
