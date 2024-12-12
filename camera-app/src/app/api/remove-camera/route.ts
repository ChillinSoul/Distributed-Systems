import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CameraData {
  cameranumber: string; // Use cameranumber instead of ID
}

export async function DELETE(req: Request) {
  try {
    console.log("Starting DELETE request handler...");

    // Parse the request body to get the camera number
    const { cameranumber }: CameraData = await req.json();

    console.log("Parsed camera number:", cameranumber);

    // Validate the input
    if (!cameranumber) {
      console.error("No camera number provided in the request.");
      return NextResponse.json(
        { error: 'Camera number is required.' },
        { status: 400 }
      );
    }

    const deletedVideos = await prisma.video.deleteMany({
      where: { cameranumber },
    });

    console.log("Deleted videos count:", deletedVideos.count);

    // Delete the camera from the database
    console.log("Deleting camera with number:", cameranumber);

    const deletedCamera = await prisma.camera.deleteMany({
      where: { cameranumber },
    });

    console.log("Deleted camera:", deletedCamera);

    // Return the deleted camera details
    return NextResponse.json(deletedCamera, { status: 200 });
  } catch (error) {
    console.error('Error deleting camera and associated videos:', error);

    // Handle cases where the camera is not found
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      console.error("Camera not found or already deleted.");
      return NextResponse.json(
        { error: 'Camera not found.' },
        { status: 404 }
      );
    }

    // Return error response
    return NextResponse.json(
      { error: 'Unable to delete camera and associated videos.' },
      { status: 500 }
    );
  } finally {
    console.log("Disconnecting Prisma client...");
    await prisma.$disconnect();
  }
}
