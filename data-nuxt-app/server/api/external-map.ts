import { ServiceFactory } from '../../services/ServiceFactory';

export default defineEventHandler(async (event) => {
  const serviceFactory = ServiceFactory.getInstance();
  const mapService = await serviceFactory.getExternalMapService();

  try {
    const method = event.method;
    const query = getQuery(event);

    switch (method) {
      case 'GET':
        // Handle shortest path calculation
        if (event.node.req.url?.includes('/shortest-path')) {
          const { start, end } = query;
          if (!start || !end) {
            throw createError({
              statusCode: 400,
              message: 'Start and end points are required'
            });
          }
          return await mapService.getShortestPath(
            parseInt(start as string), 
            parseInt(end as string)
          );
        }

        await mapService.fetchAndStoreMapData();
        const [intersections, roads] = await Promise.all([
          mapService.findAllIntersections(),
          mapService.findAllRoads()
        ]) || {
          intersections: [],
          roads: []
        };

        return {
          intersections,
          roads
        };

      default:
        throw createError({
          statusCode: 405,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Error in external map operation:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to process map request'
    });
  }
});
