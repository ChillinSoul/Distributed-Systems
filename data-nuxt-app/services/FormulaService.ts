import { BaseShardService } from './base/BaseShardService'
import type { Formula, Prisma } from '@prisma/client'

export class FormulaService extends BaseShardService {
  async create(data: Omit<Formula, 'id' | 'createdAt' | 'updatedAt' | 'shardKey'>) {
    const shardKey = this.shardRouter.generateShardKey(data.formula)
    const shard = this.shardRouter.getShardForKey(shardKey)
    const prisma = this.getPrismaClient(shard.host)

    return prisma.formula.create({
      data: {
        ...data,
        shardKey
      }
    })
  }

  async findAll(params: {
    skip?: number
    take?: number
    orderBy?: Prisma.FormulaOrderByWithRelationInput
  }) {
    return this.executeAcrossShards(prisma => 
      prisma.formula.findMany(params)
    )
  }
}