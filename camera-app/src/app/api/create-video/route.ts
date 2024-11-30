import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface NewVideo {
  cameranumber: string; 
  numberplate: string;
}

export async function POST(req: Request) {
  try {
    const data: NewVideo = await req.json();

    const { cameranumber, numberplate } = data;

    // Validate the input
    if (!cameranumber || !numberplate) {
      return NextResponse.json(
        { error: 'Both cameranumber and numberplate are required.' },
        { status: 400 }
      );
    }

    // Create a new video in the database
    const newVideo = await prisma.video.create({
      data: {
        cameranumber,
        numberplate,
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
