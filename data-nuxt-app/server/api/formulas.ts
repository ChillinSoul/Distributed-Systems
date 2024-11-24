import { ServiceFactory } from '../../services/ServiceFactory';

export default defineEventHandler(async (event) => {
  const serviceFactory = ServiceFactory.getInstance();
  const formulaService = await serviceFactory.getFormulaService();

  try {
    const method = event.req.method;

    switch (method) {
      case 'GET': {
        const query = getQuery(event);
        return await formulaService.findAll({});
      }

      case 'POST': {
        const body = await readBody(event);

        // If formula execution is requested
        if (body.execute && body.formula) {
          const formulaResult = await formulaService.execute(body.formula);
          return { result: formulaResult };
        }

        if (!body.formula) {
          throw createError({ statusCode: 400, message: 'Formula is required.' });
        }

        return await formulaService.create(body);
      }

      case 'DELETE': {
        const body = await readBody(event);
        if (!body.shardKey) {
          throw createError({ statusCode: 400, message: 'Shard key is required.' });
        }

        const success = await formulaService.delete(body.shardKey);
        return { success };
      }

      default:
        throw createError({ statusCode: 405, message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in Formula API operation:', error);
    throw createError({ statusCode: 500, message: 'Internal Server Error' });
  }
});