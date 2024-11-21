import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


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