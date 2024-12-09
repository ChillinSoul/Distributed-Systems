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
 *         description: "A list of video records for the specified camera number."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: "The unique ID of the video."
 *                       cameranumber:
 *                         type: string
 *                         description: "The camera number associated with the video."
 *                       numberplate:
 *                         type: string
 *                         description: "The number plate recorded in the video."
 *                       typevehicule:
 *                         type: string
 *                         description: "The type of vehicle captured in the video."
 *                       createat:
 *                         type: string
 *                         format: date-time
 *                         description: "The creation timestamp of the video."
 *       404:
 *         description: No videos found for the given camera number.
 *       500:
 *         description: Internal server error.
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