import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

/**
 * @swagger
 * /api/create-video:
 *   post:
 *     summary: "Create a new video record"
 *     description: "This route allows the user to create a new video record by providing the camera number and number plate."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cameranumber:
 *                 type: string
 *                 description: "The unique identifier of the camera that captured the video."
 *               numberplate:
 *                 type: string
 *                 description: "The number plate of the vehicle captured in the video."
 *               typevehicule:
 *                 type: string
 *                 description: "The type of the vehicle recorded in the video"
 *     responses:
 *       201:
 *         description: "Video successfully created"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: "The unique ID of the video"
 *                 cameranumber:
 *                   type: string
 *                   description: "The camera number associated with the video"
 *                 numberplate:
 *                   type: string
 *                   description: "The number plate recorded in the video"
 *                 typevehicule:
 *                   type: string
 *                   description: "The type of the vehicle recorded in the video"
 *       400:
 *         description: "Missing required fields"
 *       500:
 *         description: "Internal server error"
 */

const prisma = new PrismaClient();

interface NewVideo {
  cameranumber: string;
  numberplate: string;
  typevehicule: string;
  createat?: Date;
}

export async function POST(req: Request) {
  try {
    const data: NewVideo = await req.json();

    const { cameranumber, numberplate, typevehicule, createat } = data;

    // Validate the input
    if (!cameranumber || !numberplate) {
      return NextResponse.json(
        { error: 'Both cameranumber and numberplate are required.' },
        { status: 400 }
      );
    }

    // Check if the camera is available
    const camera = await prisma.camera.findFirst({
      where: { cameranumber },
    });

    if (!camera) {
      return NextResponse.json(
        { error: `Camera with cameranumber '${cameranumber}' does not exist.` },
        { status: 400 }
      );
    }

    if (camera.available!="true") {
      return NextResponse.json(
        { error: `Camera with cameranumber '${cameranumber}' is not available.` },
        { status: 400 }
      );
    }

    // Create a new video in the database
    const newVideo = await prisma.video.create({
      data: {
        cameranumber,
        numberplate,
        typevehicule,
        createat: createat || undefined, // Use provided date or default to now
      },
    });

    // Return the newly created video
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);

    // Return error response
    return NextResponse.json(
      { error: 'Unable to create video' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
