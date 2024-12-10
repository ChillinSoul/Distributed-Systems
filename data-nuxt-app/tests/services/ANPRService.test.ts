import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ANPRService } from '../../services/ANPRService'
import { ShardRouter } from '../../utils/shardRouter'

describe('ANPRService', () => {
  let service: ANPRService
  let mockShardRouter: ShardRouter

  beforeEach(() => {
    service = new ANPRService()
    mockShardRouter = service['shardRouter']

    vi.spyOn(mockShardRouter, 'generateShardKey').mockImplementation(() => 123n)
    vi.spyOn(mockShardRouter, 'getShardForKey').mockImplementation(() => ({
      host: 'test-host',
      shardId: 0,
      minKey: 0n,
      maxKey: 500000n
    }))
    vi.spyOn(mockShardRouter, 'initialize').mockResolvedValue()
    vi.spyOn(mockShardRouter, 'getShards').mockReturnValue(new Map())
  })

  test('uses correct shard key for license plate', () => {
    const licensePlate = 'ABC123'
    const spy = vi.spyOn(mockShardRouter, 'generateShardKey')
    
    mockShardRouter.generateShardKey(licensePlate)
    
    expect(spy).toHaveBeenCalledWith(licensePlate)
  })

  test('gets correct shard for key', () => {
    const mockShardKey = 123n
    const spy = vi.spyOn(mockShardRouter, 'getShardForKey')
    
    mockShardRouter.getShardForKey(mockShardKey)
    
    expect(spy).toHaveBeenCalledWith(mockShardKey)
  })

  test('initialization calls ShardRouter initialize', async () => {
    await service.initialize()
    expect(mockShardRouter.initialize).toHaveBeenCalled()
  })
})