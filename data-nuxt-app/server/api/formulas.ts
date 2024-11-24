import { faker } from '@faker-js/faker'
import { ServiceFactory } from '../../services/ServiceFactory'

const generateFakeFormula = () => {
  const variables = ['vehicle_density', 'avg_speed', 'accidents', 'weather_factor']
  const operators = ['+', '-', '*', '/']
  
  const formula = variables
    .slice(0, faker.number.int({ min: 2, max: 4 }))
    .map(v => `${v} * ${faker.number.float({ min: 0.1, max: 2 })}`)
    .join(faker.helpers.arrayElement(operators))
  
  return {
    formula: `risk_index = ${formula}`
  }
}

export default defineEventHandler(async (event) => {
  const method = event.method
  const serviceFactory = ServiceFactory.getInstance()
  const formulaService = await serviceFactory.getFormulaService()

  switch (method) {
    case 'POST':
      const body = await readBody(event)
      
      // Generate fake formula if no body is provided
      if (!body || Object.keys(body).length === 0) {
        const fakeFormula = generateFakeFormula()
        return await formulaService.create(fakeFormula)
      }
      
      return await formulaService.create(body)

    case 'GET':
      const query = getQuery(event)
      
      // Generate multiple fake formulas
      if (query.generate === 'true') {
        const count = parseInt(query.count as string) || 5
        const promises = Array.from({ length: count }, () => 
          formulaService.create(generateFakeFormula())
        )
        return await Promise.all(promises)
      }

      return await formulaService.findAll({
        skip: query.skip ? parseInt(query.skip as string) : undefined,
        take: query.take ? parseInt(query.take as string) : 10,
        orderBy: query.orderBy ? {
          [query.orderBy as string]: query.order || 'desc'
        } : { createdAt: 'desc' }
      })

    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
  }
})