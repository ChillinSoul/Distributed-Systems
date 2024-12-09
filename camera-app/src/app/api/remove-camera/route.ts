import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    // Parse the request body to get the camera ID
    const { id } = await req.json();

    // Validate the input
    if (!id) {
      return NextResponse.json(
        { error: 'Camera ID is required.' },
        { status: 400 }
      );
    }

    // Delete the camera from the database
    const deletedCamera = await prisma.camera.delete({
      where: { id },
    });

    // Return the deleted camera details
    return NextResponse.json(deletedCamera, { status: 200 });
  } catch (error) {
    console.error('Error deleting camera:', error);

    // Handle cases where the camera is not found
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Camera not found.' },
        { status: 404 }
      );
    }

    // Return error response
    return NextResponse.json(
      { error: 'Unable to delete camera.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
