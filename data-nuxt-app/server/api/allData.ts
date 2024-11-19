import { prisma } from './db';

export default defineEventHandler(async () => {
  try {
    const [anpr, map] = await Promise.all([
      prisma.aNPRData.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
      }),
      prisma.mapData.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
      })
    ]);

    return {
      anpr,
      map
    };
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch data'
    });
  }
});