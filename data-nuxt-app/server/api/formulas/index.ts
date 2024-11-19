import { prisma } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const method = event.req.method;

    switch (method) {
      case 'GET':
        return await prisma.formula.findMany({
          orderBy: { createdAt: 'desc' }
        });

      case 'POST':
        const body = await readBody(event);
        if (!body.formula) {
          throw createError({
            statusCode: 400,
            message: 'No formula provided'
          });
        }

        const created = await prisma.formula.create({
          data: {
            formula: body.formula
          }
        });

        return {
          success: true,
          formula: created
        };

      default:
        throw createError({
          statusCode: 405,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Error in formulas endpoint:', error);
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    });
  }
});