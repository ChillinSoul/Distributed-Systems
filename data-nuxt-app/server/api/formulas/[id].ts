import { prisma } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const method = event.req.method;
    const { id } = event.context.params as { id: string };
    const formulaId = parseInt(id);

    switch (method) {
      case 'GET':
        const formula = await prisma.formula.findUnique({
          where: { id: formulaId }
        });
        
        if (!formula) {
          throw createError({
            statusCode: 404,
            message: 'Formula not found'
          });
        }
        
        return formula;

      case 'PUT':
        const body = await readBody(event);
        if (!body.formula) {
          throw createError({
            statusCode: 400,
            message: 'No formula provided'
          });
        }

        const updated = await prisma.formula.update({
          where: { id: formulaId },
          data: { formula: body.formula }
        });

        return {
          success: true,
          formula: updated
        };

      case 'DELETE':
        await prisma.formula.delete({
          where: { id: formulaId }
        });

        return { success: true };

      default:
        throw createError({
          statusCode: 405,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Error in formula ID endpoint:', error);
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    });
  }
});