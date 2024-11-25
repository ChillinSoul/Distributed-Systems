import { faker } from '@faker-js/faker'
import { ServiceFactory } from '../../services/ServiceFactory'

export default defineEventHandler(async (event) => {
  const serviceFactory = ServiceFactory.getInstance()
  const anprService = await serviceFactory.getANPRService()

  try {
    // Get query parameters
    const query = getQuery(event)
    const generateFake = query.generate === 'true'
    if (generateFake) {
      // Generate fake ANPR data
      const anprData = {
        licensePlate: faker.vehicle.vrm(),
        timestamp: faker.date.recent(),
        vehicleType: faker.vehicle.type(),
        speed: faker.number.int({ min: 30, max: 120 }),
        location: `C${faker.number.int({ min: 1, max: 5 })}`
      }

      // Save to appropriate shard based on license plate
      const saved = await anprService.create(anprData)
      return saved
    }

    // If not generating fake data, handle normal CRUD operations
    switch (event.method) {
      case 'POST':
        const body = await readBody(event)
        return await anprService.create(body)

      case 'GET':
        if (query.licensePlate) {
          return await anprService.findByLicensePlate(query.licensePlate as string)
        }
        return await anprService.findAll({
          orderBy: { createdAt: 'desc' }
        })

      default:
        throw createError({
          statusCode: 405,
          message: 'Method not allowed'
        })
    }

  } catch (error) {
    console.error('Error in ANPR operation:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process ANPR request'
    })
  }
})