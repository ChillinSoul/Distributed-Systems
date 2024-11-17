import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { camID, time, numberPlate } = body;
  
      // Create a new video in the database
      const newVideo = await prisma.video.create({
        data: {
          camID,
          time: new Date(time), // Ensure `time` is correctly parsed as a Date
          numberPlate,
        },
      });
  
      // Return the newly created video
      return NextResponse.json(newVideo, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Unable to create video' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }