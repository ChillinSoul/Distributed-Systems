import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const intersections = await prisma.intersections.findMany();
    return NextResponse.json(intersections);
  } catch (error) {
    console.error('Error fetching intersections:', error);
    return NextResponse.json({ error: 'Failed to fetch intersections' }, { status: 500 });
  }finally {
    await prisma.$disconnect();
  }
}
