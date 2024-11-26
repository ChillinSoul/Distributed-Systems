import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


export async function GET() {
  const prisma = new PrismaClient();
  try {
    const cameras = await prisma.camera.findMany();
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return NextResponse.json({ error: 'Failed to fetch cameras' }, { status: 500 });
  }finally {
    await prisma.$disconnect();
  }
}
