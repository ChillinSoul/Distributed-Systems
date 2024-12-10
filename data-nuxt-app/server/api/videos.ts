// server/api/videos.ts
import { ServiceFactory } from '../../services/ServiceFactory';

export default defineEventHandler(async (event) => {
  const serviceFactory = ServiceFactory.getInstance();
  const cameraService = await serviceFactory.getCameraService();

  try {
    // Get query parameters
    const query = getQuery(event);

    switch (event.method) {
      case 'GET':
        // If numberplate is provided, filter by it
        if (query.numberplate) {
          return await cameraService.findByPlate(query.numberplate as string);
        }
        
        // Otherwise return all videos
        return await cameraService.findAll({
          orderBy: { createat: 'desc' }
        });

      default:
        throw createError({
          statusCode: 405,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Error in videos operation:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to process video request'
    });
  }
});