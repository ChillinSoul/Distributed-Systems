import { PrismaClient } from '@prisma/client'
import { ShardRouter } from '../../utils/shardRouter'

export abstract class BaseShardService {
  protected shardRouter: ShardRouter
  protected prismaClients: Map<string, PrismaClient> = new Map()

  constructor() {
    this.shardRouter = new ShardRouter()
  }

  async initialize() {
    await this.shardRouter.initialize()
  }

  protected getPrismaClient(host: string) {
    if (!this.prismaClients.has(host)) {
      this.prismaClients.set(host, new PrismaClient({
        datasources: {
          db: {
            url: `mysql://manneken:manneken123@${host}:3306/mannekendata`
          }
        }
      }))
    }
    return this.prismaClients.get(host)!
  }

  protected async executeAcrossShards<T>(
    operation: (prisma: PrismaClient) => Promise<T[]>
  ): Promise<T[]> {
    const results: T[] = []
    for (const [_, shard] of this.shardRouter.getShards()) {
      const prisma = this.getPrismaClient(shard.host)
      const shardResults = await operation(prisma)
      results.push(...shardResults)
    }
    return results
  }
}