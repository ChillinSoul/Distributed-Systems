import { ServiceFactory } from "~~/services/ServiceFactory";

export default defineEventHandler(async (event) => {
    const serviceFactory = ServiceFactory.getInstance();
    const mapService = await serviceFactory.getExternalMapService();
  
    try {
      const query = getQuery(event);
      const { start, end } = query;
  
      if (!start || !end) {
        throw createError({
          statusCode: 400,
          message: 'Start and end points are required'
        });
      }
  
      const path = await mapService.getShortestPath(
        parseInt(start as string),
        parseInt(end as string)
      );
  
      return path;
    } catch (error) {
      console.error('Error calculating shortest path:', error);
      throw createError({
        statusCode: 500,
        message: 'Failed to calculate shortest path'
      });
    }
  });