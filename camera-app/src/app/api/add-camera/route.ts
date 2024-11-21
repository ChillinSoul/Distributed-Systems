import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const data = await req.json();
    const { available, cameraName, cameraNumber, position } = data;

    // Validate position array
    if (position.length !== 2) {
      return NextResponse.json({ error: 'Invalid position data' }, { status: 400 });
    }

    const [latitude, longitude] = position;

    // Validate latitude and longitude as numbers
    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return NextResponse.json({ error: 'Latitude and longitude must be numbers' }, { status: 400 });
    }

    // Create a new camera record in the database
    const newCamera = await prisma.cameras.create({
      data: {
        available,
        cameraName,
        cameraNumber,
        position: [latitude.toString(), longitude.toString()],
      },
    });

    return NextResponse.json(newCamera);
  } catch (error: unknown) {
    // Log the error for debugging
    console.error('Error creating camera:', error);

    // Return a detailed error response
    return NextResponse.json(
      { error: 'Failed to create camera', details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    // Disconnect the Prisma client
    await prisma.$disconnect();
  }
}
