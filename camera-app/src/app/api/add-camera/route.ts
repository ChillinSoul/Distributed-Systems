import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { cameraName, cameraNumber, position } = data;

    // Create a new camera in the database
    const newCamera = await prisma.cameras.create({
      data: {
        cameraName,
        cameraNumber,
        position, // position is an array of latitude and longitude
      },
    });

    // Return the newly created camera
    return NextResponse.json(newCamera);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create camera' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
