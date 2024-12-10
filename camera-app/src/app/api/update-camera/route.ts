import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdateCameraRequest {
  cameranumber: string;
  available: boolean;
}

export async function PUT(req: Request) {
  try {
    const { cameranumber, available }: UpdateCameraRequest = await req.json();

    // Validate input
    if (!cameranumber || typeof available !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid input. Both cameranumber and available are required.' },
        { status: 400 }
      );
    }

    // Find and update the camera by its cameranumber
    const updatedCamera = await prisma.camera.updateMany({
      where: { cameranumber },
      data: { available: available.toString() }, // Convert boolean to string if your schema uses a string type for availability
    });

    // Return the updated camera details
    return NextResponse.json(updatedCamera, { status: 200 });
  } catch (error) {
    console.error('Error updating camera availability:', error);

    // Handle case where the camera is not found
    if (error instanceof Error && error.message.includes('Record to update does not exist')) {
      return NextResponse.json(
        { error: 'Camera not found.' },
        { status: 404 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Unable to update camera availability.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
