import { PrismaClient } from '@prisma/client'

export class ShardRouter {
  private shardRegistry: Map<number, { host: string; minKey: bigint; maxKey: bigint }> = new Map()
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async initialize() {
    const shards = await this.prisma.shardRegistry.findMany()
    shards.forEach(shard => {
      this.shardRegistry.set(shard.shardId, {
        host: shard.host,
        minKey: shard.minKey,
        maxKey: shard.maxKey
      })
    })
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
    // Simple hash function for demonstration
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
