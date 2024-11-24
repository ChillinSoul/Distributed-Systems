import { BaseShardService } from './base/BaseShardService'
import type { ANPRData, Prisma } from '@prisma/client'

export class ANPRService extends BaseShardService {
  async create(data: Omit<ANPRData, 'id' | 'createdAt' | 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(data.licensePlate)
    const shard = this.shardRouter.getShardForKey(shardKey)
    const prisma = this.getPrismaClient(shard.host)

    return prisma.aNPRData.create({
      data: {
        ...data,
        shardKey
      }
    })
  }

  async findByLicensePlate(licensePlate: string) {
    const shardKey = this.shardRouter.generateShardKey(licensePlate)
    const shard = this.shardRouter.getShardForKey(shardKey)
    const prisma = this.getPrismaClient(shard.host)

    return prisma.aNPRData.findMany({
      where: { licensePlate }
    })
  }

  async findAll(params: {
    skip?: number
    take?: number
    orderBy?: Prisma.ANPRDataOrderByWithRelationInput
  }) {
    return this.executeAcrossShards(prisma => 
      prisma.aNPRData.findMany(params)
    )
  }
}