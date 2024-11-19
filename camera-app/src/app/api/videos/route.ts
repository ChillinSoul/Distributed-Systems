import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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