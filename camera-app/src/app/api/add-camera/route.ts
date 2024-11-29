import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Define the type for the expected request data
interface CameraData {
  available: string; 
  cameraname: string; 
  cameranumber: string; 
  position: [number, number]; 
}

export async function POST(req: Request) {
  const prisma = new PrismaClient();

  try {
    // Parse and validate the request body
    const data: CameraData = await req.json();

    const { available, cameraname, cameranumber, position } = data;
    
    if (!available || !cameraname || !cameranumber || !position) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate the position array
    if (position.length !== 2) {
      return NextResponse.json({ error: 'Position must be an array of two numbers' }, { status: 400 });
    }

    const [latitude, longitude] = position;

    // Ensure latitude and longitude are numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({ error: 'Latitude and longitude must be valid numbers' }, { status: 400 });
    }

    // Insert into the database
    const newCamera = await prisma.camera.create({
      data: {
        available,
        cameraname,
        cameranumber,
        position,
      },
    });

    return NextResponse.json(newCamera);
  } catch (error: unknown) {
    console.error('Error creating camera:', error);

    return NextResponse.json(
      { error: 'Failed to create camera', details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
