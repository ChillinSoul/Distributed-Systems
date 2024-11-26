import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all cameras from the database
    const cameras = await prisma.camera.findMany();
    
    // Return the cameras as JSON
    return NextResponse.json(cameras);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch cameras" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}