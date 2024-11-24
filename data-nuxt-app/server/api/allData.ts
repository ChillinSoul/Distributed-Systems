import { ServiceFactory } from '../../services/ServiceFactory'

export default defineEventHandler(async () => {
  try {
    const serviceFactory = ServiceFactory.getInstance()
    const [anprService, mapService] = await Promise.all([
      serviceFactory.getANPRService(),
      serviceFactory.getMapDataService()
    ])

    // Fetch latest data from all shards
    const [anpr, map] = await Promise.all([
      anprService.findAll({
        take: 100,
        orderBy: { createdAt: 'desc' }
      }),
      mapService.findAll({
        take: 100,
        orderBy: { createdAt: 'desc' }
      })
    ])

    return {
      anpr,
      map
    }

  } catch (error) {
    console.error('Error fetching all data:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch data'
    })
  }
})