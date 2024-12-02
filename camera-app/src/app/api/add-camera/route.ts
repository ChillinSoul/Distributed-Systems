import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


/**
 * @swagger
 * /api/add-camera:
 *   post:
 *     summary: "Create a new camera"
 *     description: "This route allows the user to create a new camera with details such as availability, camera name, camera number, and position (latitude and longitude)."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               available:
 *                 type: string
 *                 description: "Availability status of the camera (e.g., 'true' or 'false')"
 *               cameraname:
 *                 type: string
 *                 description: "Name of the camera"
 *               cameranumber:
 *                 type: string
 *                 description: "Unique camera number"
 *               position:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: "Array representing the latitude and longitude of the camera's position"
 *                 example: [48.8566, 2.3522]
 *             required:
 *               - available
 *               - cameraname
 *               - cameranumber
 *               - position
 *     responses:
 *       200:
 *         description: "Camera successfully created"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: "The unique ID of the camera"
 *                 available:
 *                   type: string
 *                   description: "Availability status of the camera"
 *                 cameraname:
 *                   type: string
 *                   description: "Name of the camera"
 *                 cameranumber:
 *                   type: string
 *                   description: "Unique camera number"
 *                 position:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: "The position (latitude, longitude) of the camera"
 *       400:
 *         description: "Bad Request - Missing or invalid data"
 *       500:
 *         description: "Internal server error"
 */


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
