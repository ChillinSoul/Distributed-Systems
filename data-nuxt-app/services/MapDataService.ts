import { BaseShardService } from './base/BaseShardService'
import type { MapData, Prisma } from '@prisma/client'

export class MapDataService extends BaseShardService {
  async create(data: Omit<MapData, 'id' | 'createdAt' | 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(data.roadId)
    const shard = this.shardRouter.getShardForKey(shardKey)
    const prisma = this.getPrismaClient(shard.host)

    return prisma.mapData.create({
      data: {
        ...data,
        shardKey
      }
    })
  }

  async findByRoadId(roadId: string) {
    const shardKey = this.shardRouter.generateShardKey(roadId)
    const shard = this.shardRouter.getShardForKey(shardKey)
    const prisma = this.getPrismaClient(shard.host)

    return prisma.mapData.findMany({
      where: { roadId }
    })
  }

  async findAll(params: {
    skip?: number
    take?: number
    orderBy?: Prisma.MapDataOrderByWithRelationInput
  }) {
    return this.executeAcrossShards(prisma => 
      prisma.mapData.findMany(params)
    )
  }
}