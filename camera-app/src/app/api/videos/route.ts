import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: "Fetch all video records"
 *     description: "This route retrieves all video records from the database."
 *     responses:
 *       200:
 *         description: "List of videos fetched successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: "The unique ID of the video"
 *                   cameranumber:
 *                     type: string
 *                     description: "The camera number associated with the video"
 *                   numberplate:
 *                     type: string
 *                     description: "The number plate recorded in the video"
 *                   typevehicule:
  *                    type: string
  *                    description: "The type of the vehicle recorded in the video"
 *       500:
 *         description: "Internal server error"
 */

export async function GET() {
  const prisma = new PrismaClient();
  try {
    // Fetch all videos from the database
    const videos = await prisma.video.findMany();
    // Return the videos as JSON
    return NextResponse.json(videos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to fetch videos' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}