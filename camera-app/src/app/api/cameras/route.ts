import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


/**
 * @swagger
 * /api/cameras:
 *   get:
 *     summary: "Retrieve a list of all cameras"
 *     description: "This route allows the user to retrieve all camera records stored in the database."
 *     responses:
 *       200:
 *         description: "List of cameras"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: "The unique ID of the camera"
 *                   available:
 *                     type: string
 *                     description: "Availability status of the camera"
 *                   cameraname:
 *                     type: string
 *                     description: "Name of the camera"
 *                   cameranumber:
 *                     type: string
 *                     description: "Unique camera number"
 *                   position:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: "The position (latitude, longitude) of the camera"
 *       500:
 *         description: "Internal server error"
 */

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const cameras = await prisma.camera.findMany();
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return NextResponse.json({ error: 'Failed to fetch cameras' }, { status: 500 });
  }finally {
    await prisma.$disconnect();
  }
}
