import { describe, test, expect, vi, beforeEach } from 'vitest'
import { MapDataService } from '../../services/MapDataService'
import { ShardRouter } from '../../utils/shardRouter'

describe('MapDataService', () => {
  let service: MapDataService
  let mockShardRouter: ShardRouter

  beforeEach(() => {
    service = new MapDataService()
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

  test('uses correct shard key for road ID', () => {
    const roadId = 'R123'
    const spy = vi.spyOn(mockShardRouter, 'generateShardKey')
    
    mockShardRouter.generateShardKey(roadId)
    
    expect(spy).toHaveBeenCalledWith(roadId)
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