import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  const anprData = await prisma.aNPRData.findMany();
  const mapData = await prisma.mapData.findMany();

  return {
    anpr: anprData,
    map: mapData,
  };
});
